import Button from "./button"

const PageTitle = ({ children }) => {
    return (
        <div className="page-title">
            <h1><strong>{children}</strong></h1>
            <div className="log-out"><Button className="black">登出</Button></div>
        </div>
    )
}

export default PageTitle