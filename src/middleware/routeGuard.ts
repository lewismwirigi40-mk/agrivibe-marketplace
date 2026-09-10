// src/middleware/routeGuard.ts
import { useEffect } from "react";
import { useRouter } from "next/router";

export function useAdminGuard() {
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = () => {
      const user = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (!token || !user) {
        router.push("/admin/login");
        return;
      }

      try {
        const userData = JSON.parse(user);
        if (userData.role !== "admin") {
          router.push("/");
        }
      } catch {
        router.push("/admin/login");
      }
    };

    checkAdmin();
  }, [router]);
}

export function useAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);
}
