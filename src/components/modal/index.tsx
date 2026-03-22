import { useEffect, useRef, useState, type ReactNode } from "react";

import styles from "./style.module.css";
import { createPortal } from "react-dom";

interface ModalProps {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
}

function Modal({ children, onClose, open }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const bgFocusElement = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const keydownHandler = (e: KeyboardEvent) => {
      const { key } = e;
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, a, [href], input,textarea, select, [tabindex]:not([tabindex = "-1"])'
      );

      if (key === "Tab" && focusableElements?.length) {
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement =
          focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            e.preventDefault();
            (lastFocusableElement as HTMLButtonElement).focus();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            e.preventDefault();
            (firstFocusableElement as HTMLButtonElement).focus();
          }
        }
      } else if (key === "Escape") {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", keydownHandler);
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, a, [href], input,textarea, select, [tabindex]:not([tabindex = "-1"])'
      );

      bgFocusElement.current = document.activeElement as HTMLButtonElement;

      if (focusableElements?.length) {
        (focusableElements[0] as HTMLButtonElement)?.focus();
      }
    }

    return () => {
      if (open) {
        document.removeEventListener("keydown", keydownHandler);
      }
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      const rootElement = document.getElementById("root");

      if (rootElement) {
        rootElement.inert = true;
      }

      document.body.style.overflow = "hidden";
    } else {
      const rootElement = document.getElementById("root");

      if (rootElement) {
        rootElement.inert = false;
      }

      document.body.style.overflow = "";

      if (bgFocusElement.current) {
        bgFocusElement.current.focus();
        bgFocusElement.current = null;
      }
    }

    return () => {
      const rootElement = document.getElementById("root");
      if (rootElement) {
        rootElement.inert = false;
      }
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return createPortal(
    <section
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      className={styles.modalContainer}
      ref={modalRef}
      aria-label="Modal-Container"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={styles.childrenContainer}
        aria-label="Modal-Child-Container"
      >
        {children}
      </div>
    </section>,
    document.body
  );
}

function ModalParent() {
  const [open, setOpen] = useState(false);

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  return (
    <article>
      <button className={styles.btn} onClick={openModal}>
        ModalParent
      </button>
      <div
        style={{
          width: 400,
          height: 1300,
          backgroundColor: "red",
        }}
      ></div>

      <Modal open={open} onClose={closeModal}>
        <div>
          <h1>Modal</h1>

          <button className={styles.btn}>Modal Button</button>

          <input type="text" />
        </div>
      </Modal>
    </article>
  );
}

export default ModalParent;
