import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { PortfolioBanner } from "./PortfolioBanner";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === "/";
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!isLoginPage && sessionStorage.getItem("isAuthenticated") !== "true") {
      navigate({ to: "/" });
    }
  }, [isLoginPage, location.pathname, navigate]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-muted/40 print:bg-white transition-all duration-300">
      <div className="print:hidden">
        <PortfolioBanner />
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
        <Header isSidebarCollapsed={isSidebarCollapsed} />
      </div>
      <main className={`${isSidebarCollapsed ? 'ml-20' : 'ml-64'} pt-16 print:ml-0 print:pt-0 transition-all duration-300`}>
        <div className="p-6 print:p-0">
          {children}
        </div>
      </main>
    </div>
  );
}
