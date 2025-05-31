import './CustomButton.css'
function CustomButton({ children, className = '', onClick, ...rest }) {
  return (
    <button
      className={`btn-base ${className}`}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}


export default CustomButton;