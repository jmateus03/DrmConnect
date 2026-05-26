import { useState } from "react";
import { supabase } from "../../../supabase/supabase";

export default function EnviarResposta({ id, novaRes }){
    const [description, setDescription] = useState('')
    
    async function responderProblemas() {
        if(description == ''){
            alert('coloque algo')
            return
        }
        const { data: { user }, error } = await supabase.auth.getUser()
        if(!user || error){
            alert("usuário não logado!!")
            return
        }
        const nomeDeUsuario = user.user_metadata?.full_name || user.user_metadata?.name ||  user.user_metadata?.display_name || "??"
        const res = await supabase
        .from('problemas_respostas')
        .insert({
            id_problema: id,
            description,
            user_responde: nomeDeUsuario
        })

        if(res.error){
            console.log(res.error)
        } else{
            alert("deu bom")
            novaRes()
            setDescription('')
        }
    }
    return(
        <>
        <input type="text" value={description} onChange={e => setDescription(e.target.value)}/>
        <button onClick={() => responderProblemas()}>Enviar</button>
        </>
    )
}