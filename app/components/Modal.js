"use client";

import { useEffect, useRef } from "react";

/**
 * Modale générique basée sur l'élément natif <dialog> :
 * - showModal() piège le focus dans la boîte et rend le reste de la page inerte ;
 * - la touche Échap la ferme et le focus revient sur l'élément déclencheur ;
 * - un clic sur l'arrière-plan grisé la ferme aussi.
 * Le contenu n'est monté que lorsque la modale est ouverte (le formulaire est donc réinitialisé).
 */
export default function Modal({
  isOpen,
  onClose,
  label,
  labelledBy,
  className = "",
  onKeyDown,
  children,
}) {
  const dialogRef = useRef(null);

  // Synchronise l'état React avec l'état réel du <dialog>
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // Un clic sur le <dialog> lui-même (et non sur son contenu) correspond à l'arrière-plan
  function handleClick(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className={className}
      aria-label={label}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onClick={handleClick}
      onKeyDown={onKeyDown}
    >
      {isOpen && children}
    </dialog>
  );
}
