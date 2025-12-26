import { Home, Grid3X3, FileText, LogOut } from "lucide-react";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

function NavItem({ icon, label, isActive, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

interface SidebarProps {
  activeNav: string;
  onNavChange: (nav: string) => void;
}

export function AppSidebar({ activeNav, onNavChange }: SidebarProps) {
  const navItems = [
    { id: "home", icon: <Home className="h-5 w-5" />, label: "Home" },
    {
      id: "categories",
      icon: <Grid3X3 className="h-5 w-5" />,
      label: "Categories",
    },
    {
      id: "my-articles",
      icon: <FileText className="h-5 w-5" />,
      label: "My Articles",
    },
    {
      id: "logout",
      icon: <LogOut className="h-5 w-5" />,
      label: "Logout",
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-56 flex-col border-r bg-card lg:flex">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center gap-2 border-b px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <span className="text-lg font-bold text-primary-foreground">T</span>
        </div>
        <span className="text-lg font-semibold">Travelity</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeNav === item.id}
            onClick={() => onNavChange(item.id)}
          />
        ))}
      </nav>
    </aside>
  );
}
