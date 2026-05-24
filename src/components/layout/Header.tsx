import { Bell, Search, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  return (
    <header className="fixed top-0 left-64 right-0 z-30 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="relative w-full">
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
              <AvatarImage src="" alt="Admin" />
              <AvatarFallback className="bg-primary/10 text-primary">AD</AvatarFallback>
            </Avatar>
            <div className="hidden flex-col space-y-1 lg:flex">
              <span className="text-sm font-medium leading-none">Admin RH</span>
              <span className="text-xs text-muted-foreground">RH & Analytics</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
