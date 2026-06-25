"use client";

import ChangePasswordModal from "../ChangePasswordModal/ChangePasswordModal";

/**
 * Composant client à placer une seule fois dans le layout global.
 * Il affiche la modale de changement de mot de passe dès que
 * user.mustChangePassword === true, peu importe la page courante.
 */
export default function ChangePasswordGuard() {
  return <ChangePasswordModal />;
}
