import { useRef, useState } from "react";
import { FiFile } from "react-icons/fi";

const FileInput = ({
    label,
    onChange,
    required = false,
    shape = "square",
    accept = "image/*",
    showPreviewImage = true,
}) => {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [fileName, setFileName] = useState(null);

    const handleChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);

        // only create an image preview for image files - a video file
        // would just show a giant unplayable blob preview otherwise
        if (showPreviewImage && file.type.startsWith("image/")) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }

        onChange(file);
    };

    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <label className="text-sm text-text-secondary">
                    {label}
                    {required && <span className="text-brand"> *</span>}
                </label>
            )}

            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className={`relative overflow-hidden border border-dashed border-border bg-surface hover:bg-surface-hover transition-colors flex flex-col items-center justify-center gap-1 text-text-secondary text-sm px-2 text-center ${
                    shape === "round"
                        ? "w-20 h-20 rounded-full"
                        : "w-full h-28 rounded-md"
                }`}
            >
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt="preview"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : fileName ? (
                    <>
                        <FiFile size={20} />
                        <span className="truncate max-w-full">{fileName}</span>
                    </>
                ) : (
                    <span>Click to upload</span>
                )}
            </button>

            <input
                ref={inputRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={handleChange}
                required={required}
            />
        </div>
    );
};

export default FileInput;
