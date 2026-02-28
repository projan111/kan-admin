import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { ProtectedRoute } from "../guards/ProtectedRoute";
import { PermissionGuard } from "../guards/PermissionGuard";
import { LoginPage } from "../../pages/LoginPage";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "@/pages/auth/ResetPasswordPage";
import { ChangePasswordPage } from "@/pages/auth/ChangePasswordPage";
import { SignupPage } from "@/pages/auth/SignupPage";
import { RoleGuard } from "../guards/RoleGuard";
import { UsersPage } from "../../pages/dashboard/users/UsersPage";
import { ContactPage } from "../../pages/dashboard/contact/ContactPage";
import { BrandPage } from "../../pages/dashboard/brand/BrandPage";
import { CsrPage } from "../../pages/dashboard/csr/CsrPage";
import { NewsroomPage } from "../../pages/dashboard/newsroom/NewsroomPage";
import { FaqPage } from "../../pages/dashboard/faq/FaqPage";
import { TeamPage } from "../../pages/dashboard/team/TeamPage";
import { CompanyPage } from "../../pages/dashboard/company/CompanyPage";
import { FaqCreatePage } from "../../pages/dashboard/faq/FaqCreatePage";
import { FaqEditPage } from "../../pages/dashboard/faq/FaqEditPage";
import { CrudRouteStubPage } from "../../pages/dashboard/common/CrudRouteStubPage";
import { TeamCreatePage } from "../../pages/dashboard/team/TeamCreatePage";
import { TeamEditPage } from "../../pages/dashboard/team/TeamEditPage";
import { BrandCreatePage } from "../../pages/dashboard/brand/BrandCreatePage";
import { BrandEditPage } from "../../pages/dashboard/brand/BrandEditPage";
import { CompanyCreatePage } from "../../pages/dashboard/company/CompanyCreatePage";
import { CompanyEditPage } from "../../pages/dashboard/company/CompanyEditPage";
import { CsrCreatePage } from "../../pages/dashboard/csr/CsrCreatePage";
import { CsrEditPage } from "../../pages/dashboard/csr/CsrEditPage";
import { NewsroomCreatePage } from "../../pages/dashboard/newsroom/NewsroomCreatePage";
import { NewsroomEditPage } from "../../pages/dashboard/newsroom/NewsroomEditPage";
import { UsersCreatePage } from "../../pages/dashboard/users/UsersCreatePage";
import { UsersEditPage } from "../../pages/dashboard/users/UsersEditPage";
import { ContactCreatePage } from "../../pages/dashboard/contact/ContactCreatePage";
import { ProfilePage } from "../../pages/dashboard/profile/ProfilePage";
import { DashboardOverviewPage } from "../../pages/dashboard/overview/DashboardOverviewPage";
import {
  BrandViewPage,
  CompanyViewPage,
  ContactViewPage,
  CsrViewPage,
  FaqViewPage,
  NewsroomViewPage,
  TeamViewPage,
  UsersViewPage,
} from "../../pages/dashboard/views/EntityViewPages";
import { ecommerceModules } from "../config/ecommerceModules";
import { ModulePlaceholderPage } from "../../pages/dashboard/common/ModulePlaceholderPage";

