import { createContext } from "react";
import type { ApplicationListContextValue } from "@/features/applications/types/applicationList";

export const ApplicationListContext =
  createContext<ApplicationListContextValue | null>(null);
