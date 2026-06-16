import { useState, useEffect } from "react";
import { supabase } from "../../../supabase/supabase";

export default function EnviarResposta({ idP, novaRes, quantidadeDeCurtidas }){
    const [description, setDescription] = useState('')
    const [qntCurti, setQntCurti] = useState(quantidadeDeCurtidas)

    async function curtida() {
        if(localStorage.getItem(idP) == null){
            const enviarCurtida = await supabase.rpc('gerenciar_curtida', {
                operacao: 'incrementar',
                p_id: idP
            })
            if(enviarCurtida.error){
                console.error(enviarCurtida.error.message)
            }
            localStorage.setItem(idP, idP)
            setQntCurti(qntCurti + 1)
        } else if(localStorage.getItem(idP) !== null){
            const desCurtir = await supabase.rpc('gerenciar_curtida', {
                operacao: 'decrementar',
                p_id: idP
            })
            localStorage.removeItem(idP)
            setQntCurti(qntCurti - 1)            
        } else{
            console.error()
        }
    }
    
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
        .from('post_respostas')
        .insert({
            id_post: idP,
            description,
            user_responde: nomeDeUsuario
        })

        if(res.error){
            console.log(res.error)
        } else{
            novaRes()
            setDescription('')
        }
    }
    useEffect(() => {
        setQntCurti(quantidadeDeCurtidas);
    }, [idP, quantidadeDeCurtidas]);
    
    return(
        <>
        <button onClick={() => curtida()}>{qntCurti}</button>
        <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Digite sua resposta"/>
        <button onClick={() => responderProblemas()}>Enviar</button>
        </>
    )
}