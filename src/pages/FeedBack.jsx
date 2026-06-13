import FeedbackInput from "../components/FeedbackInput"
import Sidebar from "../layout/Sidebar"
/* PAGINA DE FEEDBACKS */
export default function FeedBack(){
    // no componente tem a explicação
    return(
        <div className="container-feedback">
        <Sidebar />
        <FeedbackInput />
        </div>
    )
}