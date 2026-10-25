"use client";

import { useId, useState } from "react";
import Modal from "./Modal";
import { CloseIcon } from "./Icons";
import styles from "./ContactModal.module.css";

// Bouton « Contactez-moi » + modale du formulaire de contact
export default function ContactModal({ photographerName }) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();

  // Le formulaire est validé par le navigateur (champs required) avant d'arriver ici
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Pour le prototype, le message n'est pas envoyé : on affiche simplement les champs dans la console
    console.log({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      message: formData.get("message"),
    });

    setIsOpen(false);
  }

  return (
    <>
      <button type="button" className="button" onClick={() => setIsOpen(true)}>
        Contactez-moi
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        labelledBy={titleId}
        className={styles.dialog}
      >
        <div className={styles.panel}>
          <div className={styles.header}>
            <h2 id={titleId} className={styles.title}>
              Contactez-moi
              <br />
              {photographerName}
            </h2>
            <button
              type="button"
              className={styles.close}
              onClick={() => setIsOpen(false)}
              aria-label="Fermer le formulaire de contact"
            >
              <CloseIcon size={36} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <label htmlFor="contact-firstName">Prénom</label>
            <input id="contact-firstName" name="firstName" type="text" autoComplete="given-name" required />

            <label htmlFor="contact-lastName">Nom</label>
            <input id="contact-lastName" name="lastName" type="text" autoComplete="family-name" required />

            <label htmlFor="contact-email">Email</label>
            <input id="contact-email" name="email" type="email" autoComplete="email" required />

            <label htmlFor="contact-message">Votre message</label>
            <textarea id="contact-message" name="message" rows={5} required />

            <button type="submit" className={`button ${styles.submit}`}>
              Envoyer
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
}
