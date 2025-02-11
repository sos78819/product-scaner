import PageTitle from "../component/page_tile"
import InputQrcodeInfo from "../component/input-qrcode-info"
import Button from "../component/button"
import { useState, useRef } from "react"
import { Link } from "react-router-dom"
import ApiService from "../service/api"
import dayjs from "dayjs"


const QrcodeInput = () => {
    const inputRef = useRef(null);
    const [productInfo, setProductInfo] = useState(null)
    const [productList, setproductList] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)

    const api = new ApiService()
    const InputHandler = async () => {
        const InptQrcode = inputRef.current.value;
        console.log(InptQrcode)
        try {
            const response = await api.get("/getQrcodeList", { "SerialCode": InptQrcode })
            const productListData = response.data
            setErrorMessage(null)
            if (productListData.length > 1) {
                setproductList(productListData)
            } else {
                setProductInfo(productListData[0])
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
        try {
            await api.post("addScanData", {
                SCCSID: "",
                UID: 1,
                PRODUCT_NAME: selectProductInfo[0].ProductName,
                QRCODEID: selectProductInfo[0].QrCode,
                PRODUCT_CODE: selectProductInfo[0].ProductCode,
                POINTS: "",
                CONTENTS: "",
                SCAN_YMDTIME: dayjs().format('YYYY-MM-DD'),
                SCAN_USRID: SCAN_USRID,
                UPDATE_YMDTIME: "",
                UPDATE_USRID: "",
            })
            
            setProductInfo(selectProductInfo[0])
            setproductList(null)

        } catch (error) {
            console.log('error',error.message)
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
                            <h3>點數獲得時間：{item.ExpireDate}</h3>
                        </div>)
                    }
                </div> :
                <>
                    <div className="qrcode-input-container">
                        <InputQrcodeInfo
                            inputRef={inputRef}
                            onClick={InputHandler}
                        />
                        {productInfo &&!errorMessage && <div className="product-info"> <p>{productInfo.ProductName}{productInfo.QrCode}</p><p>輸入完成</p></div>}
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

