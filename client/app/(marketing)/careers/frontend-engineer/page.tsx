import JobPostingPage from "@/components/JobPostingPage";
import { jobs } from "@/lib/jobs";

export default function FrontendEngineerPage() {
  return <JobPostingPage job={jobs.frontendEngineer} />;
}
