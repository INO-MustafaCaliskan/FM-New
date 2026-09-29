"use client";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import ClientLayout from "@/components/ClientLayout";
import InoLoading from "@/components/InoLoading/InoLoading";
import { useUser } from "@/context/UserContext";
import BreadcrumbRoute from "@/components/Seo/BreadcrumbRoute";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

  if (loading) return <InoLoading />;

  if (user) {
    // Ana sayfada eski yapi (ClientLayout), diger sayfalarda yeni yapi (DashboardLayout)
    if (pathname === '/') {
      return <ClientLayout>{children}</ClientLayout>;
    }
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