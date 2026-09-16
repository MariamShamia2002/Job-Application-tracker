import { useContext } from "react";
import { ApplicationListContext } from "./ApplicationContext";

export type { SortDir, SortField } from "./ApplicationContext";

export function useApplicationFilters() {
  const context = useContext(ApplicationListContext);

  if (!context) {
    throw new Error("useApplicationFilters must be used inside <ApplicationProvider>");
  }

  return context;
}
