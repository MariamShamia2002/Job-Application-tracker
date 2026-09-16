import { ApplicationForm } from "@/features/applications/form/components/ApplicationForm";
import { ApplicationFormProvider } from "@/features/applications/form/ApplicationFormProvider";

export default function NewApplicationPage() {
  return (
    <ApplicationFormProvider>
      <ApplicationForm />
    </ApplicationFormProvider>
  );
}
