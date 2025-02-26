import PageTitle from "../component/page_tile"
import { useForm } from "react-hook-form";
import Button from "../component/button";
import { Link } from "react-router-dom";
import DatePickerOpenTo from "../component/date-picker-open-to";
import { useState } from "react";
import ApiService from "../service/api";
import BasicTable from "../component/table";
import { logout } from "../auth/authSlice";
import { useDispatch } from "react-redux";
import '../css/_qrcode-history.css'


const QrcodeHistory = () => {
    const [data, setData] = useState("")
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch()
    const api = new ApiService()
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            date: null,
        },
    });

    const onSubmit = (data) => {
        const formattedDate = data.date ? data.date.format("YYYY-MM-DD") : null;
        console.log("Form data:", formattedDate);
        setError(null)
        setData("")
        fetchData(formattedDate);

    };
    const user_token = localStorage.getItem('user_token')
    api.setAuthorizationToken(user_token);

    const fetchData = async (formattedDate) => {
        setLoading(true);

        try {
            const response = await api.get(
                `/scanResumeByDate?UPDATE_YMDTIME=${formattedDate}`,
            );
            const data = response.data;
            console.log(data);
            setData(data);
        } catch (err) {
            console.log(err)
            if (err.status === 401 || err.status === 403) {
                alert(err.message)
                dispatch(logout())
            }
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="page-container">
            <PageTitle>掃描歷史資訊</PageTitle>
            <div className="date-picker-form-container">
                <form className="date-form" onSubmit={handleSubmit(onSubmit)}>
                    {/* <DateRange control={control} getValues={getValues} setValue={setValue} errors={errors} watch={watch} /> */}
                    <DatePickerOpenTo control={control} errors={errors} />
                    <Button className="black qrcode-history-btn " type="submit">查詢</Button>
                </form>
            </div>
            <p><strong>總筆數：{data.length}</strong></p>          
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
                {data && <BasicTable rows={data}/>}            
            <Link to="/"><Button className="black qrcode-history-btn">返回上一步</Button></Link>
        </div>
    )
}

export default QrcodeHistory