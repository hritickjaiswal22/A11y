import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import styles from "./style.module.css";

export interface OptionType {
  label: string;
  value: string;
  id: number;
}

interface TypeheadProps {
  label: string;
  options: Array<OptionType>;
  onSelect?: (obj: OptionType) => void;
  fetchSuggestions?: (
    query: string,
    signal: AbortSignal
  ) => Promise<OptionType[]>;
}

function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(() => value);

  useEffect(() => {
    const timerid = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timerid);
    };
  }, [value, delay]);

  return debouncedValue;
}

function Typehead({
  label,
  options,
  onSelect,
  fetchSuggestions,
}: TypeheadProps) {
  const [show, setShow] = useState(false);
  const [input, setInput] = useState("");
  const [searchedItems, setSearchedItems] = useState<Array<OptionType>>([]);
  const [activeId, setActiveId] = useState<null | number>(null);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debouncedValue = useDebounce(input);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const latestRequestRef = useRef(0);

  function onChangeHandler(e: ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
    setSelectedLabel("");
  }

  function onFocusHandler(e: FocusEvent<HTMLInputElement, Element>) {
    setShow(true);
  }

  function onBlurHandler(e: FocusEvent<HTMLInputElement, Element>) {
    setShow(false);
  }

  function onMouseDownHandler(
    e: MouseEvent<HTMLLIElement, globalThis.MouseEvent>,
    obj: OptionType
  ) {
    e.preventDefault();
    setInput("");
    setSelectedLabel(obj.label);
    if (typeof onSelect === "function") onSelect(obj);
    setActiveId(obj.id);
    setShow(false);
  }

  function keyDownHandler(e: KeyboardEvent) {
    const { key } = e;

    if (key === "Escape") {
      setShow(false);
    } else if (searchedItems.length > 0) {
      if (key === "ArrowUp" && activeId === null) {
        e.preventDefault();
        setActiveId(searchedItems[searchedItems.length - 1].id);
      } else if (key === "ArrowUp") {
        e.preventDefault();
        let index = searchedItems.findIndex((obj) => obj.id === activeId);

        index = index - 1 < 0 ? searchedItems.length - 1 : index - 1;

        setActiveId(searchedItems[index].id);
      } else if (key === "ArrowDown" && activeId === null) {
        e.preventDefault();
        setActiveId(searchedItems[0].id);
      } else if (key === "ArrowDown") {
        e.preventDefault();
        let index = searchedItems.findIndex((obj) => obj.id === activeId);

        index = index + 1 >= searchedItems.length ? 0 : index + 1;

        setActiveId(searchedItems[index].id);
      } else if (key === "Enter" && activeId !== null) {
        const obj = searchedItems.find((e) => e.id === activeId);

        if (obj) {
          setInput("");
          setSelectedLabel(obj.label);
          if (typeof onSelect === "function") onSelect(obj);
          setActiveId(obj.id);
          setShow(false);
        }
      }
    }
  }

  async function handleFetch(query: string, signal: AbortSignal) {
    if (typeof fetchSuggestions === "function") {
      const requestId = ++latestRequestRef.current;

      try {
        setLoading(true);
        setError("");

        const temp = await fetchSuggestions(query, signal);

        if (requestId === latestRequestRef.current) {
          setSearchedItems(temp);
        }
      } catch (error) {
        if (signal.aborted) return;

        console.error(error);
        setError("Error");
      } finally {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    let controller: AbortController;

    if (typeof fetchSuggestions === "function") {
      console.log("debouncedValue", debouncedValue);

      if (debouncedValue.length === 0) {
        setSearchedItems([]);
        return;
      }

      controller = new AbortController();

      handleFetch(debouncedValue, controller.signal);
    } else {
      if (debouncedValue.length === 0) {
        setSearchedItems(options);
      } else {
        const temp = options.filter((option) =>
          option.value.toLowerCase().includes(debouncedValue.toLowerCase())
        );

        setSearchedItems(temp);
        setShow(true);
      }
    }

    return () => {
      if (typeof fetchSuggestions === "function" && controller) {
        controller.abort();
      }
    };
  }, [debouncedValue, fetchSuggestions, options]);

  useEffect(() => {
    if (show) {
      try {
        for (const child of listRef.current?.children) {
          const id = child.getAttribute("data-id");

          if (Number(id) === activeId) {
            child.scrollIntoView({
              behavior: "auto", // "auto" provides the instant jump you want
              block: "nearest", // Prevents unnecessary shifting if already in view
              inline: "nearest", // Applies the same logic horizontally
            });
            return;
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [activeId, show]);

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <label className={styles.label} htmlFor={`${label}-dropdown`}>
        {label}
      </label>
      <input
        onChange={onChangeHandler}
        value={input || selectedLabel}
        className={styles.input}
        id={`${label}-dropdown`}
        onFocus={onFocusHandler}
        onBlur={onBlurHandler}
        aria-expanded={show}
        role="combobox"
        aria-activedescendant={
          show && activeId !== null && activeId >= 0
            ? `option-${activeId}`
            : undefined
        }
        onKeyDown={keyDownHandler}
        aria-controls={show ? "listbox" : undefined}
        aria-autocomplete="list"
      />

      {show ? (
        <ul
          id="listbox"
          role="listbox"
          ref={listRef}
          tabIndex={-1}
          className={styles.list}
        >
          {error.length > 0 ? (
            <li aria-busy="true" aria-live="polite" className={styles.listItem}>
              Error
            </li>
          ) : loading ? (
            <li aria-busy="true" aria-live="polite" className={styles.listItem}>
              Loading...
            </li>
          ) : searchedItems.length > 0 ? (
            <>
              {searchedItems.map((obj) => (
                <li
                  id={`option-${obj.id}`}
                  role="option"
                  aria-selected={activeId === obj.id}
                  onMouseDown={(e) => onMouseDownHandler(e, obj)}
                  className={`${styles.listItem} ${
                    activeId === obj.id ? styles.active : ""
                  }`}
                  key={obj.id}
                  data-id={obj.id}
                >
                  {obj.label}
                </li>
              ))}
            </>
          ) : (
            <li aria-live="polite" role="option" className={styles.listItem}>
              No filtered items found
            </li>
          )}
        </ul>
      ) : null}
    </div>
  );
}

export default Typehead;
