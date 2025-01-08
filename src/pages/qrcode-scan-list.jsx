import React, { useEffect, useState } from "react";
import axios from "axios";
import PageTitle from "../component/page_tile";
import { Link } from "react-router-dom";
import Button from "../component/button";

const QrcodeScanList = () => {
    const [data, setData] = useState("");
    const [guropData, setguropData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [Uploadprogress, setUploadprogress] = useState(false);
    const [IsUpload, setUpload] = useState(null);

    const handleUpload = async () => {
        try {
            setUploadprogress(true)
            const response = await axios.post("http://localhost:3001/uploadqrcode");
            if (response.status === 200) {
                setUpload("success")
                setUploadprogress(false)
            } else {
                setUpload("error")
                setUploadprogress(false)
            }

        } catch (error) {
            console.error("Upload failed:", error);
            setUpload("error")
            setUploadprogress(false)
        }

    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:3001/qrcode");
                const data = response.data
                console.log(data)
                const productCounts = data.reduce((acc, item) => {
                    acc[item.PRODUCT_NAME] = (acc[item.PRODUCT_NAME] || 0) + 1;
                    return acc;
                }, {});
                setguropData(productCounts)
                setData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);



    return (
        <div className="page-container">
            <PageTitle>上傳掃描資訊</PageTitle>
            <h2>總計上傳數量：{data.length}</h2>
            <div className="product-group-container">
                {data && Object.entries(guropData).map(([product, count]) => (
                    <p key={product}><span><strong>{product}</strong>：</span>{count}個</p>
                ))}
            </div>
            <div className="product-container">
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
                {data && data.map((item, idx) => <p key={item.code}>{idx + 1}.{item.QRCODEID}{item.PRODUCT_NAME}</p>)}
            </div>
            <div className="upload-message-container">
                {Uploadprogress && <h3>上傳中...</h3>}
                {IsUpload === "success" && <h3>✅上傳成功!</h3>}
                {IsUpload === "error" && <h3> ❌上傳失敗!</h3>}
            </div>
            <div className="btn-container">
                <Link to='/scaner'><Button className="black w-full">返回上一頁</Button></Link>
                <Button onClick={handleUpload} className="black w-full">確定上傳</Button>
            </div>
        </div>
    );
};

export default QrcodeScanList;
