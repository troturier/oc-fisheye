"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronIcon } from "./Icons";
import styles from "./SortMenu.module.css";

/**
 * Menu de tri accessible (motif « listbox » ARIA) :
 * - le bouton déclencheur porte aria-haspopup="listbox" et aria-expanded ;
 * - la liste gère les flèches, Début/Fin, Entrée/Espace, Échap et Tab ;
 * - l'option active est désignée par aria-activedescendant.
 * options : [{ value, label }], value : valeur sélectionnée
 */
export default function SortMenu({ options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const buttonRef = useRef(null);
  const listRef = useRef(null);
  const baseId = useId();
  const labelId = `${baseId}-label`;
  const buttonId = `${baseId}-button`;
  const optionId = (index) => `${baseId}-option-${index}`;

  const selected = options.find((option) => option.value === value);
  // L'option sélectionnée est affichée en premier, comme sur la maquette
  const orderedOptions = [selected, ...options.filter((option) => option.value !== value)];

  // Déplace le focus sur la liste à l'ouverture pour que le clavier la pilote
  useEffect(() => {
    if (isOpen) listRef.current?.focus();
  }, [isOpen]);

  function open() {
    setActiveIndex(0);
    setIsOpen(true);
  }

  function close({ restoreFocus }) {
    setIsOpen(false);
    if (restoreFocus) buttonRef.current?.focus();
  }

  function select(option) {
    onChange(option.value);
    close({ restoreFocus: true });
  }

  function handleButtonKeyDown(event) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      open();
    }
  }

  function handleListKeyDown(event) {
    const lastIndex = orderedOptions.length - 1;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, lastIndex));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(lastIndex);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        select(orderedOptions[activeIndex]);
        break;
      case "Escape":
        event.preventDefault();
        close({ restoreFocus: true });
        break;
      case "Tab":
        close({ restoreFocus: false });
        break;
    }
  }

  return (
    <div className={styles.container}>
      <span id={labelId} className={styles.label}>
        Trier par
      </span>

      <div className={styles.menu}>
        <button
          ref={buttonRef}
          id={buttonId}
          type="button"
          className={styles.trigger}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={`${labelId} ${buttonId}`}
          onClick={open}
          onKeyDown={handleButtonKeyDown}
        >
          {selected.label}
          <ChevronIcon direction="down" size={20} />
        </button>

        {isOpen && (
          <ul
            ref={listRef}
            className={styles.list}
            role="listbox"
            tabIndex={-1}
            aria-labelledby={labelId}
            aria-activedescendant={optionId(activeIndex)}
            onKeyDown={handleListKeyDown}
            onBlur={() => close({ restoreFocus: false })}
          >
            {orderedOptions.map((option, index) => (
              <li
                key={option.value}
                id={optionId(index)}
                role="option"
                aria-selected={option.value === value}
                className={`${styles.option} ${index === activeIndex ? styles.active : ""}`}
                onClick={() => select(option)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {option.label}
                {index === 0 && <ChevronIcon direction="up" size={20} />}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
