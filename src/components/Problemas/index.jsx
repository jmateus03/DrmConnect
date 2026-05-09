import Descricao from "./elements/Descricao";
import Titulo from "./elements/Titulo";

export default function Problemas({ user, titulo, conteudo }){
    return(
        <div>
            <span>feito por: {user}</span> <br />
            <Titulo titulo={titulo} /> <br />
            <Descricao conteudo={conteudo} />
        </div>
    )
}