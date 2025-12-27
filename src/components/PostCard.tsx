import { MessageSquare, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Post } from "@/types/post.type";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="shadow-soft overflow-hidden">
      <CardContent className="px-4">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user.username}`}
                alt={post.user.username}
              />
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{post.user.username}</p>
              <p className="text-xs text-muted-foreground">{post.timeAgo}</p>
            </div>
          </div>
          <button className="rounded-lg p-1 hover:bg-muted">
            <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Image */}
        <div className="relative mb-3 overflow-hidden rounded-xl">
          <img
            src={post.image}
            alt={post.title}
            className="aspect-video w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h3 className="text-lg font-semibold text-white">{post.title}</h3>
            <p className="mt-1 text-sm text-white/80">{post.description}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span
              className={
                "inline-flex items-center gap-1 rounded-md px-3 py-2 text-xs font-medium bg-primary/10"
              }
            >
              {post.category?.name || "General"}
            </span>
            {/* Comments */}
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
              <MessageSquare className="h-5 w-5" />
              <span>{post.commentCount}</span>
            </button>
          </div>

          {/* View Article Button */}
          <Button variant="default" size="sm">
            View Article
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
