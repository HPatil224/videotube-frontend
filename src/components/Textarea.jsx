const Textarea = ({ label, error, className = "", ...props }) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <label className="text-sm text-text-secondary">{label}</label>
            )}
            <textarea
                className={`w-full bg-surface border border-border rounded-md px-3 py-2 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-brand transition-colors resize-none ${className}`}
                {...props}
            />
            {error && <span className="text-sm text-brand">{error}</span>}
        </div>
    );
};

export default Textarea;
