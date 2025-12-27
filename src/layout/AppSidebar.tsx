import { logout } from "@/utils/auth";
import { Home, Grid3X3, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

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

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: "/", icon: <Home className="h-5 w-5" />, label: "Home" },
    {
      id: "/categories",
      icon: <Grid3X3 className="h-5 w-5" />,
      label: "Categories",
    },
  ];

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
      <div className="flex flex-col h-full">
        <nav className="flex flex-col space-y-2">
          {navItems.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={isActive(item.id)}
              onClick={() => navigate(item.id)}
            />
          ))}
        </nav>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
