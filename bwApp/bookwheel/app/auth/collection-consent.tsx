import PolicyDocumentScreen from "@/components/PolicyDocumentScreen";
import { policyDocuments } from "@/policies/documents";

export default function CollectionConsent() {
  return <PolicyDocumentScreen document={policyDocuments.collectionConsent} title="개인정보 수집·이용 동의" />;
}
