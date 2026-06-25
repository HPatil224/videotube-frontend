import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import { registerUser, loginUser } from "../api/authApi.js";
import { setUser } from "../features/auth/authSlice.js";
import { useAsyncAction } from "../hooks/useAsyncAction.js";

import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import FileInput from "../components/FileInput.jsx";

const RegisterPage = () => {
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const [coverImageFile, setCoverImageFile] = useState(null);
    const [formError, setFormError] = useState("");

    const { run, isLoading, error } = useAsyncAction();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!fullname.trim() || !email.trim() || !username.trim() || !password) {
            setFormError("All fields are required");
            return;
        }

        if (!avatarFile) {
            setFormError("Avatar image is required");
            return;
        }

        // backend expects multipart/form-data, not JSON, since files are involved
        const formData = new FormData();
        formData.append("fullname", fullname.trim());
        formData.append("email", email.trim());
        formData.append("username", username.trim());
        formData.append("password", password);
        formData.append("avatar", avatarFile);
        if (coverImageFile) {
            formData.append("coverImage", coverImageFile);
        }

        await run(() => registerUser(formData));

        // registration doesn't log the user in automatically on the backend,
        // so we immediately log in with the same credentials right after
        const loginResponse = await run(() =>
            loginUser({ email: email.trim(), password })
        );

        dispatch(setUser(loginResponse.data.data.user));
        navigate("/", { replace: true });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base px-4 py-10">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-surface border border-border rounded-lg p-6 flex flex-col gap-4"
            >
                <h1 className="text-xl font-semibold text-text-primary text-center">
                    Create your VideoTube account
                </h1>

                <div className="flex items-center gap-4">
                    <FileInput
                        label="Avatar"
                        required
                        shape="round"
                        onChange={setAvatarFile}
                    />
                    <FileInput
                        label="Cover image (optional)"
                        onChange={setCoverImageFile}
                    />
                </div>

                <Input
                    label="Full name"
                    type="text"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    placeholder="John Doe"
                />

                <Input
                    label="Email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                />

                <Input
                    label="Username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="johndoe"
                />

                <Input
                    label="Password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                />

                {(formError || error) && (
                    <p className="text-brand text-sm text-center">
                        {formError || error}
                    </p>
                )}

                <Button type="submit" isLoading={isLoading} className="w-full">
                    Create account
                </Button>

                <p className="text-text-secondary text-sm text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-brand hover:underline">
                        Sign in
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;
