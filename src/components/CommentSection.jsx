import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getVideoComments, addComment, deleteComment } from "../api/commentApi";
import { formatTimeAgo } from "../utils/format";
import Button from "./Button";
import Input from "./Input";

export default function CommentSection({ videoId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await getVideoComments(videoId);
                // Extract array based on your backend pagination structure
                const payload = response.data?.data || response.data;
                const commentsArray = payload?.docs || (Array.isArray(payload) ? payload : []);
                setComments(commentsArray);
            } catch (error) {
                console.error("Failed to load comments", error);
            } finally {
                setLoading(false);
            }
        };

        if (videoId) fetchComments();
    }, [videoId]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        
        setSubmitLoading(true);
        try {
            const response = await addComment(videoId, newComment);
            const addedComment = response.data?.data || response.data;
            
            // Add the new comment to the top of the list
            setComments([addedComment, ...comments]);
            setNewComment("");
        } catch (error) {
            console.error("Failed to add comment", error);
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async (commentId) => {
        try {
            await deleteComment(commentId);
            setComments(comments.filter((c) => c._id !== commentId));
        } catch (error) {
            console.error("Failed to delete comment", error);
        }
    };

    if (loading) return <div className="mt-6 text-gray-400">Loading comments...</div>;

    return (
        <div className="mt-8">
            <h3 className="text-xl font-bold text-white mb-6">
                {comments.length} Comments
            </h3>

            {/* Add Comment Form */}
            {isAuthenticated ? (
                <form onSubmit={handleAddComment} className="flex gap-4 mb-8">
                    <img 
                        src={user?.avatar} 
                        alt="Your avatar" 
                        className="w-10 h-10 rounded-full object-cover bg-gray-800"
                    />
                    <div className="flex-1 flex flex-col items-end gap-2">
                        <Input
                            type="text"
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="bg-transparent border-b border-gray-600 rounded-none px-0 focus:border-white"
                        />
                        {newComment.trim() && (
                            <Button type="submit" isLoading={submitLoading} className="rounded-full px-4 py-1.5 text-sm">
                                Comment
                            </Button>
                        )}
                    </div>
                </form>
            ) : (
                <p className="text-gray-400 mb-8 pb-4 border-b border-gray-800">
                    Please sign in to leave a comment.
                </p>
            )}

            {/* Comments List */}
            <div className="flex flex-col gap-6">
                {comments.map((comment) => (
                    <div key={comment._id} className="flex gap-4 group">
                        <img 
                            src={comment.owner?.avatar} 
                            alt={comment.owner?.username} 
                            className="w-10 h-10 rounded-full object-cover bg-gray-800"
                        />
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-white text-sm">
                                    @{comment.owner?.username}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {formatTimeAgo(comment.createdAt)}
                                </span>
                            </div>
                            <p className="text-gray-200 text-sm mt-1 whitespace-pre-wrap">
                                {comment.content}
                            </p>
                        </div>
                        
                        {/* Delete Button (Only visible if the logged-in user owns the comment) */}
                        {user?._id === comment.owner?._id && (
                            <button 
                                onClick={() => handleDelete(comment._id)}
                                className="text-red-500 text-sm opacity-0 group-hover:opacity-100 transition-opacity self-start"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}