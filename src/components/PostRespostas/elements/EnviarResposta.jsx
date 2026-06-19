import { useState, useEffect } from "react";
import { supabase } from "../../../supabase/supabase";
import { Heart } from 'lucide-react';
import "../style.css"

export default function EnviarResposta({ idP, novaRes, quantidadeDeCurtidas }){
    const [description, setDescription] = useState('')
    const [qntCurti, setQntCurti] = useState(quantidadeDeCurtidas)
    const [curtida, setCurtida] = useState(false)

    async function curtidas() {
        const operacao = curtida ? 'decrementar' : 'incrementar';
        
        const novaQtd = curtida ? qntCurti - 1 : qntCurti + 1;
        setQntCurti(novaQtd);
        setCurtida(!curtida);

        const { error } = await supabase.rpc('gerenciar_curtida', {
            operacao,
            p_id: idP
        });

        if (error) {
            setQntCurti(qntCurti);
            setCurtida(curtida);
            console.error(error.message);
            return;
        }


        if (!curtida) {
            localStorage.setItem(`curtida_${idP}`, 'true');
        } else {
            localStorage.removeItem(`curtida_${idP}`);
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
        setCurtida(!!localStorage.getItem(`curtida_${idP}`));
        setQntCurti(quantidadeDeCurtidas);
    }, [idP, quantidadeDeCurtidas]);
    
    return(
        <>
        <input type="text" value={description} className="resposta" onChange={e => setDescription(e.target.value)} placeholder="Digite sua resposta"/>

        <button onClick={() => responderProblemas()} className="enviar">Enviar</button>

        <button onClick={() => curtidas()} className="btn-curtida">
                <Heart color={curtida ? "red" : "gray"} fill={curtida ? "red" : "none"} /> 
                <span>{qntCurti}</span>
        </button>
        </>
    )
}