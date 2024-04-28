import Logo from "@/components/logo";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

function Navbar() {
  return (
    <div className="fixed z-50 top-0 w-full h-14 border-b shadow-sm bg-white flex items-center px-4">
      <div className="flex items-center gap-x-4">
        <div className="hidden md:flex">
          <Logo />
        </div>
        <Button
          size="sm"
          className="rounded-sm hidden md:block h-auto py-1.5 px-2"
        >
          Create
        </Button>
        <Button className="rounded-sm block md:hidden" size="sm">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="ml-auto flex items-center gap-x-2">
        <OrganizationSwitcher
          hidePersonal
          afterCreateOrganizationUrl="/organization/:id"
          afterSelectOrganizationUrl="/organization/:id"
          afterLeaveOrganizationUrl="/select-org"
          appearance={{
            elements: {
              rootBox: {
                display: "flex",
                justifyItems: "center",
                alignItems: "center",
              },
            },
          }}
        />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: {
                height: 30,
                width: 30,
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default Navbar;
