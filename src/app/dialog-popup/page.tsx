"use client";

import { Button } from "@/components/ui/button";
import { showDialog } from "@/components/extensions/DialogPopup/UseDialog";

export default function PopupPage() {
  async function handlePopup() {
    const res = await showDialog({
      type: "info",
      message: "Deseja excluir o usuário X?",
      showConfirmButton: true,
    });

    if (res) {
      window.alert("Usuário excluído");
    } else {
      window.alert("Ação cancelada");
    }
  }

  return (
    <div>
      <Button onClick={handlePopup}>Clicar aqui pra abrir popup</Button>
    </div>
  );
}

export const dynamic = "force-dynamic";
