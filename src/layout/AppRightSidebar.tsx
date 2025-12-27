import { fetchCategories, type CategoryItem } from "@/api/category.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SpinnerCustom } from "@/components/ui/spinner";
import type { RootState } from "@/store";
import {
  clearSelectedCategory,
  setSelectedCategory,
} from "@/store/categorySlice";
import { clearSearchQuery } from "@/store/searchSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const categoryColors = [
  "bg-sky-500/20 hover:bg-sky-500/30",
  "bg-orange-500/20 hover:bg-orange-500/30",
  "bg-violet-500/20 hover:bg-violet-500/30",
  "bg-emerald-500/20 hover:bg-emerald-500/30",
  "bg-pink-500/20 hover:bg-pink-500/30",
];

export function AppRightSidebar() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const selectedCategory = useSelector(
    (state: RootState) => state.category.selectedCategory
  );

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

  const handleCategoryClick = (categoryName: string) => {
    dispatch(clearSearchQuery());

    if (selectedCategory === categoryName) {
      dispatch(clearSelectedCategory());
    } else {
      dispatch(setSelectedCategory(categoryName));
    }
  };

  return (
    <aside className="hidden w-72 space-y-4 xl:block">
      {/* Categories Card */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? (
            <div className="flex justify-center">
              <SpinnerCustom className="size-6" />
            </div>
          ) : (
            <>
              {categories.map((category, index) => (
                <button
                  key={category.documentId}
                  onClick={() => handleCategoryClick(category.name)}
                  className={`flex w-full items-center justify-between rounded-lg p-3 transition-all duration-200 ${
                    categoryColors[index % categoryColors.length]
                  } ${
                    selectedCategory === category.name
                      ? "ring-2 ring-primary ring-offset-2"
                      : ""
                  }`}
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
          <Link
            to="/categories"
            className="mt-2 block text-sm font-medium text-primary hover:underline"
          >
            View All &gt;
          </Link>
        </CardContent>
      </Card>
    </aside>
  );
}
