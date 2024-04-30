"use client";

import Image from "next/image";
import { Layout, Activity, Settings, CreditCard } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export type Organization = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
};

interface NavItemProps {
  organization: Organization;
  isActive: boolean;
  onExpand: (id: string) => void;
  isExpanded: boolean;
}

const NavItem = ({
  organization,
  isActive,
  onExpand,
  isExpanded,
}: NavItemProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const routes = [
    {
      label: "Boards",
      icon: <Layout className="w-4 h-4 mr-2" />,
      href: `/organization/${organization.id}`,
    },
    {
      label: "Activity",
      icon: <Activity className="w-4 h-4 mr-2" />,
      href: `/organization/${organization.id}/activity`,
    },
    {
      label: "Settings",
      icon: <Settings className="w-4 h-4 mr-2" />,
      href: `/organization/${organization.id}/settings`,
    },
    {
      label: "Billing",
      icon: <CreditCard className="w-4 h-4 mr-2" />,
      href: `/organization/${organization.id}/billing`,
    },
  ];

  const onClick = useCallback(
    (href: string) => {
      router.push(href);
    },
    [router]
  );

  return (
    <AccordionItem value={organization.id} className="border-none">
      <AccordionTrigger
        onClick={() => onExpand(organization.id)}
        className={cn(
          "flex items-center gap-x-2 p-1.5 text-neutral-700 rounded-md hover:bg-neutral-500/10 transition text-start no-underline hover:no-underline",
          isActive && !isExpanded && "bg-sky-500/10 text-sky-700"
        )}
      >
        <div className="flex items-center gap-x-2">
          <div className="w-7 h-7 relative">
            <Image
              fill
              src={organization.imageUrl}
              alt="Organization"
              className="object-cover rounded-sm"
            />
          </div>
          <span className="font-medium text-sm">{organization.name}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-1 text-neutral-700">
        {routes.map(({ label, icon, href }) => (
          <Button
            className={cn(
              "w-full font-normal  justify-start pl-10 mb-1",
              pathname === href && "bg-sky-500/10 text-sky-700"
            )}
            onClick={() => onClick(href)}
            size="sm"
            key={href}
            variant="ghost"
          >
            {icon}
            {label}
          </Button>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
};

export default NavItem;

NavItem.Skeleton = function SkeletonNavItem() {
  return (
    <div className="flex items-center gap-x-2">
      <div className="h-10 w-10 relative shrink-0">
        <Skeleton className="w-full h-full absolute" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
};
