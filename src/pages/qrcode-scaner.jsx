import PageTitle from "../component/page_tile"
import { Scanner } from "@yudiel/react-qr-scanner"
import { useState, useEffect } from "react"
import Button from "../component/button"
import { Link } from "react-router-dom"
import ScanLebel from "../component/scan-lebel"
import ApiService from "../service/api"
import { useDispatch } from "react-redux";
import { logout } from "../auth/authSlice"
import '../css/_qrcode-scaner.css'


const QrcodeScaner = () => {
    const [productInfo, setProductInfo] = useState(null)
    const [isScan, setIsScan] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [params, setParams] = useState([]);
    const dispatch = useDispatch()
    const api = new ApiService()
    const wtq_api = new ApiService('http://192.168.30.59:8080')

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
            const paramList = [];

            // 迭代所有參數並構建成 key-value 對
            for (const [key, value] of urlParams) {
                paramList.push({ key, value });
            }
            console.log(paramList)
            const QRCODEID = paramList[0].value
            setParams(paramList)
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
            }else{
                setErrorMessage("查無該QrcodID，請重新掃描或手動輸入")
            }
        } catch (error) {
            console.log(error)
            setErrorMessage(error.message)
        }
    }

    const saveScanData = async (product) => {
        console.log('product', product)
        try {
            const SCAN_USRID = localStorage.getItem('SYSTEM_ADMIN_CODE');
            const user_token = localStorage.getItem('user_token')
            api.setAuthorizationToken(user_token);
            await api.post("Addscan", {
                PRODUCT_NAME: product.ProductName,
                QRCODEID: product.QrCode,
                PRODUCT_CODE: product.ProductCode,
                SCAN_USRID: SCAN_USRID,
                ORIGINAL_STATUS: product.Status
            });
            setProductInfo(product)
            setErrorMessage(null)
        } catch (error) {
            console.log("保存掃描數據時出錯:", error);
            if (error.status === 401 || error.status === 403) {
                alert(error.message)
                dispatch(logout())
            }
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