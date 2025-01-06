const Button = ({children,className,onClick,type}) => {
    return <button onClick={onClick} type={type} className={`btn ${className}`}>{children}</button>
}
export default Button