import "./style.css"

export default function Botoes({ texto, icon: Icon, ...rest }) {
    return(
        <>
            <button {...rest}>{Icon && <Icon size={18}/>} {texto}</button>
        </>
    )
}