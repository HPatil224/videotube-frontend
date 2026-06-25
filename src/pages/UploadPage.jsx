import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { publishVideo } from "../api/videoApi.js";
import { useAsyncAction } from "../hooks/useAsyncAction.js";

import Input from "../components/Input.jsx";
import Textarea from "../components/Textarea.jsx";
import Button from "../components/Button.jsx";
import FileInput from "../components/FileInput.jsx";

const UploadPage = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [formError, setFormError] = useState("");

    const { run, isLoading, error } = useAsyncAction();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!title.trim() || !description.trim()) {
            setFormError("Title and description are required");
            return;
        }
        if (!videoFile) {
            setFormError("A video file is required");
            return;
        }
        if (!thumbnailFile) {
            setFormError("A thumbnail image is required");
            return;
        }

        const formData = new FormData();
        formData.append("title", title.trim());
        formData.append("description", description.trim());
        formData.append("videoFile", videoFile);
        formData.append("thumbnail", thumbnailFile);

        const response = await run(() => publishVideo(formData));

        const newVideoId = response.data.data._id;
        navigate(`/watch/${newVideoId}`, { replace: true });
    };

    return (
        <div className="p-4 sm:p-6 max-w-2xl mx-auto">
            <h1 className="text-xl font-semibold text-text-primary mb-4">
                Upload a video
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <FileInput
                    label="Video file"
                    required
                    accept="video/*"
                    showPreviewImage={false}
                    onChange={setVideoFile}
                />

                <FileInput
                    label="Thumbnail"
                    required
                    accept="image/*"
                    onChange={setThumbnailFile}
                />

                <Input
                    label="Title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Give your video a title"
                />

                <Textarea
                    label="Description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell viewers about your video"
                />

                {(formError || error) && (
                    <p className="text-brand text-sm text-center">
                        {formError || error}
                    </p>
                )}

                <Button type="submit" isLoading={isLoading} className="w-full">
                    {isLoading ? "Uploading..." : "Publish"}
                </Button>

                {isLoading && (
                    <p className="text-text-secondary text-xs text-center">
                        Larger video files can take a little while to upload — please
                        don't close this tab.
                    </p>
                )}
            </form>
        </div>
    );
};

export default UploadPage;
