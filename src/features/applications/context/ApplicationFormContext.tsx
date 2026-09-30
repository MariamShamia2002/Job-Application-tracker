import { createContext } from "react";
import type { ApplicationFormContextValue } from "@/features/applications/types/applicationForm";

export const ApplicationFormContext =
  createContext<ApplicationFormContextValue | null>(null);
