import type { Post } from "@/types/post.type";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { PostCard } from "@/components/PostCard";
import { fetchArticles } from "@/api/article.api";
import type { RootState } from "@/store";
import { useSelector } from "react-redux";
import { timeAgoFormatter } from "@/helper/timeAgoFormatter";

export default function HomeFeeds() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const searchQuery = useSelector((state: RootState) => state.search.query);

  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const currentQueryRef = useRef(searchQuery);

  const loadArticles = useCallback(
    async (isReset: boolean = false) => {
      if (loadingRef.current) return;

      loadingRef.current = true;
      setLoading(true);

      try {
        const currentPage = isReset ? 1 : pageRef.current;
        const response = await fetchArticles(currentPage, searchQuery);

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
    [searchQuery]
  );

  useEffect(() => {
    setPosts([]);
    pageRef.current = 1;
    setHasMore(true);
    loadingRef.current = false;
    currentQueryRef.current = searchQuery;

    loadArticles(true);
  }, [searchQuery]);

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

  if (posts.length === 0 && loading) return <p>Loading articles...</p>;
  if (posts.length === 0 && !loading)
    return (
      <p className="text-muted-foreground">
        {searchQuery
          ? `No articles found for "${searchQuery}"`
          : "No articles found"}
      </p>
    );

  return (
    <React.Fragment>
      {posts.length === 0 && searchQuery ? (
        <p className="text-center text-muted-foreground">
          No articles match "{searchQuery}"
        </p>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
      {loading && <p className="text-center mt-4">Loading more articles...</p>}
      {!hasMore && !searchQuery && (
        <p className="text-center mt-4">No more articles</p>
      )}
    </React.Fragment>
  );
}
