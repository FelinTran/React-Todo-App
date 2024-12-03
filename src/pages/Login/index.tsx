// Login.tsx
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLoading } from "../../context/LoadingContext";

interface LoginFormInputs {
    username: string;
    password: string;
}

const Login = () => {
    const { login } = useAuth();
    const { setIsLoading } = useLoading();
    const navigate = useNavigate();


    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

    const onSubmit = async (data: LoginFormInputs) => {
        try {
            setIsLoading(true); // Start loading
            const response = await axios.post("http://localhost:8080/api/auth/login", data); // Replace with your API endpoint
            console.log(response.data);
            const { accessToken } = response.data;

            if (accessToken) {
                login(); // Update the auth state
                navigate("/"); // Navigate to the main app
            }
        } catch (error) {
            console.error("Login failed:", error);
            alert("Invalid username or password");
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    return (
        <div className={
            "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 " +
            "bg-white rounded-lg shadow-md z-40 flex flex-col items-center gap-3 px-5 py-6"
        }>
            <h4>Login</h4>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Username</label>
                    <input
                        {...register("username", { required: true })}
                        placeholder="Enter your username"
                        className="w-full h-12 px-3 outline-none rounded-md bg-slate-100 border border-slate-300 text-sm font-medium"
                    />
                    {errors.username && <p>{errors.username.message}</p>}
                </div>
                <div>
                    <label>Password</label>
                    <input
                        {...register("password", { required: true })}
                        type="password"
                        placeholder="Enter your password"
                        className="w-full h-12 px-3 outline-none rounded-md bg-slate-100 border border-slate-300 text-sm font-medium"
                    />
                    {errors.password && <p>{errors.password.message}</p>}
                </div>
                <button type="submit" className="w-full mt-3 rounded-md h-9 bg-black text-blue-50 font-medium">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
