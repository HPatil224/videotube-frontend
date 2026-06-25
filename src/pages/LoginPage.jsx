import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { setUser } from "../features/auth/authSlice";
import Input from "../components/Input";
import Button from "../components/Button";

export default function LoginPage() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const isEmail = identifier.includes("@");
            const payload = isEmail 
                ? { email: identifier, password } 
                : { username: identifier, password };

            // Wait for the API call to finish
            const response = await loginUser(payload);
            
            // ✅ Fixed: Properly extracting the nested user data from the ApiResponse
            dispatch(setUser(response.data.user)); 
            
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
            <div className="w-full max-w-md bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700">
                <div className="flex justify-center mb-6">
                    <span className="text-3xl font-bold text-white">
                        Video<span className="text-red-500">Tube</span>
                    </span>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Sign in</h2>

                {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        label="Email or Username"
                        type="text"
                        placeholder="Enter your email or username"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        required
                    />
                    
                    <div>
                        <Input
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div className="flex justify-end mt-1 mb-2">
                            <Link to="/forgot-password" className="text-sm text-blue-500 hover:text-blue-400 transition-colors">
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    <Button type="submit" isLoading={loading} className="w-full mt-2">
                        Sign In
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                    Don't have an account? <Link to="/register" className="text-blue-500 hover:text-blue-400">Sign up</Link>
                </div>
            </div>
        </div>
    );
}