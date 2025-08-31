import { useEffect, useState } from "react";
import { ToastContext } from "./ToastContext";

export const ToastContextProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, setShowToast }}>
      {showToast && <div className="toast">Not a valid name!</div>}
      {children}
    </ToastContext.Provider>
  );
};
