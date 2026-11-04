import { DeleteOutlined } from "@ant-design/icons";
import { Button, message, Modal } from "antd";
import { isAxiosError } from "axios";
import { useState } from "react";
import type { BikeModel } from "../models/BikeModel";

interface DeleteBikeButtonProps {
  bike: BikeModel;
  deleteBike: (id: string) => Promise<void>;
}

export const DeleteBikeButton = ({
  bike,
  deleteBike,
}: DeleteBikeButtonProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const onCancel = () => {
    setIsOpen(false);
  };

  // confirmation de la suppression avec gestion de l'erreur 409
  const onConfirm = () => {
    setIsDeleting(true);
    deleteBike(bike.id)
      .then(() => {
        message.success("Bike deleted successfully");
        setIsOpen(false);
      })
      .catch((error) => {
        if (isAxiosError(error) && error.response?.status === 409) {
          message.error(
            "This bike cannot be deleted because it is associated with sales.",
          );
        } else {
          message.error("An error occurred while deleting the bike.");
        }
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  return (
    <>
      <Button danger onClick={() => setIsOpen(true)}>
        <DeleteOutlined />
      </Button>
      <Modal
        okButtonProps={{ danger: true }}
        open={isOpen}
        title={`Deleting ${bike.brand} ${bike.model}`}
        onCancel={onCancel}
        onOk={onConfirm}
        confirmLoading={isDeleting}
        okText="Yes, delete"
      >
        You are about to delete the bike {bike.brand} {bike.model}. This
        action cannot be undone
      </Modal>
    </>
  );
};
