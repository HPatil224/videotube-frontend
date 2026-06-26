import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { getVideoComments, addComment } from "../api/commentApi.js";
import CommentItem from "./CommentItem.jsx";
import Button from "./Button.jsx";

const CommentSection = ({ videoId }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [comments, setComments] = useState([]);
    const [totalComments, setTotalComments] = useState(0);
    const [newComment, setNewComment] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isPosting, setIsPosting] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchComments = async () => {
            setIsLoading(true);
            try {
                const response = await getVideoComments(videoId);
                if (!isMounted) return;
                setComments(response.data.data.docs || []);
                setTotalComments(response.data.data.totalDocs || 0);
            } catch (err) {
                // leave comments empty on failure
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchComments();
        return () => {
            isMounted = false;
        };
    }, [videoId]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsPosting(true);
        try {
            const response = await addComment(videoId, newComment.trim());
            setComments((prev) => [response.data.data, ...prev]);
            setTotalComments((prev) => prev + 1);
            setNewComment("");
        } catch (err) {
            // leave the typed comment in the input on failure
        } finally {
            setIsPosting(false);
        }
    };

    const handleUpdated = (updatedComment) => {
        setComments((prev) =>
            prev.map((c) => (c._id === updatedComment._id ? updatedComment : c))
        );
    };

    const handleDeleted = (commentId) => {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
        setTotalComments((prev) => Math.max(0, prev - 1));
    };

    return (
        <div className="mt-6">
            <h3 className="text-text-primary font-medium mb-4">
                {totalComments} {totalComments === 1 ? "Comment" : "Comments"}
            </h3>

            {isAuthenticated ? (
                <form onSubmit={handleAddComment} className="flex gap-2 mb-6">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 bg-transparent border-b border-border focus:border-brand outline-none text-sm text-text-primary py-1.5"
                    />
                    <Button type="submit" isLoading={isPosting} disabled={!newComment.trim()}>
                        Comment
                    </Button>
                </form>
            ) : (
                <p className="text-text-secondary text-sm mb-6">
                    <Link to="/login" className="text-brand hover:underline">
                        Sign in
                    </Link>{" "}
                    to leave a comment.
                </p>
            )}

            {isLoading ? (
                <p className="text-text-secondary text-sm">Loading comments...</p>
            ) : comments.length === 0 ? (
                <p className="text-text-secondary text-sm">
                    No comments yet. Be the first to say something.
                </p>
            ) : (
                <div className="divide-y divide-border">
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment._id}
                            comment={comment}
                            onUpdated={handleUpdated}
                            onDeleted={handleDeleted}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentSection;
