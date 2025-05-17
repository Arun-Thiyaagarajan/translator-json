
const CustomButton = ({
  text = 'submit', statusText, size, icon: Icon, type = "submit",
  disabled = false, bgcolor, onClick, otherClasses='', color, isLoading=false
}) => {

  return (
    <button
      type={type}
      onClick={onClick}
      className={
        `btn ${bgcolor ?? 'btn-primary'} ${size ?? ''} capitalize ${color ?? ''} transition duration-300 hover:opacity-75 ${otherClasses}`
      }
      disabled={disabled}>
      {
        isLoading ? (
          <>
            <span className="loading loading-spinner"></span>
            {statusText}...
          </>
        ) : (
            <>
              {Icon && <Icon className='size-5' />} {text}
            </>
        ) 
      }
    </button>
  );
}
export default CustomButton;