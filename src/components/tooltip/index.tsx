import {
  useEffect,
  useRef,
  useState,
  cloneElement,
  isValidElement,
  type ReactElement,
  useId,
} from "react";

import styles from "./style.module.css";

interface TooltipProps {
  children: ReactElement;
  title: string;
}

const DELAY_INTERVAL = 200;

function Tooltip({ children, title }: TooltipProps) {
  const [showTitle, setShowTitle] = useState(false);
  const openTimer = useRef(-1);
  const closeTimer = useRef(-1);
  const tooltipId = useId();

  function show() {
    clearTimeout(openTimer.current);

    openTimer.current = setTimeout(() => setShowTitle(true), DELAY_INTERVAL);
  }

  function hide() {
    clearTimeout(closeTimer.current);
    clearTimeout(openTimer.current);

    closeTimer.current = setTimeout(() => setShowTitle(false), DELAY_INTERVAL);
  }

  useEffect(() => {
    function keydownHandler(e: KeyboardEvent) {
      const { key } = e;

      if (key === "Escape") {
        setShowTitle(false);
      }
    }

    if (showTitle) {
      document.addEventListener("keydown", keydownHandler);
    }

    return () => {
      if (showTitle) {
        document.removeEventListener("keydown", keydownHandler);
      }
    };
  }, [showTitle]);

  if (!isValidElement(children)) {
    throw new Error("Tooltip expects a single React element child");
  }

  const trigger = cloneElement(children, {
    onMouseEnter: (e) => {
      children.props.onMouseEnter?.(e);
      show();
    },
    onMouseLeave: (e) => {
      children.props.onMouseLeave?.(e);
      hide();
    },
    onFocus: (e) => {
      children.props.onFocus?.(e);
      show();
    },
    onBlur: (e) => {
      children.props.onBlur?.(e);
      hide();
    },
    "aria-describedby": showTitle ? tooltipId : undefined,
  });

  return (
    <div className={styles.container}>
      {trigger}

      {showTitle ? (
        <div className={styles.titleContainer}>
          <div role="tooltip" id={tooltipId} className={styles.titleWrapper}>
            {title}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Tooltip;
