const EmptyState = ({ icon, title, description }) => {
    return (
        <div className="flex flex-col items-center justify-center text-center py-20 px-4">
            {icon && <div className="text-text-secondary mb-4">{icon}</div>}
            <h3 className="text-text-primary text-lg font-medium">{title}</h3>
            {description && (
                <p className="text-text-secondary text-sm mt-1 max-w-sm">
                    {description}
                </p>
            )}
        </div>
    );
};

export default EmptyState;
