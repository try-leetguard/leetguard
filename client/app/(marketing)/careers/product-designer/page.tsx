import JobPostingPage from "@/components/JobPostingPage";
import { jobs } from "@/lib/jobs";

export default function ProductDesignerPage() {
  return <JobPostingPage job={jobs.productDesigner} />;
}
