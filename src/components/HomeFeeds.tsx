import type { Post } from "@/types/post.type";
import React from "react";
import { PostCard } from "@/components/PostCard";
import fujiMountain from "@/assets/fuji-mountain.jpg";

export default function HomeFeeds() {
  const posts: Post[] = [
    {
      id: "1",
      category: "Travel",
      title: "Lorem, ipsum dolor",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit praesentium eum commodi quisquam",
      image: fujiMountain,
      comments: 12,
      timeAgo: "2 hours ago",
    },
    {
      id: "2",
      category: "Bali",
      title: "Lorem ipsum dolor sit amet",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit praesentium eum commodi quisquam",
      image: fujiMountain,
      comments: 8,
      timeAgo: "5 hours ago",
    },
    {
      id: "3",
      category: "NTT",
      title: "Lorem ipsum dolor sit amet consectetur, adipisicing elit",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit praesentium eum commodi quisquam",
      image: fujiMountain,
      comments: 30,
      timeAgo: "5 hours ago",
    },
  ];

  return (
    <React.Fragment>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </React.Fragment>
  );
}
