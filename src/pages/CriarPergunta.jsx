import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabase/supabase";
import { useNavigate } from "react-router-dom";
import "../styles/criarPergunta.css"
import Question from "../assets/icons/circle-question-mark.png"
import { MessageCircleMore, Send, Shield } from 'lucide-react';
/* PAGINA PARA CRIAR PERGUNTAS PARA A AJUDADRM */
export default function CriarPergunta(){
    const [titulo, setTitulo] = useState("")
    const [descricao, setDescricao] = useState("")
    // estados para guarda as infos dos posts
    const textareaRef = useRef(null)
    // no textArea ele usa o mesmo sitema usado no ProblemasPagina.jsx (explicação mais detalhada la)
    const irPara = useNavigate()
    
    async function criarPergunta() {
        if(titulo == "" || descricao == ""){
            alert("preencha todas as caixas!")
            return
        }
        // aq ele puxa o usario para pegar nome e foto de perfil
        const { data: {user}, error } = await supabase.auth.getUser()
        const usuarioNome = user.user_metadata?.full_name || user.user_metadata?.name ||  user.user_metadata?.display_name || "???"
        const avatar = user.user_metadata?.avatar_url || null 
        const res = await supabase
        .from("perguntas")
        .insert({
            titulo,
            descricao,
            user_id: user.id,
            user_nome: usuarioNome,
            user_avatar: avatar
        })
        if(res.error) return console.error(res.error.message);
        // se a pergunta for criada, ele volta para a aba perguntas/ajuda drm
        alert("pergunta Criada!")
        irPara("/perguntas")
    }
    // mesmo sitema usado no ProblemasPagina.jsx (explicação mais detalhada la)
    useEffect(() =>{
        const textarea = textareaRef.current
        if(textarea){
            textarea.style.height = 'auto'
            textarea.style.height = `${textarea.scrollHeight}px`
        }
      }, [descricao])

    return(
        <div className="criarPergunta">
                <h1>Criar Pergunta</h1>
            <div className="barraLogo">
    <svg width="0" height="0">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
    </svg>
     <svg
        width="90"
        height="90"
        style={{
          position: "absolute",
          top: 50,
          left: 920,
          pointerEvents: "none",
        }}
      >
        <circle cx="34" cy="45" r="3" fill="url(#grad)" />
        <circle cx="45" cy="45" r="3" fill="url(#grad)" />
        <circle cx="56" cy="45" r="3" fill="url(#grad)" />
      </svg>
                <span className="barraEsquerda"><hr /></span><MessageCircleMore size={50} stroke="url(#grad)"/><span className="barraDireita"><hr /></span>
            </div>
            <div className="criarPergunta-entrada">
                <input type="text" placeholder="insira o Titulo" value={titulo} onChange={e => setTitulo(e.target.value)}/> <br />
                <textarea maxLength={200} ref={textareaRef} value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="O que você está pensando hoje?"></textarea>
             <button onClick={() => criarPergunta()}>Enviar Pergunta</button>
            </div>
    </div>
    )
}