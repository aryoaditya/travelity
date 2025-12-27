import { Search, Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getUser } from "@/utils/auth";
import { useDispatch } from "react-redux";
import { setSearchQuery } from "@/store/searchSlice";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function AppHeader({ onMenuClick }: HeaderProps) {
  const user = getUser();
  const dispatch = useDispatch();

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-card px-4 lg:px-6">
      {/* Hamburger menu button */}
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 hover:bg-muted lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search Bar */}
      <div className="hidden flex-1 max-w-md lg:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search articles..."
            className="w-full pl-10 bg-secondary border-0"
            onChange={onSearchChange}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Create Button */}
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Create Article</span>
        </Button>

        {/* User Profile */}
        <div className="hidden items-center gap-2 sm:flex">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={"https://github.com/shadcn.png"}
              alt={"Profile Picture"}
            />
          </Avatar>
          <p className="text-sm font-medium">Hi, {user.username}</p>
        </div>
      </div>
    </header>
  );
}
