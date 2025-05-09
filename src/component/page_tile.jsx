import Button from "./button"
import { useDispatch } from "react-redux"
import { logout } from "../auth/authSlice"

const PageTitle = ({ children }) => {
    const dispatch = useDispatch()
    const  logouthandler = () =>{
        dispatch(logout())
    }

    return (
        <div className="page-title">
            <h1><strong>{children}</strong></h1>
            <div className="log-out"><Button onClick={logouthandler} className="black log-out-btn">登出</Button></div>
        </div>
    )
}

export default PageTitle