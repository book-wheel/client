import PolicyDocumentScreen from "@/components/PolicyDocumentScreen";
import { policyDocuments } from "@/policies/documents";

export default function Screen() {
  return <PolicyDocumentScreen document={policyDocuments.privacy} title="개인정보 처리방침" />;
}
