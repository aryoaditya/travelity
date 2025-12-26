import { useState, type ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { AppRightSidebar } from "./AppRightSidebar";

const AppLayout = ({ children }: { children: ReactNode }) => {
  const [activeNav, setActiveNav] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* AppSidebar */}
      <AppSidebar activeNav={activeNav} onNavChange={setActiveNav} />

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
            <AppSidebar activeNav={activeNav} onNavChange={setActiveNav} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:ml-56">
        <AppHeader onMenuClick={() => setIsMenuOpen(true)} />

        <div className="flex gap-6 p-4 lg:p-6">
          {/* Feed */}
          <main className="flex-1 space-y-4">{children}</main>

          {/* Right AppSidebar */}
          <AppRightSidebar />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
