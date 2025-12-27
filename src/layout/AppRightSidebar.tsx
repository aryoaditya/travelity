import { fetchCategories, type CategoryItem } from "@/api/category.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

export function AppRightSidebar() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data: CategoryItem[] = await fetchCategories(1, 4);

        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <aside className="hidden w-72 space-y-4 xl:block">
      {/* Categories Card */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : (
            <>
              {categories.map((category, index) => (
                <button
                  key={category.documentId}
                  className={`flex w-full items-center justify-between rounded-lg p-3 transition-colors ${
                    index === 0
                      ? "bg-[hsl(199_89%_48%/20%)]"
                      : index === 1
                        ? "bg-[hsl(25_95%_53%/20%)]"
                        : index === 2
                          ? "bg-[hsl(262_83%_58%/20%)]"
                          : index === 3
                            ? "bg-[hsl(142_71%_45%/20%)]"
                            : "bg-[hsl(330_81%_60%/20%)]"
                  } hover:bg-muted`}
                >
                  <div className="flex items-center min-w-0">
                    <p className="text-sm text-left font-medium">
                      {category.name}
                    </p>
                  </div>
                </button>
              ))}
            </>
          )}
          <button className="mt-2 text-sm font-medium text-primary hover:underline">
            View All &gt;
          </button>
        </CardContent>
      </Card>
    </aside>
  );
}
