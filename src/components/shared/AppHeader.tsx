import { Link, NavLink } from "react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { useActiveCount } from "@/features/applications/useActiveCount";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const { data: activeCount } = useActiveCount();
  return (
    <header className="flex h-13 items-center justify-between bg-white px-6 mb-6">
      <div className="flex items-center gap-5">
        <Link to="/applications" className="flex items-center gap-2">
          <span className="size-5.5 shrink-0 rounded-md bg-foreground" />
          <span className="text-sm font-semibold tracking-tight">Trackline</span>
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink
            to="/applications"
            className={({ isActive }) =>
              cn(
                "rounded-md px-2.5 py-1 text-sm",
                isActive
                  ? "bg-zinc-200/80 font-medium text-foreground"
                  : "text-muted-foreground",
              )
            }
          >
            Applications
          </NavLink>
          <span className="cursor-default px-2.5 py-1 text-sm text-muted-foreground">
            Insights
          </span>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {typeof activeCount === "number" && (
          <span className="text-sm text-muted-foreground">
            {activeCount} active
          </span>
        )}

        <Link
          to="/applications/new"
          className={cn(
            buttonVariants(),
            "h-8 rounded-md px-3.5 text-sm",
          )}
        >
          New Application
        </Link>

        <Avatar size="sm" className="size-7 bg-zinc-200">
          <AvatarFallback className="bg-zinc-200 text-[11px] font-medium text-zinc-600">
            MR
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
