import PageTitle from "../component/page_tile"
import { Scanner } from "@yudiel/react-qr-scanner"
import { useState, useRef } from "react"
import Button from "../component/button"
import { Link } from "react-router-dom"
import InputQrcodeInfo from "../component/input-qrcode-info"
import '../css/_qrcode-scaner.css'

const QrcodeScaner = () => {
    const [productInfo, setProductInfo] = useState("掃描QR CODE貼紙")
    const [isScan, setIsScan] = useState(false)
    const [params, setParams] = useState([]);
    const [IsInput, setIsInput] = useState(false)
    const [InputSucess, setInputSucess] = useState(false)
    const [sacnSucess, setScanSucess] = useState(false)

    const inputRef = useRef(null);

    const switchInput = () => {
        setIsInput((pre) => !pre)
    }
    function handleInput() {
        const InptQrcode = inputRef.current.value;
        console.log(InptQrcode)
        setProductInfo(InptQrcode)
        setScanSucess(false)
        setInputSucess(true)
    }

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
            const product = paramList.filter((param) => param.key === "product")
            setParams(paramList)
            setTimeout(() => setIsScan(false), 1000)
            if (product.length !== 0) {
                setProductInfo(product[0].value)
                setScanSucess(true)
                setInputSucess(false)
            } else {
                setProductInfo("查無該產品")
                setScanSucess(false)
                setInputSucess(false)
            }
        }

    }


    return <div className="page-container">
        <PageTitle>Qrcode掃描</PageTitle>
        <div className="qrcode-container">
            <Button onClick={switchInput} className="black switch-input">切換為手動輸入</Button>
            {IsInput &&
                <InputQrcodeInfo
                    inputRef={inputRef}
                    onClick={handleInput}
                />}
            <Scanner
                onScan={scanHandler}
                allowMultiple={true}
                styles={
                    {
                        finderBorder: 30
                    }
                }
                onError={(error) => console.error("Scanner error:", error)}
            />
        </div>
        <div className="product-info">
            {productInfo}
            {sacnSucess ? <p>掃描完成</p>:InputSucess && <p>輸入完成</p>}
           
        </div>
        <div className="btn-container">
            <Link to='/'><Button className="black w-full">回首頁</Button></Link>
            <Link to='/scaner/list'><Button className="black w-full">下一步</Button></Link>
        </div>
    </div>


}

export default QrcodeScaner