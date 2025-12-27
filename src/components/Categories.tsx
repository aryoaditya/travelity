import { fetchCategories, type CategoryItem } from "@/api/category.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { setSelectedCategory } from "@/store/categorySlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const categoryColors = [
  "bg-sky-500/20 hover:bg-sky-500/30 border-sky-500/30",
  "bg-orange-500/20 hover:bg-orange-500/30 border-orange-500/30",
  "bg-violet-500/20 hover:bg-violet-500/30 border-violet-500/30",
  "bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-500/30",
  "bg-pink-500/20 hover:bg-pink-500/30 border-pink-500/30",
  "bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/30",
  "bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-500/30",
  "bg-rose-500/20 hover:bg-rose-500/30 border-rose-500/30",
];

export default function Categories() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data: CategoryItem[] = await fetchCategories(1, 100);
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
    dispatch(setSelectedCategory(categoryName));
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-full px-4 md:px-8 pb-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">All Categories</h1>
          <p className="text-muted-foreground mt-2">
            Browse articles by category
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {loading ? "Loading..." : `${categories.length} Categories`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 rounded-lg bg-muted animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((category, index) => (
                  <button
                    key={category.documentId}
                    onClick={() => handleCategoryClick(category.name)}
                    className={`flex items-center justify-center rounded-lg p-4 border transition-all duration-200 ${
                      categoryColors[index % categoryColors.length]
                    }`}
                  >
                    <span className="font-medium text-center">
                      {category.name}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {!loading && categories.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No categories found
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
