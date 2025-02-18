import PageTitle from "../component/page_tile"
import { Scanner } from "@yudiel/react-qr-scanner"
import { useState } from "react"
import Button from "../component/button"
import { Link } from "react-router-dom"
import ScanLebel from "../component/scan-lebel"
import ApiService from "../service/api"
import dayjs from "dayjs"
import '../css/_qrcode-scaner.css'

const QrcodeScaner = () => {
    const [productInfo, setProductInfo] = useState(null)
    const [isScan, setIsScan] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [params, setParams] = useState([]);
  

    const api = new ApiService()

    const scanHandler = (result) => {
        if (result) {
            console.log('result', result)
            setIsScan(true)
            const cleanedUrl = result[0].rawValue.replace(/^"|"$/g, '');
            const parsedUrl = new URL(cleanedUrl);
            const urlParams = new URLSearchParams(parsedUrl.search);
            const paramList = [];

            // 迭代所有參數並構建成 key-value 對
            for (const [key, value] of urlParams) {
                paramList.push({ key, value });
            }
            console.log(paramList)
            const QRCODEID = paramList.filter((param) => param.key === "qrCode")
            setParams(paramList)
            setTimeout(() => setIsScan(false), 1000)
            if (QRCODEID) {
                //呼叫api查詢商品資訊
                console.log(QRCODEID)
                fetchQrcode(QRCODEID[0].value)
            } else {
                setErrorMessage("Qrcode不正確，請重新掃描或手動輸入")
            }
        }

    }
    const fetchQrcode = async (QrCode) => {
        try {
            const response = await api.get("/getQrcodeList", { "QrCode": QrCode })
            const productListData = response.data
            if (productListData.length) {                
                //如果有該id，儲存scanData
                saveScanData(productListData[0])  
            }
        } catch (error) {
            console.log(error)
            setErrorMessage(error.message)
        }
    }

    const saveScanData = async (product) => {
        try {
            const SCAN_USRID = localStorage.getItem('SYSTEM_ADMIN_CODE');
            await api.post("aAddscan", {          
                PRODUCT_NAME: product.ProductName,
                QRCODEID: product.QrCode,
                PRODUCT_CODE: product.ProductCode,      
                SCAN_USRID: SCAN_USRID,
                ORIGINAL_STATUS:product.Status
            });
            setProductInfo(product)
            setErrorMessage(null)
        } catch (error) {
            console.error("保存掃描數據時出錯:", error);
            setErrorMessage(error.message)
        }
    }


    return <div className="page-container">
        <PageTitle>Qrcode掃描</PageTitle>
        <div className="qrcode-container">
            <Link to='/qrcode-input' className="switch-input"><div><Button className="black">切換為手動輸入</Button></div></Link>
            <Scanner
                onScan={scanHandler}
                scanDelay={1000}
                allowMultiple={false}
                styles={
                    {
                        finderBorder: 30
                    }
                }
                children={isScan && <ScanLebel />}
                onError={(error) => console.error("Scanner error:", error)}
            />
        </div>
        <div className="product-info">
            {productInfo ? <>
                <p>{productInfo.ProductName}{productInfo.ProductCode}</p>
                <p>掃描完成</p>
            </>:<p>掃描QR CODE貼紙</p>}
            {errorMessage && <p>{errorMessage}</p>}


        </div>
        <div className="btn-container">
            <Link to='/'><Button className="black w-full">回首頁</Button></Link>
            <Link to='/scaner/list'><Button className="black w-full">下一步</Button></Link>
        </div>
    </div>


}

export default QrcodeScaner