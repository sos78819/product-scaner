import React, { useEffect, useState } from "react";
import ApiService from "../service/api";
import PageTitle from "../component/page_tile";
import { Link } from "react-router-dom";
import Button from "../component/button";
import { logout } from "../auth/authSlice";
import { useDispatch } from "react-redux";

const QrcodeScanList = () => {
    const [data, setData] = useState("");
    const [guropData, setguropData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [Uploadprogress, setUploadprogress] = useState(false);
    const [IsUpload, setUpload] = useState(null);
    const dispatch = useDispatch()
    const api = new ApiService()
    const delete_api = new ApiService('http://localhost:3001')
    const user_token = localStorage.getItem('user_token')
    api.setAuthorizationToken(user_token);

    const handleUpload = async () => {
        try {
            setUploadprogress(true); // 開始上傳前設置進度
            console.log("開始刪除 QRCode...");
            await deleteQrcode(); // 先刪除
            console.log("刪除完成，開始更新掃描記錄...");
            await updateScan(); // 再更新
            console.log("更新完成！");
        } catch (error) {
            console.error("handleUpload 過程中發生錯誤:", error);
            setUpload("error");
        } finally {
            setUploadprogress(false); // 不論成功或失敗都要關閉進度狀態
        }
    };

    //執行put
    const updateScan = async () => {
        const SYSTEM_ADMIN_CODE = localStorage.getItem('SYSTEM_ADMIN_CODE')
        const updateData = {
            QRCODEIDs: data.map(item => item.qrcodeid),
            UPDATE_USRID: SYSTEM_ADMIN_CODE
        };
        console.log('updateData', updateData)
        try {
            const response = await api.put("/updateScanResume",
                updateData
            );
            console.log(response)
            if (response.status === 200) {
                setUpload("success")

            } else {
                setUpload("error")
            }
        } catch (error) {
            console.log(error)
            if (error.status === 401 || error.status === 403) {
                alert(error.message)
                dispatch(logout())
            }
            console.error("Upload failed:", error.message);
            setUpload("error")

        }

    }
    //執行刪除
    const deleteQrcode = async () => {
        try {
            await Promise.all(data.map(item =>
                delete_api.put(`/api/deposits/by-qr-code/${item.qrcodeid}/give-cancel`, {},
                    {

                        'X-From-Service-Code': 'QRWEB'

                    }
                )
            ));
            console.log("所有 QRCode 已刪除");
        } catch (error) {
            console.error("刪除過程中發生錯誤:", error);

        };
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/scanResume");
                const data = response.data
                console.log(data)
                const productCounts = data.reduce((acc, item) => {
                    acc[item.product_name] = (acc[item.product_name] || 0) + 1;
                    return acc;
                }, {});
                setguropData(productCounts)
                setData(data);
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);



    return (
        <div className="page-container">
            <PageTitle>上傳掃描資訊</PageTitle>
            <h2>{IsUpload === "success" ? '總計上傳數量' : '總計掃描數量'}：{data.length}</h2>
            <div className="product-group-container">
                {data && Object.entries(guropData).map(([product, count]) => (
                    <p key={product}><span><strong>{product}</strong>：</span>{count}個</p>
                ))}
            </div>
            <div className="product-container">
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
                {data && data.map((item, idx) => <p key={item.qrcodeid}>{idx + 1}.{item.qrcodeid}{item.product_name}</p>)}
            </div>
            <div className="upload-message-container">
                {Uploadprogress && <h3>上傳中...</h3>}
                {IsUpload === "success" && <h3>✅上傳成功!</h3>}
                {IsUpload === "error" && <h3> ❌上傳失敗!</h3>}
            </div>
            <div className="btn-container">
                <Link to='/scaner'><Button className="black w-full">返回上一頁</Button></Link>
                <Button onClick={handleUpload} disabled={error || IsUpload === 'success' || data.length === 0} className="black w-full">確定上傳</Button>
            </div>
        </div>
    );
};

export default QrcodeScanList;
