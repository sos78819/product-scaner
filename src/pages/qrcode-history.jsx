import PageTitle from "../component/page_tile"
import { useForm } from "react-hook-form";
import Button from "../component/button";
import { Link } from "react-router-dom";
import DatePickerOpenTo from "../component/date-picker-open-to";
import { useState } from "react";
import axios from "axios";
import '../css/_qrcode-history.css'

const QrcodeHistory = () => {
    const [data, setData] = useState("")
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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



    const fetchData = async (formattedDate) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3000/qrcode-by-date?UPDATE_YMDTIME=${formattedDate}`);
            const data = response.data
            console.log(data)
            setData(data)

        } catch (err) {
            setError(err.response.data.message);
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
            <div>
                {loading && <p>Loading...</p>}
                {error &&<p>Error: {error}</p>}
            {data && data.map((item) => <p key={item.QRCODEID}>{item.date}{item.QRCODEID}{item.PRODUCT_NAME}</p>)}
            </div>
            <Link to="/"><Button className="black qrcode-history-btn">返回上一步</Button></Link>
        </div>
    )
}

export default QrcodeHistory