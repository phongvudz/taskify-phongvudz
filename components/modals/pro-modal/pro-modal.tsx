"use client";

import { stripeRedirect } from "@/actions/stripe-redirect";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAction } from "@/hooks/use-action";
import { useProModal } from "@/hooks/use-pro-modal";
import Image from "next/image";
import { toast } from "sonner";

export const ProModal = () => {
  const { isOpen, onClose } = useProModal();

  const { execute, isLoading } = useAction(stripeRedirect, {
    onSuccess(data) {
      window.location.href = data;
    },
    onError(error) {
      toast.error(error);
    },
  });

  const onUpgrade = () => {
    execute({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-md overflow-hidden">
        <div className="aspect-video relative flex items-center justify-center">
          <Image src="/hero.svg" alt="Hero" className="object-cover" fill />
        </div>
        <div className="text-neutral-700 mx-auto space-y-6 p-6">
          <h2 className="font-semibold text-xl">
            Upgrade to Taskify Pro Today!
          </h2>
          <p className="text-xs font-semibold text-neutral-600">
            Explore the power of Taskify Pro and unlock more features.
          </p>
          <div className="pl-3">
            <ul className="text-sm list-disc">
              <li>Unlimited boards</li>
              <li>Advanced checklists</li>
              <li>Admin and security feautures</li>
              <li>And more!</li>
            </ul>
          </div>
          <Button onClick={onUpgrade} disabled={isLoading} className="w-full">
            Upgrade
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
