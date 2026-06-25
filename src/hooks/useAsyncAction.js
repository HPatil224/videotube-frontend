import { useState } from "react";

// Wraps any async function (typically an axios call) and tracks
// loading / error state around it, so components don't have to
// repeat the same try/catch/setLoading boilerplate every time.
export const useAsyncAction = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const run = async (asyncFn) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await asyncFn();
            return result;
        } catch (err) {
            const message =
                err?.response?.data?.message || err?.message || "Something went wrong";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { run, isLoading, error, setError };
};
