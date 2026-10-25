import { DM_Sans } from "next/font/google";
import "./globals.css";

// Police du design (DM Sans), exposée en variable CSS et servie depuis le site
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata = {
  title: {
    default: "FishEye – Photographes freelance",
    template: "%s | FishEye",
  },
  description:
    "FishEye présente le travail de photographes freelance et permet de les contacter.",
};

// Gabarit commun : langue du document, lien d'évitement (accessibilité clavier) puis page courante
export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={dmSans.variable}>
      <body>
        <a className="skip-link" href="#main">
          Aller au contenu principal
        </a>
        {children}
      </body>
    </html>
  );
}
