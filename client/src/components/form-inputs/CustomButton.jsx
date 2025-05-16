import { useNavigation } from "react-router-dom";


const CustomButton = ({
  text = 'submit', statusText, size = 'btn-block', icon: Icon, type = "submit",
  disabled = false, bgcolor, onClick, otherClasses='', color
}) => {

  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <button
      type={type}
      onClick={onClick}
      className={
        `btn ${bgcolor ?? 'btn-primary'} ${size ?? ''} capitalize ${color ?? ''} transition duration-300 hover:opacity-75 ${otherClasses}`
      }
      disabled={isSubmitting || disabled}>
      {
        isSubmitting ? (
          <>
            <span className="loading loading-spinner"></span>
            {statusText}...
          </>
        ) : (
            <>
              {Icon && <Icon className='size-5' />} { text }
            </>
        ) 
      }
    </button>
  );
}
export default CustomButton;