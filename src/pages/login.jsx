import { useForm } from "react-hook-form"
import Button from "../component/button";
import CryptoJS from 'crypto-js';
import { useDispatch } from "react-redux";
import { login } from "../auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ApiService from "../service/api";
import '../css/_login.css'

const Login = () => {
    const { register, formState: { errors }, handleSubmit } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const api = new ApiService()

    // 獲取當前網址
    // const url = window.location.href;
    // // 創建 URLSearchParams 對象
    // const urlParams = new URLSearchParams(window.location.search);
    // // 提取參數
    // const urlEmail = urlParams.get("email");
    // const urlPassword = urlParams.get("password");

    // useEffect(() => {
    //     if (urlEmail) {
    //         //執行登入流程
    //         loginhandler(urlEmail, urlPassword)
    //     }

    // }, [urlEmail])

    const onSubmit = (data) => {
        console.log(data)
        const SYSTEM_ADMIN_CODE = data.SYSTEM_ADMIN_CODE
        const hashedPassword = CryptoJS.SHA256(data.password).toString();
        //執行api
       
        loginhandler(SYSTEM_ADMIN_CODE, data.password)
    };

    const loginhandler = async (SYSTEM_ADMIN_CODE, Password) => {
        //先暫時用api-key取得token
        try {
            const response = await api.post(
                'http://localhost:3000/login',
                {
                    SYSTEM_ADMIN_CODE: SYSTEM_ADMIN_CODE,
                    SYSTEM_ADMIN_PASSWORD: Password
                }
            );
            console.log(response.data)
            dispatch(login(SYSTEM_ADMIN_CODE));  // 更新 Redux store
            localStorage.setItem('SYSTEM_ADMIN_NAME', response.data.SYSTEM_ADMIN_NAME);
            localStorage.setItem('SYSTEM_ADMIN_CODE', SYSTEM_ADMIN_CODE);
            // saveToken()
            localStorage.setItem('user_token', response.data.token);
            navigate('/')
        } catch (error) {
            console.log('登入錯誤', error);
            alert(error.response?error.response.data.message:error.message)
        }
    }


    return (
        <div className="home_container">
            <h1>登入三得利</h1>
            <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                <div className="input-group">
                    <label className="" htmlFor="">輸入帳號</label>
                    <input className=""
                        {...register("SYSTEM_ADMIN_CODE",
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