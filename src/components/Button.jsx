const Button = ({
    children,
    type = "button",
    variant = "primary",
    isLoading = false,
    disabled = false,
    className = "",
    ...props
}) => {
    const base =
        "px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-brand hover:bg-brand-hover text-white",
        secondary:
            "bg-surface hover:bg-surface-hover text-text-primary border border-border",
        ghost: "hover:bg-surface-hover text-text-primary",
    };

    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            className={`${base} ${variants[variant]} ${className}`}
            {...props}
        >
            {isLoading ? "Please wait..." : children}
        </button>
    );
};

export default Button;
