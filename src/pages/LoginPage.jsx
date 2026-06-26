import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";

import { loginUser } from "../api/authApi.js";
import { setUser } from "../features/auth/authSlice.js";
import { useAsyncAction } from "../hooks/useAsyncAction.js";

import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";

const LoginPage = () => {
    // people can log in with either email or username - one shared field,
    // we decide which key to send based on whether it looks like an email
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");

    const { run, isLoading, error } = useAsyncAction();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!identifier.trim() || !password) {
            return;
        }

        const isEmail = identifier.includes("@");
        const payload = isEmail
            ? { email: identifier.trim(), password }
            : { username: identifier.trim(), password };

        try {
            const response = await run(() => loginUser(payload));

            dispatch(setUser(response.data.data.user));

            // if the user was redirected here from a protected page, send them
            // back to where they were trying to go; otherwise go home
            const redirectTo = location.state?.from || "/";
            navigate(redirectTo, { replace: true });
        } catch (err) {
            // run() already records the message in `error` for display
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm bg-surface border border-border rounded-lg p-6 flex flex-col gap-4"
            >
                <h1 className="text-xl font-semibold text-text-primary text-center">
                    Sign in to VideoTube
                </h1>

                <Input
                    label="Email or username"
                    type="text"
                    autoComplete="username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="you@example.com"
                />

                <Input
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                />

                {error && (
                    <p className="text-brand text-sm text-center">{error}</p>
                )}

                <Button type="submit" isLoading={isLoading} className="w-full">
                    Sign in
                </Button>

                <p className="text-text-secondary text-sm text-center">
                    New here?{" "}
                    <Link to="/register" className="text-brand hover:underline">
                        Create an account
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default LoginPage;
