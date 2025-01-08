import { useForm } from "react-hook-form"
import Button from "../component/button";
import CryptoJS from 'crypto-js';
import { useDispatch } from "react-redux";
import { login } from "../auth/authSlice";
import { useNavigate } from "react-router-dom";
import '../css/_login.css'

const Login = () => {
    const { register, formState: { errors }, handleSubmit } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const onSubmit = (data) => {
        console.log(data)
        const email = data.email
        const hashedPassword = CryptoJS.SHA256(data.password).toString();
        //執行api
        const user = email; 
        dispatch(login(user));  // 更新 Redux store
        navigate('/')
    };

     


    return (
        <div className="home_container">
            <h1>登入三得利</h1>
            <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                <div className="input-group">
                    <label className="" htmlFor="">輸入電子郵件</label>
                    <input className=""
                        {...register("email",
                            {
                                required: true,
                                // pattern: {
                                //     value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/,
                                //     message: '必須包含英文與數字',
                                // },

                            })} />
                    {errors.email?.type === 'required' && <p className="error-message" role="alert">請填寫email</p>}
                </div>
                <div className="input-group">
                    <label className="" htmlFor="">輸入密碼</label>
                    <input type="password" className="" {...register(
                        "password",
                        {
                            required: true,
                            // pattern: {
                            //     value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/,
                            //     message: '必須包含英文與數字',
                            // },

                        }
                    )} />
                    {errors.password?.type === 'required' && <p className="error-message" role="alert">請輸入密碼</p>}
                </div>
                <Button className="btn black btn-login" type="submit">登入</Button>

            </form>
        </div>)
}

export default Login