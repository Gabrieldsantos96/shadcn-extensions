"use client";

import { useCallback, useEffect, useState } from "react";

import type { IEventManager } from "@/lib/listeners";
import EventManager from "@/lib/listeners";

export type IMessageProps = {
  type: "error" | "success" | "warning" | "info";
  message: string;
  id: string;
  action?: (res: boolean) => void;
  showConfirmButton?: boolean;
};

export type IDialogEventProps = Omit<IMessageProps, "id"> | null;

export function useDialog({
  dialogEventManager,
}: {
  dialogEventManager: IEventManager<IDialogEventProps>;
}) {
  const [messages, setMessages] = useState<IMessageProps[]>([]);

  function handleCallDialog(props: IDialogEventProps) {
    const { message, type, action, showConfirmButton = false } = props!;

    setMessages((s) => [
      ...s,
      {
        id: crypto.randomUUID(),
        message,
        type,
        action,
        showConfirmButton,
      },
    ]);
  }

  useEffect(() => {
    dialogEventManager.on("callDialogPopup", handleCallDialog);

    return () => {
      dialogEventManager.removeListener("callDialogPopup", handleCallDialog);
    };
  }, [dialogEventManager]);

  const handleRemoveDialog = useCallback((id: string) => {
    setMessages((prevState) => prevState.filter((d) => d.id !== id));
  }, []);

  return {
    messages,
    handleRemoveDialog,
  };
}

export function showDialog(props: IDialogEventProps): Promise<boolean> {
  return new Promise((resolve) => {
    const { message, type, showConfirmButton = false } = props!;
    dialogEventManager.emit("callDialogPopup", {
      message,
      type,
      id: crypto.randomUUID(),
      showConfirmButton,
      action: (response: boolean) => {
        if (response) {
          resolve(true);
        } else {
          resolve(false);
        }
      },
    });
  });
}

export const dialogEventManager = new EventManager<IMessageProps>();
