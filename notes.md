# Notes

## Interaction and State Attributes

### aria-expanded & aria-controls

    These two are best friends. aria-expanded tells the user if a section (like a menu or accordion) is open, and aria-controls points to the specific ID of the element being opened.

    When to use: Use on toggle buttons for dropdowns, accordions, or mobile hamburger menus.

### aria-haspopup

    Identifies that an element triggers a popup, such as a menu, dialog, or listbox.

    When to use: On a button that opens a submenu or a modal window.

### aria-selected

    Indicates the current "selected" state of elements within a group.

    When to use: Tab lists, grid cells, or tree item widgets. Note: Use aria-checked for checkboxes and aria-selected for things like selectable tabs.

## Labelling and Focus Management

### aria-label

    Provides a string of text to label an element that has no visible text on the screen.

    When to use: An "X" button for closing a window needs aria-label="Close", or a search button that only contains a magnifying glass icon.

### aria-activedescendant

    Instead of physically moving the browser's "focus" to a new element (which can be clunky), this tells the screen reader which child element is currently active.

    ```
    aria-activedescendant={
          show && activeIndex >= 0 ? `option-${activeIndex}` : undefined
        }
    ```

### aria-autocomplete

    Indicates whether inputting text will trigger display of predicted matches.
    When to use: Search bars or form fields that offer "inline" suggestions or a "list" of results.

## Dynamic Content and Modals

### aria-modal

    Tells the screen reader that the current window is a "modal," meaning the user shouldn't be able to interact with anything behind it.
    When to use: On the container of a pop-up dialog. It helps "trap" the screen reader's focus inside the box.

### aria-live & aria-busy
