
"use client";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import InoLoading from "@/components/InoLoading/InoLoading";
import { useUser } from "@/context/UserContext";
import BreadcrumbRoute from "@/components/Seo/BreadcrumbRoute";

export default function MainLayout({ children }) {
    return (
      <>
        <BreadcrumbRoute />
        <AuthCheck>{children}</AuthCheck>
      </>
    );
}

function AuthCheck({ children }) {
  const { user, loading } = useUser();

  if (loading) return <InoLoading />;

  if (user) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  return (
    <>
      <Header />
      <main className="home-main">{children}</main>
      <Footer />
    </>
  );
}