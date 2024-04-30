"use client";

import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

import { useMobileSidebarStore } from "@/hooks/use-mobile-sidebar";
import Sidebar from "@/app/(platform)/(dashboard)/_components/sidebar";

const MobileSidebar = () => {
  const pathname = usePathname();
  const [isMouted, setIsMouted] = useState(false);

  const isOpen = useMobileSidebarStore((s) => s.isOpen);
  const onOpen = useMobileSidebarStore((s) => s.onOpen);
  const onClose = useMobileSidebarStore((s) => s.onClose);

  useEffect(() => {
    setIsMouted(true);
  }, []);

  useEffect(() => {
    onClose();
  }, [onClose, pathname]);

  if (!isMouted) return null;

  return (
    <>
      <Button size="sm" onClick={onOpen} className="block md:hidden">
        <Menu className="w-4 h-4" />
      </Button>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="p-2 pt-10" side="left">
          <Sidebar storageKey="t-sidebar-state-mobile" />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileSidebar;
