import { createContext, useContext, useEffect, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";

import styles from "./style.module.css";

interface ToastContextType {
  toasts: ToastType[];
  setToasts: Dispatch<SetStateAction<ToastType[]>>;
  addToast: (message: string, type: ToastMessageType) => void;
  removeToast: (id: number) => void;
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
  addTimer: (id: number) => void;
  removeTimer: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);
const ACTIVE_INTERVAL = 5;
const MAX_TOASTS = 5;

function ToastComponent({
  id,
  message,
  type,
  addTimer,
  removeTimer,
}: ToastComponentPropsType) {
  const { removeToast } = useToast();

  function getBgColor() {
    if (type === "success") return "green";
    else if (type === "error") return "red";
    return "blue";
  }

  return (
    <div
      className={styles.toast}
      style={{
        backgroundColor: getBgColor(),
      }}
      onMouseEnter={() => removeTimer(id)}
      onMouseLeave={() => addTimer(id)}
    >
      <p className={styles.toastText}>{message}</p>

      <button onClick={() => removeToast(id)}>X</button>
    </div>
  );
}

export function ToastContextProvider({
  children,
}: ToastContextProviderPropsTypes) {
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const [toastId, setToastId] = useState(0);
  const [idMap, setIdMap] = useState<Map<number, number>>(() => new Map());

  function addToast(message: string, type: ToastMessageType) {
    const id = toastId;

    const timerid = setTimeout(() => {
      setToasts((prev) => prev.filter((obj) => obj.id !== id));
      setIdMap((prev) => {
        const map = structuredClone(prev);

        map.delete(id);

        return map;
      });
    }, ACTIVE_INTERVAL * 1000);

    setToastId((prev) => prev + 1);
    setToasts((prev) => [
      ...prev,
      {
        id,
        message,
        type,
      },
    ]);
    setIdMap((prev) => {
      const map = structuredClone(prev);

      map.set(id, timerid);

      return map;
    });
  }

  function removeToast(id: number) {
    const timerid = idMap.get(id);

    clearTimeout(timerid);

    setToasts((prev) => prev.filter((obj) => obj.id !== id));
    setIdMap((prev) => {
      const map = structuredClone(prev);

      map.delete(id);

      return map;
    });
  }

  function addTimer(id: number) {
    const timerid = setTimeout(() => {
      setToasts((prev) => prev.filter((obj) => obj.id !== id));
      setIdMap((prev) => {
        const map = structuredClone(prev);

        map.delete(id);

        return map;
      });
    }, ACTIVE_INTERVAL * 1000);

    setIdMap((prev) => {
      const map = structuredClone(prev);

      map.set(id, timerid);

      return map;
    });
  }

  function removeTimer(id: number) {
    clearTimeout(idMap.get(id));
    setIdMap((prev) => {
      const map = structuredClone(prev);

      map.delete(id);

      return map;
    });
  }

  // useEffect(() => {
  //   const activeToasts = toasts.slice(0, MAX_TOASTS);
  //   const newEntries: [number, number][] = [];

  //   for (const activeToast of activeToasts) {
  //     if (!idMap.has(activeToast.id)) {
  //       const timerid = setTimeout(() => {
  //         setToasts((prev) => prev.filter((obj) => obj.id !== activeToast.id));
  //         setIdMap((prev) => {
  //           const map = structuredClone(prev);

  //           map.delete(activeToast.id);

  //           return map;
  //         });
  //       }, ACTIVE_INTERVAL * 1000);

  //       newEntries.push([activeToast.id, timerid]);
  //     }
  //   }
  //   setIdMap((prev) => {
  //     const map = structuredClone(prev);

  //     newEntries.forEach(([id, timerid]) => {
  //       map.set(id, timerid);
  //     });

  //     return map;
  //   });
  // }, [toasts]);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        setToasts,
        addToast,
        removeToast,
      }}
    >
      {children}
      <div className={styles.toastContainer}>
        {toasts.map((toast) => (
          <ToastComponent
            key={toast.id}
            {...toast}
            addTimer={addTimer}
            removeTimer={removeTimer}
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