const placeholderModules = ecommerceModules.filter(
  (module) => !["overview", "users", "customers"].includes(module.key)
);

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route element={<RoleGuard allow={["ADMIN", "SUDOADMIN"]} />}>
            <Route element={<PermissionGuard permission="users.manage" />}>
              <Route path="/dashboard/users" element={<UsersPage />} />
              <Route path="/dashboard/users/create" element={<UsersCreatePage />} />
              <Route path="/dashboard/users/:id/edit" element={<UsersEditPage />} />
              <Route path="/dashboard/users/:id" element={<UsersViewPage />} />
            </Route>
          </Route>

          <Route path="/dashboard" element={<DashboardOverviewPage />} />
          <Route path="/dashboard/profile" element={<ProfilePage />} />
          <Route path="/dashboard/change-password" element={<ChangePasswordPage />} />

          <Route element={<RoleGuard allow={["SUDOADMIN"]} />}>
            <Route path="/dashboard/auth/signup" element={<SignupPage />} />
          </Route>

          <Route path="/dashboard/customers" element={<ContactPage />} />
          <Route element={<PermissionGuard permission="entity.create" />}>
            <Route path="/dashboard/customers/create" element={<ContactCreatePage />} />
          </Route>
          <Route
            path="/dashboard/customers/:id/edit"
            element={<CrudRouteStubPage moduleLabel="Customer" mode="edit" listPath="/dashboard/customers" />}
          />
          <Route path="/dashboard/customers/:id" element={<ContactViewPage />} />

          <Route path="/dashboard/contact" element={<Navigate to="/dashboard/customers" replace />} />
          <Route path="/dashboard/contact/create" element={<Navigate to="/dashboard/customers/create" replace />} />
          <Route path="/dashboard/contact/:id/edit" element={<CrudRouteStubPage moduleLabel="Customer" mode="edit" listPath="/dashboard/customers" />} />
          <Route path="/dashboard/contact/:id" element={<ContactViewPage />} />

          <Route path="/dashboard/team" element={<TeamPage />} />
          <Route element={<PermissionGuard permission="entity.create" />}>
            <Route path="/dashboard/team/create" element={<TeamCreatePage />} />
          </Route>
          <Route element={<PermissionGuard permission="entity.update" />}>
            <Route path="/dashboard/team/:slug/edit" element={<TeamEditPage />} />
          </Route>
          <Route path="/dashboard/team/:slug" element={<TeamViewPage />} />

          <Route path="/dashboard/faq" element={<FaqPage />} />
          <Route element={<PermissionGuard permission="entity.create" />}>
            <Route path="/dashboard/faq/create" element={<FaqCreatePage />} />
          </Route>
          <Route element={<PermissionGuard permission="entity.update" />}>
            <Route path="/dashboard/faq/:slug/edit" element={<FaqEditPage />} />
          </Route>
          <Route path="/dashboard/faq/:slug" element={<FaqViewPage />} />

          <Route path="/dashboard/company" element={<CompanyPage />} />
          <Route element={<PermissionGuard permission="entity.create" />}>
            <Route path="/dashboard/company/create" element={<CompanyCreatePage />} />
          </Route>
          <Route element={<PermissionGuard permission="entity.update" />}>
            <Route path="/dashboard/company/:slug/edit" element={<CompanyEditPage />} />
          </Route>
          <Route path="/dashboard/company/:slug" element={<CompanyViewPage />} />

          <Route path="/dashboard/brand" element={<BrandPage />} />
          <Route element={<PermissionGuard permission="entity.create" />}>
            <Route path="/dashboard/brand/create" element={<BrandCreatePage />} />
          </Route>
          <Route element={<PermissionGuard permission="entity.update" />}>
            <Route path="/dashboard/brand/:slug/edit" element={<BrandEditPage />} />
          </Route>
          <Route path="/dashboard/brand/:slug" element={<BrandViewPage />} />

          <Route path="/dashboard/csr" element={<CsrPage />} />
          <Route element={<PermissionGuard permission="entity.create" />}>
            <Route path="/dashboard/csr/create" element={<CsrCreatePage />} />
          </Route>
          <Route element={<PermissionGuard permission="entity.update" />}>
            <Route path="/dashboard/csr/:slug/edit" element={<CsrEditPage />} />
          </Route>
          <Route path="/dashboard/csr/:slug" element={<CsrViewPage />} />

          <Route path="/dashboard/newsroom" element={<NewsroomPage />} />
          <Route element={<PermissionGuard permission="entity.create" />}>
            <Route path="/dashboard/newsroom/create" element={<NewsroomCreatePage />} />
          </Route>
          <Route element={<PermissionGuard permission="entity.update" />}>
            <Route path="/dashboard/newsroom/:slug/edit" element={<NewsroomEditPage />} />
          </Route>
          <Route path="/dashboard/newsroom/:slug" element={<NewsroomViewPage />} />

          {placeholderModules.map((module) => (
            <Route
              key={module.key}
              path={module.path}
              element={<ModulePlaceholderPage title={module.label} description={module.description} icon={module.icon} />}
            />
          ))}
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  );
};
