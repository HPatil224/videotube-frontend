import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../api/authApi";
import Input from "../components/Input";
import Button from "../components/Button";

export default function ResetPasswordPage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);
        try {
            await resetPassword(token, newPassword);
            setMessage("Password reset successfully! You can now log in.");
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Invalid or expired token");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
            <div className="w-full max-w-md bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Enter New Password</h2>

                {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}
                {message && <div className="bg-green-500/10 border border-green-500 text-green-500 p-3 rounded mb-4 text-sm">{message}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        label="New Password"
                        type="password"
                        placeholder="Enter your new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <Button type="submit" isLoading={loading} className="w-full">
                        Reset Password
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                    <Link to="/login" className="text-blue-500 hover:text-blue-400">Back to Login</Link>
                </div>
            </div>
        </div>
    );
}