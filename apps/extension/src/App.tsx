import { BrowserRouter, HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminHomePage } from "./pages/admin/AdminHomePage";
import { AdminAnnouncementsPage } from "./pages/admin/AdminAnnouncementsPage";
import { AdminInvitesPage } from "./pages/admin/AdminInvitesPage";
import { AdminMembersPage } from "./pages/admin/AdminMembersPage";
import { AdminThemePage } from "./pages/admin/AdminThemePage";
import { InvitePage } from "./pages/InvitePage";
import { LoginPage } from "./pages/LoginPage";
import { NewTabPage } from "./pages/NewTabPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { ProtectedRoute } from "./pages/ProtectedRoute";

const Router = window.location.protocol === "chrome-extension:" ? HashRouter : BrowserRouter;

export function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Navigate to="/newtab" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<ProtectedRoute allowWithoutOrg element={<OnboardingPage />} />} />
        <Route path="/invite/:inviteId" element={<ProtectedRoute allowWithoutOrg element={<InvitePage />} />} />
        <Route path="/newtab" element={<ProtectedRoute element={<NewTabPage />} />} />
        <Route path="/admin" element={<ProtectedRoute requireAdmin element={<AdminLayout />} />}>
          <Route index element={<AdminHomePage />} />
          <Route path="announcements" element={<AdminAnnouncementsPage />} />
          <Route path="members" element={<AdminMembersPage />} />
          <Route path="invites" element={<AdminInvitesPage />} />
          <Route path="theme" element={<AdminThemePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/newtab" replace />} />
      </Routes>
    </Router>
  );
}
