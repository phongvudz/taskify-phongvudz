import { Toaster } from "sonner";
import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";

const PlatformLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ClerkProvider>
      <Toaster />
      {children}
    </ClerkProvider>
  );
};

export default PlatformLayout;
