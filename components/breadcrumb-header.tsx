"use client";

import React from "react";
import MobileSidebar from "./mobile-sidebar";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function BreadcrumbHeader() {
  const pathname = usePathname();
  const paths = pathname === "/" ? [""] : pathname.split("/");

  return (
    // TODO: flex-start is not a valid tailwind class; what is this supposed to be?
    <div className="flex-start flex items-center">
      <MobileSidebar />
      <Breadcrumb>
        <BreadcrumbList>
          {paths.map((path, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                <BreadcrumbLink className="capitalize" href={path}>
                  {path === "" ? "home" : path}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
