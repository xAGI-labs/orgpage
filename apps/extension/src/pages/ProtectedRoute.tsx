import { Navigate } from "react-router-dom";
import { canManage } from "../data/orgStore";
import { useAuth } from "../context/AuthContext";
import { useOrg } from "../context/OrgContext";
import { ErrorView, LoadingView } from "../components/StateViews";

export function ProtectedRoute({
  element,
  allowWithoutOrg,
  requireAdmin
}: {
  element: JSX.Element;
  allowWithoutOrg?: boolean;
  requireAdmin?: boolean;
}) {
  const { user, loading: authLoading } = useAuth();
  const { bundle, loading: orgLoading, error, refresh } = useOrg();

  if (authLoading || (user && orgLoading)) return <LoadingView />;
  if (!user) return <Navigate to="/login" replace />;
  if (error) return <ErrorView message={error} onRetry={refresh} />;
  if (!allowWithoutOrg && !bundle) return <Navigate to="/onboarding" replace />;
  if (requireAdmin && !canManage(bundle?.member.role)) return <Navigate to="/newtab" replace />;

  return element;
}
