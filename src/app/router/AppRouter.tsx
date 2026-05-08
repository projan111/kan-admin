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
import { BrandPage } from "../../pages/dashboard/brand/BrandPage";
import { CsrPage } from "../../pages/dashboard/csr/CsrPage";
import { NewsroomPage } from "../../pages/dashboard/newsroom/NewsroomPage";
import { TeamPage } from "../../pages/dashboard/team/TeamPage";
import { CompanyPage } from "../../pages/dashboard/company/CompanyPage";
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
import { ProfilePage } from "../../pages/dashboard/profile/ProfilePage";
import { DashboardOverviewPage } from "../../pages/dashboard/overview/DashboardOverviewPage";
import { ProductsPage } from "../../pages/dashboard/products/ProductsPage";
import { ProductCreatePage } from "../../pages/dashboard/products/ProductCreatePage";
import { ProductDetailsPage } from "../../pages/dashboard/products/ProductDetailsPage";
import { OrdersPage } from "../../pages/dashboard/orders/OrdersPage";
import { OrderDetailsPage } from "../../pages/dashboard/orders/OrderDetailsPage";
import { CustomersPage } from "../../pages/dashboard/customers/CustomersPage";
import { CustomerDetailsPage } from "../../pages/dashboard/customers/CustomerDetailsPage";
import { InventoryPage } from "../../pages/dashboard/inventory/InventoryPage";
import { InventoryDetailsPage } from "../../pages/dashboard/inventory/InventoryDetailsPage";
import { ReportsPage } from "../../pages/dashboard/reports/ReportsPage";
import { ReportDetailsPage } from "../../pages/dashboard/reports/ReportDetailsPage";
import { CategoriesPage } from "../../pages/dashboard/categories/CategoriesPage";
import {
  CategoryCreatePage,
  CategoryEditPage,
  SubcategoryCreatePage,
  SubcategoryEditPage,
} from "../../pages/dashboard/categories";
import { CartsPage } from "../../pages/dashboard/carts/CartsPage";
import { WishlistsPage } from "../../pages/dashboard/wishlists/WishlistsPage";
import { PaymentsPage } from "../../pages/dashboard/payments/PaymentsPage";
import { CouponsPage } from "../../pages/dashboard/coupons/CouponsPage";
import { DeliveryPage } from "../../pages/dashboard/delivery/DeliveryPage";
import { ReviewsPage } from "../../pages/dashboard/reviews/ReviewsPage";
import { ContactPage } from "../../pages/dashboard/contact/ContactPage";
import { ContactCreatePage } from "../../pages/dashboard/contact/ContactCreatePage";
import { ProductInquiriesPage } from "../../pages/dashboard/inquiries/ProductInquiriesPage";
import { SiteInquiriesPage } from "../../pages/dashboard/inquiries/SiteInquiriesPage";
import { FaqsPage } from "../../pages/dashboard/faqs/FaqsPage";
import { BlogPostsPage } from "../../pages/dashboard/marketing/BlogPostsPage";
import { NewsletterPage } from "../../pages/dashboard/marketing/NewsletterPage";
import { NotificationsPage } from "../../pages/dashboard/marketing/NotificationsPage";
import { CampaignsPage } from "../../pages/dashboard/marketing/CampaignsPage";
import { ActivityLogsPage } from "../../pages/dashboard/reports/ActivityLogsPage";
import { AuditLogsPage } from "../../pages/dashboard/reports/AuditLogsPage";
import { MissingModulePage } from "../../pages/dashboard/missing/MissingModulePage";
import { MissingModuleDetailsPage } from "../../pages/dashboard/missing/MissingModuleDetailsPage";
import {
  BrandViewPage,
  CompanyViewPage,
  ContactViewPage,
  CsrViewPage,
  NewsroomViewPage,
  TeamViewPage,
  UsersViewPage,
} from "../../pages/dashboard/views/EntityViewPages";
import { ecommerceModules } from "../config/ecommerceModules";
import { ModulePlaceholderPage } from "../../pages/dashboard/common/ModulePlaceholderPage";

