import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Category {
  id: string;
  name: string;
  count: number;
}

export function AppRightSidebar() {
  const categories: Category[] = [
    { id: "1", name: "Wisata Bogor", count: 24 },
    { id: "2", name: "Wisata NTT", count: 15 },
    { id: "3", name: "Wisata Kalimantan", count: 18 },
    { id: "4", name: "Wisata Sulawesi", count: 12 },
    { id: "5", name: "Wisata Sumatera", count: 10 },
  ];

  return (
    <aside className="hidden w-72 space-y-4 xl:block">
      {/* Categories Card */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.map((category, index) => (
            <button
              key={category.id}
              className={`flex w-full items-center justify-between rounded-lg p-3 transition-colors ${
                index === 0
                  ? "bg-[hsl(199_89%_48%/10%)]"
                  : index === 1
                    ? "bg-[hsl(25_95%_53%/10%)]"
                    : index === 2
                      ? "bg-[hsl(262_83%_58%/10%)]"
                      : index === 3
                        ? "bg-[hsl(142_71%_45%/10%)]"
                        : "bg-[hsl(330_81%_60%/10%)]"
              } hover:bg-muted`}
            >
              <div className="flex items-center">
                <p className="text-sm font-medium">{category.name}</p>
              </div>
              <span className="text-sm text-muted-foreground">
                {category.count}
              </span>
            </button>
          ))}
          <button className="mt-2 text-sm font-medium text-primary hover:underline">
            View All &gt;
          </button>
        </CardContent>
      </Card>
    </aside>
  );
}
