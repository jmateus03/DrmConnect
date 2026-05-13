import Descricao from "./elements/Descricao";
import Titulo from "./elements/Titulo";

export default function Problemas({ user, titulo, conteudo, imgs }){
    return(
        <div>
            <span>feito por: {user}</span> <br />
            <Titulo titulo={titulo} /> <br />
            {imgs == null ? <span></span> : <img src={imgs} style={{width: "100px"}}/>}
            <Descricao conteudo={conteudo} />
        </div>
    )
}