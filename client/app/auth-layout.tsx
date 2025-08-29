import { ReverseProtectedRoute } from "@/components/ReverseProtectedRoute";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ReverseProtectedRoute>{children}</ReverseProtectedRoute>;
}
