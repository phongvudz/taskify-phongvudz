"use client";

import { useEffect, useState } from "react";

import { CardModal } from "@/components/modals";

export const ModalProvider = () => {
  const [mouted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mouted) {
    return null;
  }

  return (
    <>
      <CardModal />
    </>
  );
};
