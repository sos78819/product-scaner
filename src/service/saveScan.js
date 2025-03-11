import { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../auth/authSlice";
import ApiService from "./api";


const useScanHandler = () => {
    const [productInfo, setProductInfo] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [wtq_token, setWtq_token] = useState(localStorage.getItem('token'));
    const dispatch = useDispatch();
    const api = new ApiService()
    const check_api = new ApiService('http://localhost:3001')
    const wtq_api = new ApiService(import.meta.env.VITE_BASEURL)

    const saveScanData = async (product) => {
        console.log("product", product);
        try {
            const SCAN_USRID = localStorage.getItem("SYSTEM_ADMIN_CODE");
            const user_token = localStorage.getItem("user_token");
            api.setAuthorizationToken(user_token);

            // 若 Status 為 0，則先檢查狀態
            if (product.Status === "0") {
                console.log("狀態為 0，開始執行 checkStatus");
                const statusCheckSuccess = await checkStatus(product.QrCode);

                if (statusCheckSuccess) {
                    product.Status = "1";
                }
            }

            await api.post("/Addscan", {
                PRODUCT_NAME: product.ProductName,
                QRCODEID: product.QrCode,
                PRODUCT_CODE: product.ProductCode,
                SCAN_USRID: SCAN_USRID,
                ORIGINAL_STATUS: product.Status,
            });

            setProductInfo(product);
            setErrorMessage(null);
        } catch (error) {
            console.log("保存掃描數據時出錯:", error);
            if (error.status === 401 || error.status === 403) {
                alert(error.message);
                dispatch(logout());
            }
            setErrorMessage(error.message);
        }
    };

    const checkStatus = async (qrCode) => {
        try {
            const response = await check_api.get(
                `/api/deposits/by-qr-code/${qrCode}`, {},
                {
                    'X-From-Service-Code': 'QRWEB'
                }
            );

            if (response.status === 200 && response.data) {
                console.log(`checkStatus 成功: ${qrCode}`);
                setStatus(qrCode)
                return true;
            } else {
                console.log(`查無: ${qrCode}`);
                return false;
            }
        } catch (error) {
            console.error("checkStatus 發生錯誤:", error);
            return false;
        }
    };

    const setStatus = async (qrCode) => {
        try {
            wtq_api.setAuthorizationToken(wtq_token);
            const response = await wtq_api.post('/qr/setStatus', {
                "status": "1",
                "QrCode": qrCode
            })
        } catch (error) {
            console.error("setStatus 發生錯誤:", error);
            return false;
        }
    }


    return {
        saveScanData,
        setProductInfo,
        setErrorMessage,
        productInfo,
        errorMessage,
    };
};

export default useScanHandler;
