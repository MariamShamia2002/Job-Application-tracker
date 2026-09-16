import { useContext } from "react";
import { ApplicationFormContext } from "../ApplicationFormContext";

export function useApplicationForm() {
  const context = useContext(ApplicationFormContext);

  if (!context) {
    throw new Error("useApplicationForm must be used inside <ApplicationFormProvider>");
  }

  return context;
}
