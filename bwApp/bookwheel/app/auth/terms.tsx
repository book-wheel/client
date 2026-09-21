import PolicyDocumentScreen from "@/components/PolicyDocumentScreen";
import { policyDocuments } from "@/policies/documents";

export default function Screen() {
  return <PolicyDocumentScreen document={policyDocuments.terms} title="이용약관" />;
}
