import { X } from "lucide-react";

const DaisyModal = ({ children, headerTitle }) => {
  return (
    <dialog id="daisy_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        {
          headerTitle && 
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">{ headerTitle }</h3>
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost">
                <X size={20} />
              </button>
            </form>
          </div>
        }
        <div className="py-4">
          { children }
        </div>
        {
          !headerTitle && 
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        }
      </div>
    </dialog>
  );
}

export default DaisyModal;
