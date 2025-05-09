import Input from "./input"
import Button from "./button"
const InputQrcodeInfo = ({ inputRef, onClick }) => {

    return (
    <div className="qrcode-info-container">
        <label><strong>請輸入Qrcode貼紙上的序號</strong></label>
        <div className="qrcode-info-input-container">
            <Input inputRef={inputRef} className="qrcode-info-input" />
            <Button onClick={onClick} className="black">確認</Button>
        </div>
    </div>
    )


}

export default InputQrcodeInfo