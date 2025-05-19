
const CustomButton = ({
  text='', statusText, size, icon: Icon, type = "button",
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
            <span className="loading loading-spinner loading-sm"></span>
            {statusText ? `${statusText}...` : ''}
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