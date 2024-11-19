import { navigationRoutes } from "@/lib/data";
import { usePathname } from "next/navigation";

export default function useActiveRoute() {
  const pathname = usePathname();

  const activeRoute =
    navigationRoutes.find(
      (route) => route.href.length > 0 && pathname.includes(route.href),
    ) || navigationRoutes[0];

  return activeRoute;
}
