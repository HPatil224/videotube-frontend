const VideoCardSkeleton = () => {
    return (
        <div className="flex flex-col gap-2 animate-pulse">
            <div className="w-full aspect-video rounded-xl bg-surface" />
            <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-surface shrink-0" />
                <div className="flex flex-col gap-2 flex-1 mt-1">
                    <div className="h-3.5 bg-surface rounded w-full" />
                    <div className="h-3 bg-surface rounded w-2/3" />
                    <div className="h-3 bg-surface rounded w-1/2" />
                </div>
            </div>
        </div>
    );
};

export default VideoCardSkeleton;
