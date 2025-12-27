import type { Post } from "@/types/post.type";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { PostCard } from "@/components/PostCard";
import fujiMountain from "@/assets/fuji-mountain.jpg";
import { fetchArticles } from "@/api/article.api";

export default function HomeFeeds() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const initialLoadDone = useRef(false);

  // Time Ago Formatter
  const timeAgoFormatter = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} minutes ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  const loadArticles = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const response = await fetchArticles(pageRef.current);

      const mappedPosts: Post[] = response.map((a: any) => ({
        id: a.id,
        documentId: a.documentId,
        category: a.category,
        title: a.title,
        description: a.description,
        image: a.cover_image_url || fujiMountain,
        comments: a.comments || [],
        commentCount: (a.comments && a.comments.length) || 0,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
        timeAgo: timeAgoFormatter(a.createdAt),
        user: a.user,
      }));

      setPosts((prev) => [...prev, ...mappedPosts]);

      if (mappedPosts.length < 10) {
        setHasMore(false);
      } else {
        pageRef.current += 1;
      }
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [hasMore]);

  // Initial load
  useEffect(() => {
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;
    loadArticles();
  }, [loadArticles]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 300 &&
        !loadingRef.current &&
        hasMore
      ) {
        loadArticles();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadArticles, hasMore]);

  if (posts.length === 0 && loading) return <p>Loading articles...</p>;
  if (posts.length === 0 && !loading) return <p>No articles found</p>;

  return (
    <React.Fragment>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      {loading && <p className="text-center mt-4">Loading more articles...</p>}
      {!hasMore && <p className="text-center mt-4">No more articles</p>}
    </React.Fragment>
  );
}
