import { create } from "zustand";

type ProModalProps = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useProModal = create<ProModalProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
