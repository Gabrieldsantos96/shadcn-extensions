import { AlertCircle, AlertTriangle, InfoIcon } from "lucide-react";

import type { IMessageProps } from "./UseDialog";
import { dialogEventManager, useDialog } from "./UseDialog";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function DialogListener() {
  const { handleRemoveDialog, messages } = useDialog({
    dialogEventManager,
  });

  return (
    <DialogList messages={messages} handleRemoveDialog={handleRemoveDialog} />
  );
}

type IDialogListProps = {
  messages: IMessageProps[];
  handleRemoveDialog: (id: string) => void;
};

function DialogList({ messages, handleRemoveDialog }: IDialogListProps) {
  return (
    <div>
      {messages.map((message) => (
        <DialogMessage
          key={message.id}
          message={message}
          showConfirmButton={message.showConfirmButton!}
          action={message.action!}
          onClose={() => handleRemoveDialog(message.id)}
          isOpen={messages.map((s) => s.id).includes(message.id) || false}
        />
      ))}
    </div>
  );
}

export type DialogMessageProps = {
  message: IMessageProps;
  onClose: () => void;
  action: (ev: boolean) => void;
  isOpen: boolean;
  showConfirmButton: boolean;
};

export const DialogMessage = ({
  message,
  isOpen,
  action,
  showConfirmButton,
  onClose,
}: DialogMessageProps) => {
  function handleConfirm() {
    action(true);
    onClose();
  }

  function handleClose() {
    action(false);
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 ">
            {message.type === "error" && (
              <AlertCircle className="size-8 text-red-500" />
            )}
            {message.type === "warning" && (
              <AlertTriangle className="size-8 text-yellow-500" />
            )}
            {message.type === "info" && (
              <InfoIcon className="size-8 text-blue-500" />
            )}
            {message.type === "success" && (
              <AlertCircle className="size-8 text-red-500" />
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>{message.message}</p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Fechar
          </Button>
          {!!showConfirmButton && (
            <Button onClick={handleConfirm}>Confirmar</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
