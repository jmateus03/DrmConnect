import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabase/supabase";
import Problemas from "../components/Problemas";
import RespostasProblemas from "../components/RespostasProblemas";
import { envImagensStorage } from "../services/uploadImages";
import { useNavigate } from "react-router-dom";
import iconImagem from "./../assets/iconImagem.png"
import "./../styles/formPost.css"
import { buscarImagem } from "../services/sercheAvatar";

export default function ProblemasPagina(){
  const [ problemas, setProblemas ] = useState([])
  const [ descricao, setDescricao ] = useState("")
  const [ img, setImg ] = useState(null)
  const [ fotoDoPerfil, setFotoDoPerfil ] = useState("")
  const textareaRef = useRef(null)
  const [pagina, setPagina] = useState(0)
  const [carregamento, setCarregamento] = useState(false)
  const [temMais, setTemMais] = useState(true)
  const irPara = useNavigate()

   async function buscarProblemas(estaPagina){
    setCarregamento(true)

    const comeca = estaPagina * 10
    const ate = comeca + 10 - 1

    const res = await supabase
    .from('problemas')
    .select('*')
    .order('create_at', {ascending: false})
    .range(comeca, ate)

    if(res.error){
      alert("olha o console")
      console.error(res.error)
    } else{
      if(res.data.length < 10){
        setTemMais(false)
      }
      setProblemas((postAnteriores) => {
        const postFiltro = res.data.filter(
          (novoPost) => !postAnteriores.some((postAntigo) => postAntigo.id === novoPost.id)
        )
        return [...postAnteriores, ...postFiltro]
      })
    }
    setCarregamento(false)
  }

  async function desFazerLogin() {
    const res = supabase.auth.signOut()
  }

  async function criarProblema() {
    if(descricao == ""){
      alert("escreva algo")
      return
    }

    try{
      let imgUrlLocal = await envImagensStorage("imagens-problemas", img)
      const { data: { user }, error } = await supabase.auth.getUser()
      if(!user || error){
        alert("usuário não logado!!")
        return
      }
      const usuarioNome = user.user_metadata?.full_name || user.user_metadata?.name ||  user.user_metadata?.display_name || "???"
      const avatar = user.user_metadata?.avatar_url || null 
      const res = await supabase
      .from('problemas')
      .insert({
        user: usuarioNome,
        description: descricao,
        imagens: imgUrlLocal,
        id_user: user.id,
        avatar
      })
      buscarProblemas()
      alert("problema enviado!")
      setImg(null)
      setTitulo("")
      setDescricao("")
  }catch(error){
    console.error(error)
  }}

  const verMais = () => {
    if(!carregamento && temMais){
      setPagina((paginaAnterio) => paginaAnterio + 1)
    }
  }

  useEffect(() => {
    buscarProblemas(pagina)
    async function carregarUrlAvatar() {
      const url = await buscarImagem()
      if(url == null || !url ){
        setFotoDoPerfil("https://placeholder.com")
      }else{
        setFotoDoPerfil(url)
      }
    }
    carregarUrlAvatar()
  }, [pagina])
  
  useEffect(() =>{
    const textarea = textareaRef.current
    if(textarea){
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [descricao])

  return(
    <div>
      <button onClick={() => irPara("/home/seuUser")}>Editar perfil</button>
      <button onClick={() => irPara("/feedback")}>Feedback</button>
      <button onClick={() => irPara("/perguntas")}>Ajuda Drm</button>
      <button onClick={() => desFazerLogin()}>Logout</button>
      <div className="form-post">
        <div className="form-text">
          <img src={fotoDoPerfil} style={{width: "30px"}}/>
          <textarea maxLength={200} ref={textareaRef} value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="O que você está pensando hoje?" style={{width: "500px"}}></textarea> <br />
        </div>
        <div className="form-envio">
          <input type="file" accept="image/png,image/jpeg" onChange={e => setImg(e.target.files[0])} id="input-file" style={{display: "none"}}/>
          <label htmlFor="input-file"><img src={iconImagem} alt="Icon de imagem" style={{width: "30px", height: "30px", cursor: "pointer"}}/></label>  
          <button onClick={criarProblema}>postar</button>
        </div>

      </div>

      {problemas.map((item, index) =>(
        <div key={index} className="perguntas">
        <Problemas user={item.user} titulo={item.titulo} conteudo={item.description} imgs={item.imagens} avatar={item.avatar}/> <br />
        <RespostasProblemas id={item.id} curtida={item.curtidas}/> 
        </div>
      ))}

      {carregamento && <p>Carregando posts...</p>}

      {temMais && !carregamento && (
        <button onClick={verMais} style={{ cursor: 'pointer' }}>
          Carregar mais
        </button>
      )}

      {!temMais && <p style={{ color: 'gray' }}>Você zerou essa aba!!</p>}

    </div>
  )
}