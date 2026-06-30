import JobPostingPage from "@/components/JobPostingPage";
import { jobs } from "@/lib/jobs";

export default function AnythingElsePage() {
  return <JobPostingPage job={jobs.anythingElse} />;
}
