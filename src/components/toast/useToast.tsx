import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";

import styles from "./style.module.css";

interface ToastContextType {
  toasts: ToastType[];
  setToasts: Dispatch<SetStateAction<ToastType[]>>;
  addToast: (message: string, type: ToastMessageType) => void;
}

type ToastMessageType = "success" | "error" | "info";

interface ToastType {
  id: number;
  message: string;
  type: ToastMessageType;
}

interface ToastContextProviderPropsTypes {
  children: ReactNode;
}

interface ToastComponentPropsType extends ToastType {
  addToast: (message: string, type: ToastMessageType) => void;
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);
const ACTIVE_INTERVAL = 5;
const MAX_TOASTS = 5;

function ToastComponent({
  id,
  message,
  type,
  removeToast,
}: ToastComponentPropsType) {
  const [timeTillDelete, setTimeTillDelete] = useState(ACTIVE_INTERVAL);
  const timerId = useRef(-1);

  function getBgColor() {
    if (type === "success") return "green";
    else if (type === "error") return "red";
    return "blue";
  }

  function onMouseEnter() {
    clearInterval(timerId.current);
  }

  function onMouseLeave() {
    timerId.current = setInterval(() => {
      setTimeTillDelete((prev) => prev - 1);
    }, 1000);
  }

  useEffect(() => {
    if (timeTillDelete <= 0) {
      removeToast(id);
    }
  }, [timeTillDelete]);

  useEffect(() => {
    timerId.current = setInterval(() => {
      setTimeTillDelete((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId.current);
  }, []);

  console.log(timeTillDelete);

  return (
    <div
      className={styles.toast}
      style={{
        backgroundColor: getBgColor(),
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <p className={styles.toastText}>{message}</p>

      <button
        onClick={() => {
          clearInterval(timerId.current);
          removeToast(id);
        }}
      >
        X
      </button>
    </div>
  );
}

export function ToastContextProvider({
  children,
}: ToastContextProviderPropsTypes) {
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const [toastId, setToastId] = useState(0);

  function addToast(message: string, type: ToastMessageType) {
    if (toasts.length >= MAX_TOASTS) return;

    const id = toastId;

    setToastId((prev) => prev + 1);
    setToasts((prev) => [
      ...prev,
      {
        id,
        message,
        type,
      },
    ]);
  }

  function removeToast(id: number) {
    setToasts((prev) => prev.filter((obj) => obj.id !== id));
  }

  return (
    <ToastContext.Provider
      value={{
        toasts,
        setToasts,
        addToast,
      }}
    >
      {children}
      <div className={styles.toastContainer}>
        {toasts.map((toast) => (
          <ToastComponent
            key={toast.id}
            {...toast}
            addToast={addToast}
            removeToast={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastContextProvider");
  }

  return context;
}

export default useToast;
