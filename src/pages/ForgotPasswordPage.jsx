import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/authApi";
import Input from "../components/Input";
import Button from "../components/Button";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);
        try {
            const response = await forgotPassword(email);
            setMessage(response.message || "Password reset link has been sent!");
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
            <div className="w-full max-w-md bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-2 text-center">Reset Password</h2>
                <p className="text-gray-400 text-sm text-center mb-6">
                    Enter your email and we'll send you a link to reset your password.
                </p>

                {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}
                {message && <div className="bg-green-500/10 border border-green-500 text-green-500 p-3 rounded mb-4 text-sm">{message}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        label="Email"
                        type="email"
                        placeholder="Enter your registered email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Button type="submit" isLoading={loading} className="w-full">
                        Send Reset Link
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                    Remember your password? <Link to="/login" className="text-blue-500 hover:text-blue-400">Sign in</Link>
                </div>
            </div>
        </div>
    );
}