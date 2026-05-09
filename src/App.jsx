import { useEffect, useState } from "react";
import { supabase } from "./supabase/supabase";
import Problemas from "./components/Problemas";
import RespostasProblemas from "./components/RespostasProblemas";

export default function App(){
  const [ problemas, setProblemas ] = useState([])
  const [ nome, setNome ] = useState("")
  const [ titulo, setTitulo ] = useState("")
  const [ descricao, setDescricao ] = useState("")

   async function buscarProblemas(){
    const res = await supabase
    .from('problemas')
    .select('*')

    if(res.error){
      alert("olha o console")
      console.error(res.error)
    } else{
      console.log(res.data)
      setProblemas(res.data)
    }
  }

  async function criarProblema() {
    const res = await supabase
    .from('problemas')
    .insert({
      user: nome,
      titulo,
      description: descricao
    })
    if(res.error){
      alert("deu bosta")
      console.error(res.error)
    }else{
      alert("problemas enviado!")
      setNome('')
      setDescricao('')
      setTitulo('')
      buscarProblemas()
    }
  }

  useEffect(() => {
    buscarProblemas()
  }, [])  

  return(
    <div>
      <h1>Bem-vindo aos problemas.com</h1>
      <p>encontre a solução aq!!!!</p>
      <div>
        <input type="text" onChange={e => setNome(e.target.value)} />
        <input type="text" onChange={e => setTitulo(e.target.value)} />
        <textarea onChange={e => setDescricao(e.target.value)}></textarea>
        <button onClick={criarProblema}>postar</button>
      </div>

      {problemas.map((item, index) =>(
        <div key={index}>
        <Problemas user={item.user} titulo={item.titulo} conteudo={item.description}/> <br />
        <RespostasProblemas id={item.id} /> 
        </div>
      ))}

    </div>
  )
}