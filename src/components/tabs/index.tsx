import type React from "react";
import {
  createContext,
  useState,
  type ReactNode,
  Children,
  cloneElement,
  useContext,
  useRef,
  forwardRef,
  isValidElement,
  useEffect,
} from "react";
import styles from "./style.module.css";

/**
 * TabsContext holds shared state for the compound components
 */
const TabsContext = createContext<{
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  onChange?: (index: number) => void;
  disableMap: Array<boolean>;
  setDisableMap: React.Dispatch<React.SetStateAction<boolean[]>>;
} | null>(null);

/**
 * Safe context hook
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (context === null) {
    throw new Error(
      "useTabsContext must be used within a TabsContext.Provider"
    );
  }
  return context;
};

interface TabsProps {
  children: ReactNode;
  onChange?: (index: number) => void;
}

interface TabListProps {
  children: ReactNode;
}

interface PanelListProps {
  children: ReactNode;
}

type TabProps = React.ComponentPropsWithRef<"button"> & {
  index: number;
  children: ReactNode;
};

interface TabPanelProps {
  index: number;
  children: ReactNode;
}

export function TabList({ children }: TabListProps) {
  const { activeIndex, setActiveIndex, onChange, disableMap } =
    useTabsContext();
  const tabsRef = useRef<Array<HTMLButtonElement>>([]);
  const childrenLength = Children.count(children);

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const { key } = e;

    /**
     * Find next enabled tab (wraps around)
     */
    const getNextIndex = () => {
      for (let i = activeIndex + 1; i < childrenLength; i++) {
        if (!disableMap[i]) return i;
      }

      for (let i = 0; i < activeIndex; i++) {
        if (!disableMap[i]) return i;
      }

      return activeIndex;
    };

    /**
     * Find previous enabled tab (wraps around)
     */
    const getPrevIndex = () => {
      for (let i = activeIndex - 1; i >= 0; i--) {
        if (!disableMap[i]) return i;
      }

      for (let i = childrenLength - 1; i >= activeIndex; i--) {
        if (!disableMap[i]) return i;
      }

      return activeIndex;
    };

    if (key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = getNextIndex();

      tabsRef.current[nextIndex]?.focus();
      setActiveIndex(nextIndex);

      if (typeof onChange === "function") {
        onChange(nextIndex);
      }
    } else if (key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = getPrevIndex();

      tabsRef.current[prevIndex]?.focus();
      setActiveIndex(prevIndex);
      if (typeof onChange === "function") {
        onChange(prevIndex);
      }
    }
  }

  return (
    <div
      onKeyDown={handleKeyDown}
      className={styles.btnContainer}
      role="tablist"
      aria-orientation="horizontal"
    >
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          index,
          ref: (el: HTMLButtonElement | null) => {
            tabsRef.current[index] = el;
          },
        })
      )}
    </div>
  );
}

export function PanelList({ children }: PanelListProps) {
  return (
    <div className={styles.panelConatiner}>
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) return null;

        return cloneElement(child, {
          index,
        });
      })}
    </div>
  );
}

export const Tab = forwardRef<HTMLButtonElement, TabProps>((props, ref) => {
  const { index, children, disabled, ...restProps } = props;
  const { activeIndex, setActiveIndex, onChange, setDisableMap } =
    useTabsContext();

  function clickHandler() {
    setActiveIndex(index);

    if (typeof onChange === "function") {
      onChange(index);
    }
  }

  /**
   * Register disabled state in parent
   */
  useEffect(() => {
    setDisableMap((prev) => {
      const temp = [...prev];
      temp[index] = !!disabled;

      return temp;
    });
  }, [disabled, index]);

  return (
    <button
      onClick={clickHandler}
      className={`${styles.tabBtn} ${
        activeIndex === index ? styles.activeBtn : ""
      }`}
      role="tab"
      aria-controls={`panel-${index}`}
      ref={ref}
      tabIndex={activeIndex === index ? 0 : -1}
      aria-selected={activeIndex === index ? "true" : "false"}
      id={`tab-${index}`}
      disabled={disabled}
      aria-disabled={disabled ? "true" : "false"}
      {...restProps}
    >
      {children}
    </button>
  );
});

export function TabPanel({ children, index }: TabPanelProps) {
  const { activeIndex } = useTabsContext();
  return (
    <div
      className={index !== activeIndex ? styles.hidden : ""}
      role="tabpanel"
      aria-labelledby={`tab-${index}`}
      hidden={index !== activeIndex}
    >
      {children}
    </div>
  );
}

/**
 * Root Tabs component
 */
function Tabs({ children, onChange }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [disableMap, setDisableMap] = useState<Array<boolean>>(() =>
    Array(Children.count(children)).fill(false)
  );

  return (
    <TabsContext.Provider
      value={{
        activeIndex,
        setActiveIndex,
        onChange,
        disableMap,
        setDisableMap,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
}

export default Tabs;
