import { ApplicationForm } from "@/features/applications/components/form/ApplicationForm";
import { ApplicationFormProvider } from "@/features/applications/context/ApplicationFormProvider";

export default function NewApplicationPage() {
  return (
    <ApplicationFormProvider>
      <ApplicationForm />
    </ApplicationFormProvider>
  );
}
