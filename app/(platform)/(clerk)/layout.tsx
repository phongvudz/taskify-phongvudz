import { ReactNode } from "react";

const ClerkLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-full flex justify-center items-center">{children}</div>
  );
};

export default ClerkLayout;
