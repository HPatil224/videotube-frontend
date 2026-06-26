import { useState } from "react";
import { useSelector } from "react-redux";
import { FiMoreVertical } from "react-icons/fi";

import { updateComment, deleteComment } from "../api/commentApi.js";
import { formatTimeAgo } from "../utils/format.js";
import Button from "./Button.jsx";

const CommentItem = ({ comment, onUpdated, onDeleted }) => {
    const { user } = useSelector((state) => state.auth);
    const isOwner = user?._id === comment.owner?._id;

    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(comment.content);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!content.trim()) return;
        setIsSaving(true);
        try {
            const response = await updateComment(comment._id, content.trim());
            onUpdated(response.data.data);
            setIsEditing(false);
        } catch (err) {
            // silently keep editing open on failure - the input still has their text
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteComment(comment._id);
            onDeleted(comment._id);
        } catch (err) {
            // leave the comment in place if delete failed
        }
    };

    return (
        <div className="flex gap-3 py-3">
            {comment.owner?.avatar && (
                <img
                    src={comment.owner.avatar}
                    alt={comment.owner.username}
                    className="w-9 h-9 rounded-full object-cover shrink-0"
                />
            )}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-text-primary text-sm font-medium">
                        {comment.owner?.username}
                    </span>
                    <span className="text-text-secondary text-xs">
                        {formatTimeAgo(comment.createdAt)}
                    </span>
                </div>

                {isEditing ? (
                    <div className="flex flex-col gap-2 mt-1">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={2}
                            className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-brand resize-none"
                        />
                        <div className="flex gap-2">
                            <Button
                                variant="primary"
                                isLoading={isSaving}
                                onClick={handleSave}
                            >
                                Save
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setIsEditing(false);
                                    setContent(comment.content);
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <p className="text-text-primary text-sm mt-1">{comment.content}</p>
                )}
            </div>

            {isOwner && !isEditing && (
                <div className="relative shrink-0">
                    <button
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="p-1.5 rounded-full hover:bg-surface-hover text-text-secondary"
                        aria-label="Comment options"
                    >
                        <FiMoreVertical size={16} />
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 top-8 bg-surface border border-border rounded-md shadow-lg z-10 w-28 overflow-hidden">
                            <button
                                onClick={() => {
                                    setIsEditing(true);
                                    setMenuOpen(false);
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-surface-hover"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    handleDelete();
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-brand hover:bg-surface-hover"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CommentItem;
