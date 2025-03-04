import PageTitle from "../component/page_tile"
import { Scanner } from "@yudiel/react-qr-scanner"
import { useState, useEffect } from "react"
import Button from "../component/button"
import { Link } from "react-router-dom"
import ScanLebel from "../component/scan-lebel"
import ApiService from "../service/api"
import '../css/_qrcode-scaner.css'
import useScanHandler from "../service/saveScan"


const QrcodeScaner = () => {
 
    const [isScan, setIsScan] = useState(false)
    const wtq_api = new ApiService(import.meta.env.VITE_BASEURL)
    const { saveScanData,setProductInfo,setErrorMessage,productInfo, errorMessage } = useScanHandler();
    const [wtq_token, setWtq_token] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const checkToken = async () => {
            if (!wtq_token) {
                try {
                    console.log('🔄 無 Token，正在獲取新 Token...');
                    const newToken = await wtq_api.refreshToken();
                    if (newToken !== null) {
                        localStorage.setItem('token', newToken);
                        setWtq_token(newToken); // 更新 state
                        console.log('✅ 新 Token 獲取成功:', newToken);
                    }
                } catch (error) {
                    console.error('❌ 獲取 Token 失敗:', error);
                }
            }
        };

        checkToken();
    }, [wtq_token]);




    const scanHandler = (result) => {
        if (result) {
            console.log('result', result)
            setIsScan(true)
            const cleanedUrl = result[0].rawValue.replace(/^"|"$/g, '');
            const parsedUrl = new URL(cleanedUrl);
            const urlParams = new URLSearchParams(parsedUrl.search);
            const QRCODEID = urlParams.get('qrcode');
            setTimeout(() => setIsScan(false), 1000)
            console.log('QRCODEID', QRCODEID)
            if (QRCODEID) {
                //呼叫api查詢商品資訊              
                fetchQrcode(QRCODEID)
            } else {
                setErrorMessage("Qrcode不正確，請重新掃描或手動輸入")
            }
        }
    }

    const fetchQrcode = async (QrCode) => {
        try {
            wtq_api.setAuthorizationToken(wtq_token);
            const response = await wtq_api.post("/qr/checkStatus", { "QrCode": QrCode, })
            const productListData = response.data.data
            console.log(productListData)
            if (productListData.length !== 0) {
                //如果有該id，儲存scanData               
                saveScanData(productListData[0])
            } else {
                setErrorMessage("查無該QrcodID，請重新掃描或手動輸入")
            }
        } catch (error) {
            console.log(error)
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
                allowMultiple={true}
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
                {productInfo.status === "2" && <p>該筆已退貨</p>}
                <p>掃描完成</p>
            </> : <p>掃描QR CODE貼紙</p>}
            {errorMessage && <p>{errorMessage}</p>}


        </div>
        <div className="btn-container">
            <Link to='/'><Button className="black w-full">回首頁</Button></Link>
            <Link to='/scaner/list'><Button className="black w-full">下一步</Button></Link>
        </div>
    </div>


}

export default QrcodeScaner