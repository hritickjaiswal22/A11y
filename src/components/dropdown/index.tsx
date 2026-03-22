import { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";

interface OptionType {
  label: string;
  value: string;
}

interface DropdownProps {
  value: string;
  options: Array<OptionType>;
  onChangeHandler: (val: string) => void;
}

function Dropdown({ onChangeHandler, options, value }: DropdownProps) {
  const [show, setShow] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const wrapperRef = useRef<HTMLDivElement>(null);

  function handleSelectBtnClick() {
    if (!show) {
      setActiveIndex(options.findIndex((option) => option.value === value));
    }

    setShow((prev) => !prev);
  }

  function handleOptionClick(e: MouseEvent, val: string) {
    e.preventDefault();

    onChangeHandler(val);
    setShow(false);
  }

  function blurHandler() {
    setShow(false);
  }

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      const { key } = e;

      if (key === "ArrowUp") {
        setActiveIndex((prev) => {
          return prev - 1 >= 0 ? prev - 1 : 0;
        });
      } else if (key === "ArrowDown") {
        setActiveIndex((prev) => {
          return prev + 1 < options.length ? prev + 1 : options.length - 1;
        });
      } else if (key === "Enter" && activeIndex >= 0) {
        onChangeHandler(options[activeIndex].value);
      } else if (key === "Escape") {
        setShow(false);
      } else if (
        key.toLowerCase().charCodeAt(0) >= 97 &&
        key.toLowerCase().charCodeAt(0) <= 122
      ) {
        const index = options.findIndex(
          (option) => option.value[0].toLowerCase() === key.toLowerCase()
        );

        if (index >= 0) {
          setActiveIndex(index);
        }
      }
    };

    if (show) {
      wrapperRef.current?.addEventListener("keydown", keyDownHandler);
    }

    return () => {
      if (show)
        wrapperRef.current?.removeEventListener("keydown", keyDownHandler);
    };
  }, [show, options, activeIndex, onChangeHandler]);

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <button
        onClick={handleSelectBtnClick}
        className={styles.selectBtn}
        onBlur={blurHandler}
        aria-haspopup="listbox"
        aria-expanded={show}
        aria-controls="dropdown-listbox"
        aria-activedescendant={
          show && activeIndex >= 0 ? `option-${activeIndex}` : undefined
        }
      >
        {value ? value : "Select an option"}
      </button>

      <ul
        role="listbox"
        id="dropdown-listbox"
        className={`${styles.optionList} ${!show ? styles.hidden : ""}`}
      >
        {options.map(({ label, value }, i) => (
          <li
            id={`option-${i}`}
            onMouseDown={(e) => handleOptionClick(e, value)}
            className={`${styles.listItem} ${
              i === activeIndex ? styles.active : ""
            }`}
            key={value}
            aria-selected={i === activeIndex}
            role="option"
          >
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dropdown;
