import { Bell, Search, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header({ isSidebarCollapsed = false }: { isSidebarCollapsed?: boolean }) {
  return (
    <header className={`fixed top-0 ${isSidebarCollapsed ? 'left-20' : 'left-64'} right-0 z-30 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300`}>
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex w-full max-w-lg items-center space-x-6">
          <img 
            src="/logo_nordelta_fundo_claro.png" 
            alt="Nordelta 360" 
            className="h-7 lg:h-8" 
          />
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar colaborador, cargo..."
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-9"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive"></span>
            </span>
          </button>
          
          <div className="flex items-center space-x-2 border-l pl-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://randomuser.me/api/portraits/women/44.jpg" alt="Ana Silva" className="object-cover" />
              <AvatarFallback className="bg-primary/10 text-primary">AS</AvatarFallback>
            </Avatar>
            <div className="hidden flex-col space-y-1 lg:flex">
              <span className="text-sm font-medium leading-none">Ana Silva</span>
              <span className="text-xs text-muted-foreground">Admin RH</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
