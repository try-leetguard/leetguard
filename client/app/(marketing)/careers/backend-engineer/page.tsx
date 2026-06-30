import JobPostingPage from "@/components/JobPostingPage";
import { jobs } from "@/lib/jobs";

export default function BackendEngineerPage() {
  return <JobPostingPage job={jobs.backendEngineer} />;
}
