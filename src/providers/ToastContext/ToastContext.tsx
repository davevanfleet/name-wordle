import { createContext, useContext } from "react";

type ToastContextType = {
  showToast: boolean;
  setShowToast: (value: boolean) => void;
};

export const ToastContext = createContext<ToastContextType>({
  showToast: false,
  setShowToast: () => {},
});

export const useToastContext = () => useContext(ToastContext);
