'use client'
import InoLoading from "@/components/InoLoading/InoLoading";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Logout = () => {
  const router = useRouter();
  const { logout } = useUser();

  useEffect(() => {
    const handleLogout = async () => {
      await logout();
      router.replace("/sign-in");
    };
    handleLogout();
  }, [router, logout]);

  return (
    <InoLoading />
  )
}

export default Logout;
