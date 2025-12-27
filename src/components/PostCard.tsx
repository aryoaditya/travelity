import {
  ChevronDown,
  ChevronUp,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Send,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Post } from "@/types/post.type";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { timeAgoFormatter } from "@/helper/timeAgoFormatter";
import type { Comment } from "@/types/comment.type";
import { deleteArticle } from "@/api/article.api";
import { toast } from "sonner";
import { ArticleFormModal } from "./Modal/ArticleFormModal";
import { DeleteConfirmationModal } from "./Modal/DeleteConfirmationModal";
import { getUser } from "@/utils/auth";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { createComment, deleteComment, updateComment } from "@/api/comment.api";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [comments, setComments] = useState<Comment[]>(post.comments || []);
  const [newComment, setNewComment] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");
  const [isUpdatingComment, setIsUpdatingComment] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null
  );
  const [isCommentDeleteModalOpen, setIsCommentDeleteModalOpen] =
    useState(false);
  const user = getUser();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteArticle(post.documentId);
      toast.success("Article deleted successfully");
      setIsDeleteModalOpen(false);
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message || "Failed to delete article";

      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;

    setIsPostingComment(true);
    try {
      const response = await createComment({
        content: newComment,
        article: post.id,
      });

      const newCommentData: Comment = {
        id: response?.id,
        documentId: response?.documentId,
        content: newComment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        timeAgo: timeAgoFormatter(new Date().toISOString()),
        user: user,
      };

      setComments([...comments, newCommentData]);
      setNewComment("");
      toast.success("Comment posted successfully");
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message || "Failed to post comment";

      toast.error(message);
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.documentId || String(comment.id));
    setEditingCommentContent(comment.content);
  };

  const handleUpdateComment = async () => {
    if (!editingCommentId || !editingCommentContent.trim()) return;

    setIsUpdatingComment(true);
    try {
      await updateComment(editingCommentId, { content: editingCommentContent });
      setComments(
        comments.map((c) =>
          c.documentId === editingCommentId || String(c.id) === editingCommentId
            ? { ...c, content: editingCommentContent }
            : c
        )
      );
      setEditingCommentId(null);
      setEditingCommentContent("");
      toast.success("Comment updated successfully");
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message || "Failed to update comment";

      toast.error(message);
    } finally {
      setIsUpdatingComment(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!deletingCommentId) return;

    try {
      await deleteComment(deletingCommentId);
      setComments(
        comments.filter(
          (c) =>
            c.documentId !== deletingCommentId &&
            String(c.id) !== deletingCommentId
        )
      );
      setIsCommentDeleteModalOpen(false);
      setDeletingCommentId(null);
      toast.success("Comment deleted successfully");
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message || "Failed to delete comment";

      toast.error(message);
    }
  };

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
          {user.id === post.user.id && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-lg p-1 hover:bg-muted">
                  <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Article
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="text-destructive h-4 w-4 mr-2" />
                  Delete Article
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
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
          </div>
        </div>

        <div className="my-3 ml-2">
          <p
            className={cn("text-md", !isDescriptionExpanded && "line-clamp-1")}
          >
            {post.description}
          </p>
          {post.description && post.description.length > 80 && (
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="text-sm text-primary hover:underline mt-1"
            >
              {isDescriptionExpanded ? "Show less" : "Read more"}
            </button>
          )}
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
            {/* Comments Toggle Button */}
            <button
              onClick={() => setIsCommentsExpanded(!isCommentsExpanded)}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageSquare className="h-5 w-5" />
              <span>{comments.length}</span>
              {isCommentsExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Comments Section */}
        {isCommentsExpanded && (
          <div className="mt-4 border-t pt-4 space-y-3">
            {/* Comment Input */}
            <div className="flex gap-3 items-start">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage
                  src={"https://github.com/shadcn.png"}
                  alt={"Profile Picture"}
                  className="rounded-full"
                />
              </Avatar>
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && !e.shiftKey && handlePostComment()
                  }
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={handlePostComment}
                  disabled={isPostingComment || !newComment.trim()}
                >
                  {isPostingComment ? "..." : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Comments List */}
            {comments.length > 0 ? (
              comments.map((comment: Comment, index: number) => (
                <div key={comment.id || index} className="flex gap-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage
                      src={
                        user.id === comment.user?.id
                          ? "https://github.com/shadcn.png"
                          : `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user?.username || "anonymous"}`
                      }
                      alt={comment.user?.username || "Anonymous"}
                      className="rounded-full"
                    />
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {comment.user?.username || "Anonymous"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {timeAgoFormatter(
                            comment.createdAt || new Date().toISOString()
                          )}
                        </span>
                      </div>
                      {user.id === comment.user?.id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="rounded p-1 hover:bg-muted">
                              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditComment(comment)}
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setDeletingCommentId(
                                  comment.documentId || String(comment.id)
                                );
                                setIsCommentDeleteModalOpen(true);
                              }}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                    {editingCommentId ===
                    (comment.documentId || String(comment.id)) ? (
                      <div className="flex gap-2 mt-1">
                        <Input
                          value={editingCommentContent}
                          onChange={(e) =>
                            setEditingCommentContent(e.target.value)
                          }
                          className="flex-1 h-8 text-sm"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingCommentId(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleUpdateComment}
                          disabled={isUpdatingComment}
                        >
                          {isUpdatingComment ? "..." : "Save"}
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {comment.content}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-2">
                No comments yet
              </p>
            )}
          </div>
        )}

        {/* Edit Modal */}
        <ArticleFormModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          mode="edit"
          initialData={{
            documentId: post.documentId,
            title: post.title,
            description: post.description,
            cover_image_url: post.image,
            category: post.category?.id,
          }}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          onConfirm={handleDelete}
          isLoading={isDeleting}
          title="Delete Article"
          description="Are you sure you want to delete this article?"
        />

        <DeleteConfirmationModal
          open={isCommentDeleteModalOpen}
          onOpenChange={setIsCommentDeleteModalOpen}
          onConfirm={handleDeleteComment}
          title="Delete Comment"
          description="Are you sure you want to delete this comment?"
        />
      </CardContent>
    </Card>
  );
}
