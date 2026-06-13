import "./style.css"
import Botao from "../../ui/Botoes"
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../assets/logo/logo.png"
import { House, Handshake, UserRoundPen, Star, LogOut } from 'lucide-react';
import { supabase } from "../../supabase/supabase"

export default function Sidebar() {
    const irPara = useNavigate()
    const location = useLocation()

    async function desFazerLogin() {
        await supabase.auth.signOut()
    }

    return (
        <div className="container">
            <img src={Logo} alt="Logo" />

            <div className="btn-redirecionamentos">
                <Botao
                    texto="Comunidade"
                    icon={House}
                    onClick={() => irPara("/home")}
                    className={location.pathname === "/home" ? "btn ativo" : "btn"}
                />

                <Botao
                    texto="Ajuda DRM"
                    icon={Handshake}
                    onClick={() => irPara("/perguntas")}
                    className={location.pathname === "/perguntas" ? "btn ativo" : "btn"}
                />

                <Botao
                    texto="Perfil"
                    icon={UserRoundPen}
                    onClick={() => irPara("/home/seuUser")}
                    className={location.pathname === "/home/seuUser" ? "btn ativo" : "btn"}
                />

                <Botao
                    texto="Feedback"
                    icon={Star}
                    onClick={() => irPara("/feedback")}
                    className={location.pathname === "/feedback" ? "btn ativo" : "btn"}
                />
            </div>

            <Botao
                texto="Logout"
                icon={LogOut}
                onClick={() => desFazerLogin()}
                className="btn"
            />
        </div>
    )
}