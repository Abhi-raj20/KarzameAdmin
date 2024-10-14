
// import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import "./toast.css";


export const showStyledToast = (type, heading, detail, OnClick) => {
    if (type === 'info') {
        toast.info(
            <div>
                <h3>{heading}</h3>
                <p>{detail}</p>
            </div>,
            {
                position: toast.POSITION.TOP_CENTER, // Toast position
                autoClose: 7000, // Auto-close after 7 seconds
                hideProgressBar: false, // Show progress bar
                closeOnClick: true, // Close on click
                pauseOnHover: true, // Pause auto-close on hover
                onClick: OnClick, // Callback on click
            }
        );
    }
};