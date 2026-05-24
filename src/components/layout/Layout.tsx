import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/40 print:bg-white">
      <div className="print:hidden">
        <Sidebar />
        <Header />
      </div>
      <main className="ml-64 pt-16 print:ml-0 print:pt-0">
        <div className="p-6 print:p-0">
          {children}
        </div>
      </main>
    </div>
  );
}
