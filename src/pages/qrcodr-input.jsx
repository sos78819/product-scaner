import PageTitle from "../component/page_tile"
import InputQrcodeInfo from "../component/input-qrcode-info"
import Button from "../component/button"
import { useState, useRef } from "react"
import { Link } from "react-router-dom"
import ApiService from "../service/api"
import dayjs from "dayjs"
import { useDispatch } from "react-redux";
import { logout } from "../auth/authSlice"

const QrcodeInput = () => {
    const inputRef = useRef(null);
    const [productInfo, setProductInfo] = useState(null)
    const [productList, setproductList] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)

    const api = new ApiService()
    const wtq_api = new ApiService('http://192.168.30.59:8080')
    const dispatch = useDispatch()
    const InputHandler = async () => {
        const InptQrcode = inputRef.current.value;
        const wtq_token = localStorage.getItem('token')
        console.log(wtq_token)
        console.log(InptQrcode)
        try {
            wtq_api.setAuthorizationToken(wtq_token);
            const response = await wtq_api.post("/qr/checkStatus", { "SerialCode": InptQrcode, })
            const productListData = response.data.data
            console.log(productListData)
            setErrorMessage(null)
            if (productListData.length > 1) {
                setproductList(productListData)
            } else if(productListData.length === 1){
                setProductInfo(productListData[0])
            }else{
                setErrorMessage('查無該SerialCode')
            }
        } catch (error) {
            console.log(error)
            setErrorMessage(error.message)
        }
    }

    const selectProduct = async (ExpireDate) => {

        const selectProductInfo = productList.filter((item) => item.ExpireDate === ExpireDate)
        console.log(selectProductInfo)
        const SCAN_USRID = localStorage.getItem('SYSTEM_ADMIN_CODE')
        const user_token = localStorage.getItem('user_token')
        api.setAuthorizationToken(user_token);
        try {
            await api.post("Addscan", {
                PRODUCT_NAME: selectProductInfo[0].ProductName,
                QRCODEID: selectProductInfo[0].QrCode,
                PRODUCT_CODE: selectProductInfo[0].ProductCode,
                SCAN_USRID: SCAN_USRID,
                ORIGINAL_STATUS: selectProductInfo[0].Status

            })

            setProductInfo(selectProductInfo[0])
            setproductList(null)

        } catch (error) {
            console.log('error', error)
            if (error.status === 401 || error.status === 403) {
                alert(error.message)
                dispatch(logout())
            }
            setErrorMessage(error.message)
            setproductList(null)
        }

    }

    return (
        <div className="page-container">
            <PageTitle>上傳掃描資訊</PageTitle>
            {productList ?
                <div className="qrcode-input-container">
                    <div className=""><h1>選擇哪一個？</h1></div>
                    {productList.map((item) =>
                        <div onClick={() => selectProduct(item.ExpireDate)} className="select_product_item" key={`${item.QrCode}`}>
                            <h3>{item.ProductName}</h3>
                            <h3>點數獲得時間：{dayjs(item.ExpireDate).format('YYYY-MM-DD')}</h3>
                        </div>)
                    }
                </div> :
                <>
                    <div className="qrcode-input-container">
                        <InputQrcodeInfo
                            inputRef={inputRef}
                            onClick={InputHandler}
                        />
                        {productInfo && !errorMessage && <div className="product-info"> <p>{productInfo.ProductName}{productInfo.QrCode}</p><p>輸入完成</p></div>}
                        {errorMessage && <div className="product-info">{errorMessage}</div>}
                    </div>
                    <div className="btn-container">
                        <Link to='/scaner'><Button className="black w-full">回掃描</Button></Link>
                        <Link to='/scaner/list'><Button className="black w-full">下一步</Button></Link>
                    </div>
                </>

            }

        </div>
    )
}

export default QrcodeInput

