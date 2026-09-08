import { toast } from "react-toastify";

const useToastify = () => {
  const fireToastify = (message, type) => {
    if (type === "success") 
      toast.success(message);
    else if(type === "error")
      toast.error(message);
    else if(type === "warning")
      toast.warning(message);
    else if(type === "info")
      toast.info(message);
  };

  return { fireToastify };
};

export default useToastify;