const placeholderModules = ecommerceModules.filter(
  (module) =>
    ![
      "overview",
      "users",
      "customers",
      "products",
      "orders",
      "inventory",
      "categories",
      "product-variants",
      "product-attributes-tags",
      "product-media",
      "advertisements",
      "carts",
      "wishlists",
      "payments",
      "coupons",
      "delivery",
      "reviews",
      "faqs",
      "product-inquiries",
      "contacts",
      "site-inquiries",
      "blog-posts",
      "seo-metadata",
      "newsletter",
      "web-push-subscriptions",
      "web-push-notifications",
      "email-campaigns",
      "activity-logs",
      "audit-logs",
    ].includes(module.key),
);
const usersModule = ecommerceModules.find((module) => module.key === "users");

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
              <Route
                path="/dashboard/users"
                element={
                  usersModule ? (
                    <ModulePlaceholderPage
                      moduleKey={usersModule.key}
                      title={usersModule.label}
                      description={usersModule.description}
                      icon={usersModule.icon}
                    />
                  ) : null
                }
              />
              <Route
                path="/dashboard/users/create"
                element={<UsersCreatePage />}
              />
              <Route
                path="/dashboard/users/:id/edit"
                element={<UsersEditPage />}
              />
              <Route path="/dashboard/users/:id" element={<UsersViewPage />} />
            </Route>
          </Route>

          <Route path="/dashboard" element={<DashboardOverviewPage />} />
          <Route path="/dashboard/profile" element={<ProfilePage />} />
          <Route
            path="/dashboard/change-password"
            element={<ChangePasswordPage />}
          />

          <Route element={<RoleGuard allow={["SUDOADMIN"]} />}>
            <Route path="/dashboard/auth/signup" element={<SignupPage />} />
          </Route>

          <Route path="/dashboard/customers" element={<CustomersPage />} />
          <Route
            path="/dashboard/customers/:id"
            element={<CustomerDetailsPage />}
          />

          <Route path="/dashboard/products" element={<ProductsPage />} />
          <Route
            path="/dashboard/products/create"
            element={<ProductCreatePage />}
          />
          <Route
            path="/dashboard/products/:id/edit"
            element={<ProductCreatePage />}
          />
          <Route
            path="/dashboard/products/:id"
            element={<ProductDetailsPage />}
          />
          <Route path="/dashboard/orders" element={<OrdersPage />} />
          <Route path="/dashboard/orders/:id" element={<OrderDetailsPage />} />
          <Route path="/dashboard/inventory" element={<InventoryPage />} />
          <Route
            path="/dashboard/inventory/:id"
            element={<InventoryDetailsPage />}
          />
          <Route path="/dashboard/reports" element={<ReportsPage />} />
          <Route
            path="/dashboard/reports/:id"
            element={<ReportDetailsPage />}
          />
          <Route path="/dashboard/categories" element={<CategoriesPage />} />
          <Route
            path="/dashboard/categories/create"
            element={<CategoryCreatePage />}
          />
          <Route
            path="/dashboard/categories/:id"
            element={<CategoryEditPage />}
          />
          <Route
            path="/dashboard/categories/:id/subcategories/create"
            element={<SubcategoryCreatePage />}
          />
          <Route
            path="/dashboard/categories/:id/subcategories/:subcategoryId"
            element={<SubcategoryEditPage />}
          />
          <Route
            path="/dashboard/product-variants"
            element={<MissingModulePage moduleKey="product-variants" />}
          />
          <Route
            path="/dashboard/product-variants/:id"
            element={<MissingModuleDetailsPage moduleKey="product-variants" />}
          />
          <Route
            path="/dashboard/product-attributes-tags"
            element={<MissingModulePage moduleKey="product-attributes-tags" />}
          />
          <Route
            path="/dashboard/product-attributes-tags/:id"
            element={
              <MissingModuleDetailsPage moduleKey="product-attributes-tags" />
            }
          />
          <Route
            path="/dashboard/product-media"
            element={<MissingModulePage moduleKey="product-media" />}
          />
          <Route
            path="/dashboard/product-media/:id"
            element={<MissingModuleDetailsPage moduleKey="product-media" />}
          />
          <Route
            path="/dashboard/advertisements"
            element={<MissingModulePage moduleKey="advertisements" />}
          />
          <Route
            path="/dashboard/advertisements/:id"
            element={<MissingModuleDetailsPage moduleKey="advertisements" />}
          />
          <Route path="/dashboard/carts" element={<CartsPage />} />
          <Route
            path="/dashboard/carts/:id"
            element={<MissingModuleDetailsPage moduleKey="carts" />}
          />
          <Route path="/dashboard/wishlists" element={<WishlistsPage />} />
          <Route
            path="/dashboard/wishlists/:id"
            element={<MissingModuleDetailsPage moduleKey="wishlists" />}
          />
          <Route path="/dashboard/payments" element={<PaymentsPage />} />
          <Route
            path="/dashboard/payments/:id"
            element={<MissingModuleDetailsPage moduleKey="payments" />}
          />
          <Route path="/dashboard/coupons" element={<CouponsPage />} />
          <Route
            path="/dashboard/coupons/:id"
            element={<MissingModuleDetailsPage moduleKey="coupons" />}
          />
          <Route
            path="/dashboard/delivery/shipments"
            element={<DeliveryPage />}
          />
          <Route
            path="/dashboard/delivery/shipments/:id"
            element={<MissingModuleDetailsPage moduleKey="delivery" />}
          />
          <Route path="/dashboard/reviews" element={<ReviewsPage />} />
          <Route
            path="/dashboard/reviews/:id"
            element={<MissingModuleDetailsPage moduleKey="reviews" />}
          />
          <Route path="/dashboard/faqs" element={<FaqsPage />} />
          <Route
            path="/dashboard/faqs/:id"
            element={<MissingModuleDetailsPage moduleKey="faqs" />}
          />
          <Route
            path="/dashboard/support/product-inquiries"
            element={<ProductInquiriesPage />}
          />
          <Route
            path="/dashboard/support/product-inquiries/:id"
            element={<MissingModuleDetailsPage moduleKey="product-inquiries" />}
          />
          <Route path="/dashboard/support/contacts" element={<ContactPage />} />
          <Route
            path="/dashboard/support/contacts/:id"
            element={<ContactViewPage />}
          />
          <Route
            path="/dashboard/support/site-inquiries"
            element={<SiteInquiriesPage />}
          />
          <Route
            path="/dashboard/support/site-inquiries/:id"
            element={<MissingModuleDetailsPage moduleKey="site-inquiries" />}
          />
          <Route path="/dashboard/blog-posts" element={<BlogPostsPage />} />
          <Route
            path="/dashboard/blog-posts/:id"
            element={<MissingModuleDetailsPage moduleKey="blog-posts" />}
          />
          <Route
            path="/dashboard/seo-metadata"
            element={<MissingModulePage moduleKey="seo-metadata" />}
          />
          <Route
            path="/dashboard/seo-metadata/:id"
            element={<MissingModuleDetailsPage moduleKey="seo-metadata" />}
          />
          <Route path="/dashboard/newsletter" element={<NewsletterPage />} />
          <Route
            path="/dashboard/newsletter/:id"
            element={<MissingModuleDetailsPage moduleKey="newsletter" />}
          />
          <Route
            path="/dashboard/web-push-subscriptions"
            element={<MissingModulePage moduleKey="web-push-subscriptions" />}
          />
          <Route
            path="/dashboard/web-push-subscriptions/:id"
            element={
              <MissingModuleDetailsPage moduleKey="web-push-subscriptions" />
            }
          />
          <Route
            path="/dashboard/web-push-notifications"
            element={<NotificationsPage />}
          />
          <Route
            path="/dashboard/web-push-notifications/:id"
            element={
              <MissingModuleDetailsPage moduleKey="web-push-notifications" />
            }
          />
          <Route
            path="/dashboard/email-campaigns"
            element={<CampaignsPage />}
          />
          <Route
            path="/dashboard/email-campaigns/:id"
            element={<MissingModuleDetailsPage moduleKey="email-campaigns" />}
          />
          <Route
            path="/dashboard/activity-logs"
            element={<ActivityLogsPage />}
          />
          <Route
            path="/dashboard/activity-logs/:id"
            element={<MissingModuleDetailsPage moduleKey="activity-logs" />}
          />
          <Route path="/dashboard/audit-logs" element={<AuditLogsPage />} />
          <Route
            path="/dashboard/audit-logs/:id"
            element={<MissingModuleDetailsPage moduleKey="audit-logs" />}
          />

          <Route path="/dashboard/contact" element={<ContactPage />} />
          <Route
            path="/dashboard/contact/create"
            element={<ContactCreatePage />}
          />
          <Route path="/dashboard/contact/:id" element={<ContactViewPage />} />

          <Route path="/dashboard/team" element={<TeamPage />} />
          <Route element={<PermissionGuard permission="entity.create" />}>
            <Route path="/dashboard/team/create" element={<TeamCreatePage />} />
          </Route>
          <Route element={<PermissionGuard permission="entity.update" />}>
            <Route
              path="/dashboard/team/:slug/edit"
              element={<TeamEditPage />}
            />
          </Route>
          <Route path="/dashboard/team/:slug" element={<TeamViewPage />} />

          <Route path="/dashboard/company" element={<CompanyPage />} />
          <Route element={<PermissionGuard permission="entity.create" />}>
            <Route
              path="/dashboard/company/create"
              element={<CompanyCreatePage />}
            />
          </Route>
          <Route element={<PermissionGuard permission="entity.update" />}>
            <Route
              path="/dashboard/company/:slug/edit"
              element={<CompanyEditPage />}
            />
          </Route>
          <Route
            path="/dashboard/company/:slug"
            element={<CompanyViewPage />}
          />

          <Route path="/dashboard/brand" element={<BrandPage />} />
          <Route element={<PermissionGuard permission="entity.create" />}>
            <Route
              path="/dashboard/brand/create"
              element={<BrandCreatePage />}
            />
          </Route>
          <Route element={<PermissionGuard permission="entity.update" />}>
            <Route
              path="/dashboard/brand/:slug/edit"
              element={<BrandEditPage />}
            />
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
            <Route
              path="/dashboard/newsroom/create"
              element={<NewsroomCreatePage />}
            />
          </Route>
          <Route element={<PermissionGuard permission="entity.update" />}>
            <Route
              path="/dashboard/newsroom/:slug/edit"
              element={<NewsroomEditPage />}
            />
          </Route>
          <Route
            path="/dashboard/newsroom/:slug"
            element={<NewsroomViewPage />}
          />

          {placeholderModules.map((module) => (
            <Route
              key={module.key}
              path={module.path}
              element={
                <ModulePlaceholderPage
                  moduleKey={module.key}
                  title={module.label}
                  description={module.description}
                  icon={module.icon}
                />
              }
            />
          ))}
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  );
};
