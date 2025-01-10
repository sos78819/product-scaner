const Button = ({children,className,onClick,type,disabled}) => {
    return <button  onClick={onClick} type={type} className={`btn ${className}`} disabled={disabled}>{children}</button>
}
export default Button