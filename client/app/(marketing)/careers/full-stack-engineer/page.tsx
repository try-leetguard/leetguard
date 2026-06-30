import JobPostingPage from "@/components/JobPostingPage";
import { jobs } from "@/lib/jobs";

export default function FullStackEngineerPage() {
  return <JobPostingPage job={jobs.fullStackEngineer} />;
}
