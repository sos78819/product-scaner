import { useForm } from "react-hook-form"
import Button from "../component/button";
import CryptoJS from 'crypto-js';
import { useDispatch } from "react-redux";
import { login } from "../auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import '../css/_login.css'

const Login = () => {
    const { register, formState: { errors }, handleSubmit } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate()

    // 獲取當前網址
    const url = window.location.href;
    // 創建 URLSearchParams 對象
    const urlParams = new URLSearchParams(window.location.search);
    // 提取參數
    const urlEmail = urlParams.get("email");
    const urlPassword = urlParams.get("password");

    useEffect(() => {
        if (urlEmail) {
            //執行登入流程
            loginhandler(urlEmail, urlPassword)
        }

    }, [urlEmail])

    const onSubmit = (data) => {
        console.log(data)
        const email = data.email
        const hashedPassword = CryptoJS.SHA256(data.password).toString();
        //執行api
       
        loginhandler(email, data.password)
    };

    const loginhandler = async (email, Password) => {
        try {
            const response = await axios.post(
                'http://localhost:3000/login',
                {
                    email: email,
                    password: Password
                }
            );
            console.log(response.data)
            dispatch(login(email));  // 更新 Redux store
            localStorage.setItem('user', email);
            localStorage.setItem('token', response.data.token);
            console.log('登入成功', response.data);
            navigate('/')
        } catch (error) {
            console.error('登入錯誤', error);
            alert(error.response.data.message)
        }


    }


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