import { useNavigation } from "react-router-dom";


const CustomButton = ({
  text = 'submit', statusText, size = 'btn-block', icon: Icon, type = "submit",
  disabled = false, bgcolor, onClick, otherClasses=''
}) => {

  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <button
      type={type}
      onClick={onClick}
      className={
        `btn ${bgcolor ?? 'btn-primary'} ${size ?? ''} capitalize text-white transition duration-300 hover:opacity-75 ${otherClasses}`
      }
      disabled={isSubmitting || disabled}>
      {
        isSubmitting ? (
          <>
            <span className="loading loading-spinner"></span>
            {statusText}
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