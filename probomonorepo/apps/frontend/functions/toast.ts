import { toast } from "react-toastify";
export const triggerToast = (message: string, type: "success" | "error") => {
  if (type === "success") {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
    });
  }
  if (type === "error") {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
    });
  }
};
