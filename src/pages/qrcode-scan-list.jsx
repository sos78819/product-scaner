import React, { useEffect, useState } from "react";
import axios from "axios";
import PageTitle from "../component/page_tile";
import { Link } from "react-router-dom";
import Button from "../component/button";

const QrcodeScanList = () => {
    const [data, setData] = useState(null);
    const [guropData, setguropData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [Uploadprogress, setUploadprogress] = useState(false);
    const [IsUpload, setUpload] = useState(null);

    const handleUpload = async () => {
        try {
            setUploadprogress(true)
            const response = await axios.post("http://localhost:3002/productUpload");
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
                const response = await axios.get("http://localhost:3002/qrcodeHistory");
                const data = response.data
                console.log(data)
                const productCounts = data.reduce((acc, item) => {
                    
                    acc[item.product] = (acc[item.product] || 0) + 1;
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="page-container">
            <PageTitle>上傳掃描資訊</PageTitle>
            <h2>總計上傳數量：{data.length}</h2>
            <div className="product-group-container">
                {Object.entries(guropData).map(([product, count]) => (
                    <p key={product}><span><strong>{product}</strong>：</span>{count}個</p>
                ))}
            </div>
            <div className="product-container">
                {data.map((item, idx) => <p key={item.code}>{idx + 1}.{item.code}{item.product}</p>)}
            </div>
            <div className="upload-message-container">
                {Uploadprogress && <h3>上傳中...</h3>}
                {IsUpload === "success" && <h3>✅上傳成功!</h3>}
                {IsUpload === "error" && <h3> ❌上傳失敗!</h3>}
            </div>
            <div className="btn-container">
                <Link to='/'><Button className="black w-full">返回首頁</Button></Link>
                <Button onClick={handleUpload} className="black w-full">確定上傳</Button>
            </div>
        </div>
    );
};

export default QrcodeScanList;
