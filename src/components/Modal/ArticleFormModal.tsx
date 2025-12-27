import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchCategories, type CategoryItem } from "@/api/category.api";
import { toast } from "sonner";
import { ImagePlus } from "lucide-react";
import {
  createArticle,
  updateArticle,
  type ArticleCreateUpdateDto,
} from "@/api/article.api";

const articleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  cover_image_url: z
    .string()
    .url("Please enter a valid URL")
    .min(1, "Cover image URL is required"),
  category: z.string().min(1, "Category is required"),
});

type ArticleFormData = z.infer<typeof articleSchema>;

interface ArticleFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initialData?: {
    documentId?: string;
    title?: string;
    description?: string;
    cover_image_url?: string;
    category?: number;
  };
  onSuccess?: () => void;
}

export function ArticleFormModal({
  open,
  onOpenChange,
  mode,
  initialData,
}: ArticleFormModalProps) {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      description: "",
      cover_image_url: "",
      category: "",
    },
  });

  const coverImageUrl = watch("cover_image_url");

  useEffect(() => {
    if (coverImageUrl) {
      setImagePreview(coverImageUrl);
    }
  }, [coverImageUrl]);

  useEffect(() => {
    if (open) {
      loadCategories();
      if (mode === "edit" && initialData) {
        reset({
          title: initialData.title || "",
          description: initialData.description || "",
          cover_image_url: initialData.cover_image_url || "",
          category: initialData.category?.toString() || "",
        });
        setImagePreview(initialData.cover_image_url || "");
      } else {
        reset({
          title: "",
          description: "",
          cover_image_url: "",
          category: "",
        });
        setImagePreview("");
      }
    }
  }, [open, mode, initialData, reset]);

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message ||
        "Invalid credentials, please try again";

      toast.error(message || "Failed to load categories");
    }
  };

  const onSubmit = async (data: ArticleFormData) => {
    setIsLoading(true);
    try {
      const payload: ArticleCreateUpdateDto = {
        title: data.title,
        description: data.description,
        cover_image_url: data.cover_image_url,
        category: parseInt(data.category),
      };

      if (mode === "create") {
        await createArticle(payload);
        toast.success("Article created successfully");
      } else if (initialData?.documentId) {
        await updateArticle(initialData.documentId, payload);
        toast.success("Article updated successfully");
      }

      onOpenChange(false);
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message ||
        "Invalid credentials, please try again";

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Article" : "Edit Article"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter article title"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter article description"
              rows={4}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Cover Image URL */}
          <div className="space-y-2">
            <Label htmlFor="cover_image_url">Cover Image URL</Label>
            <Input
              id="cover_image_url"
              placeholder="https://example.com/image.jpg"
              {...register("cover_image_url")}
            />
            {errors.cover_image_url && (
              <p className="text-sm text-destructive">
                {errors.cover_image_url.message}
              </p>
            )}
            {imagePreview && (
              <div className="mt-2 relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                <img
                  src={imagePreview}
                  alt="Cover preview"
                  className="h-full w-full object-cover"
                  onError={() => setImagePreview("")}
                />
              </div>
            )}
            {!imagePreview && (
              <div className="mt-2 flex aspect-video w-full items-center justify-center rounded-lg border border-dashed bg-muted/50">
                <div className="flex flex-col items-center text-muted-foreground">
                  <ImagePlus className="h-8 w-8 mb-2" />
                  <span className="text-sm">Image preview</span>
                </div>
              </div>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              onValueChange={(value) => setValue("category", value)}
              defaultValue={initialData?.category?.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">
                {errors.category.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? "Saving..."
              : mode === "create"
                ? "Create Article"
                : "Update Article"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
