import { useState, useMemo } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { CategoryItem } from "@/api/category.api";
import { SpinnerCustom } from "./ui/spinner";
import { ScrollArea } from "./ui/scroll-area";

interface CategoryDropdownProps {
  categories: CategoryItem[];
  value: number | null;
  onChange: (value: number | null) => void;
  onCreateCategory: (name: string) => Promise<CategoryItem | undefined>;
  isLoading?: boolean;
}

export function CategoryDropdown({
  categories,
  value,
  onChange,
  onCreateCategory,
  isLoading = false,
}: CategoryDropdownProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const selectedCategory = useMemo(
    () => categories.find((cat) => cat.id === value),
    [categories, value]
  );

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  const showCreateOption = useMemo(() => {
    if (!searchQuery.trim()) return false;
    const exists = categories.some(
      (cat) => cat.name.toLowerCase() === searchQuery.toLowerCase()
    );
    return !exists;
  }, [categories, searchQuery]);

  const handleCreateCategory = async () => {
    if (!searchQuery.trim()) return;

    setIsCreating(true);
    try {
      const newCategory = await onCreateCategory(searchQuery.trim());
      if (!newCategory) return;

      onChange(newCategory.id);
      setSearchQuery("");
      setOpen(false);
    } catch (error) {
      console.error("Failed to create category:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-secondary/30 border-border hover:bg-secondary/50 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="text-muted-foreground flex items-center gap-2">
              <SpinnerCustom className="w-4 h-4" />
              Loading categories...
            </span>
          ) : selectedCategory ? (
            <span className="text-foreground">{selectedCategory.name}</span>
          ) : (
            <span className="text-muted-foreground">Select category...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0 bg-popover border-border z-50"
        align="start"
      >
        <Command className="bg-transparent">
          <CommandInput
            placeholder="Search or create category..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="border-none focus:ring-0"
          />
          <CommandList className="max-h-60">
            {showCreateOption && (
              <>
                <CommandGroup>
                  <CommandItem
                    onSelect={handleCreateCategory}
                    disabled={isCreating}
                    className="cursor-pointer text-primary hover:bg-primary/10"
                  >
                    {isCreating ? (
                      <SpinnerCustom className="mr-2 h-4 w-4" />
                    ) : (
                      <Plus className="mr-2 h-4 w-4" />
                    )}
                    Create "{searchQuery}"
                  </CommandItem>
                </CommandGroup>
                <CommandSeparator />
              </>
            )}

            <ScrollArea className="overflow-y-auto">
              <CommandGroup heading="Categories" className="overflow-y-auto">
                {filteredCategories.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.name}
                    onSelect={() => {
                      onChange(category.id);
                      setSearchQuery("");
                      setOpen(false);
                    }}
                    className="cursor-pointer hover:bg-secondary/50"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 text-primary",
                        value === category.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {category.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
