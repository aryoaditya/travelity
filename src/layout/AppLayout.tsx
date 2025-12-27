import { useState, type ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { AppRightSidebar } from "./AppRightSidebar";
import { useLocation } from "react-router-dom";

const AppLayout = ({ children }: { children: ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* AppSidebar */}
      <AppSidebar />

      {/* Mobile AppSidebar */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="h-full w-56 bg-card"
            onClick={(e) => e.stopPropagation()}
          >
            <AppSidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:ml-56 pb-16">
        <AppHeader onMenuClick={() => setIsMenuOpen(true)} />

        <div className="flex gap-6 p-4 lg:p-6">
          {/* Feed */}
          <main className="flex-1 space-y-4">{children}</main>

          {/* Right AppSidebar */}
          {location.pathname !== "/categories" ? <AppRightSidebar /> : null}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
