import type { Post } from "@/types/post.type";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { PostCard } from "@/components/PostCard";
import { fetchArticles } from "@/api/article.api";
import type { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { timeAgoFormatter } from "@/helper/timeAgoFormatter";
import { clearSelectedCategory } from "@/store/categorySlice";
import { X } from "lucide-react";

export default function HomeFeeds() {
  const dispatch = useDispatch();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const searchQuery = useSelector((state: RootState) => state.search.query);
  const selectedCategory = useSelector(
    (state: RootState) => state.category.selectedCategory
  );

  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const currentQueryRef = useRef(searchQuery);
  const currentCategoryRef = useRef(selectedCategory);

  const loadArticles = useCallback(
    async (isReset: boolean = false) => {
      if (loadingRef.current) return;

      loadingRef.current = true;
      setLoading(true);

      try {
        const currentPage = isReset ? 1 : pageRef.current;
        const response = await fetchArticles(
          currentPage,
          10,
          searchQuery,
          selectedCategory
        );

        const mappedPosts: Post[] = response.map((a: any) => ({
          id: a.id,
          documentId: a.documentId,
          category: a.category,
          title: a.title,
          description: a.description,
          image: a.cover_image_url,
          comments: a.comments || [],
          commentCount: (a.comments && a.comments.length) || 0,
          createdAt: a.createdAt,
          updatedAt: a.updatedAt,
          timeAgo: timeAgoFormatter(a.createdAt),
          user: a.user,
        }));

        if (isReset) {
          setPosts(mappedPosts);
          pageRef.current = 2;
        } else {
          setPosts((prev) => [...prev, ...mappedPosts]);
          pageRef.current += 1;
        }

        setHasMore(mappedPosts.length >= 10);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [searchQuery, selectedCategory]
  );

  // Reset when search query or category changes
  useEffect(() => {
    setPosts([]);
    pageRef.current = 1;
    setHasMore(true);
    loadingRef.current = false;
    currentQueryRef.current = searchQuery;
    currentCategoryRef.current = selectedCategory;

    loadArticles(true);
  }, [searchQuery, selectedCategory]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 300 &&
        !loadingRef.current &&
        hasMore
      ) {
        loadArticles(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadArticles, hasMore]);

  const getEmptyMessage = () => {
    if (searchQuery && selectedCategory) {
      return `No articles found for "${searchQuery}" in ${selectedCategory}`;
    }
    if (searchQuery) {
      return `No articles found for "${searchQuery}"`;
    }
    if (selectedCategory) {
      return `No articles found in ${selectedCategory}`;
    }
    return "No articles found";
  };

  if (posts.length === 0 && loading) return <p>Loading articles...</p>;
  if (posts.length === 0 && !loading) {
    return <p className="text-muted-foreground">{getEmptyMessage()}</p>;
  }

  return (
    <React.Fragment>
      {selectedCategory && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Showing articles in:
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {selectedCategory}
            <button
              onClick={() => dispatch(clearSelectedCategory())}
              className="ml-1 rounded-full p-0.5 hover:bg-primary/20 transition-colors"
              aria-label="Clear category filter"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        </div>
      )}
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      {loading && <p className="text-center mt-4">Loading more articles...</p>}
      {!hasMore && posts.length > 0 && (
        <p className="text-center mt-4 text-muted-foreground">
          No more articles
        </p>
      )}
    </React.Fragment>
  );
}
