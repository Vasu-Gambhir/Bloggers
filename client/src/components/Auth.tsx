import { Link } from "react-router-dom";
import Input from "./Input";
import { useState, type ChangeEvent } from "react";
import type { SignupInput, SigninInput } from "@vasu248/blog-app-commons";
import axios from "axios";
import { base_url } from "../config";
import { toast } from "react-toastify";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const defaultsignupData = {
  email: "",
  name: "",
  password: "",
};

const defaultsigninData = {
  email: "",
  password: "",
};

const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const [authData, setAuthData] = useState<SignupInput | SigninInput>(
    type === "signup" ? defaultsignupData : defaultsigninData
  );
  const [loading, setLoading] = useState(false);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAuthData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!authData.email || !authData.password) {
        toast.warn("Please fill all the fields");
        return;
      }
      if (type === "signup") {
        if (!(authData as SignupInput).name) {
          toast.warn("Please fill all the fields");
          return;
        }
        if (authData.password.length < 6) {
          toast.warn("Password should be atleast 6 characters long");
          return;
        }
      }

      const response = await axios.post(
        `${base_url}/users/${type === "signup" ? "signup" : "signin"}`,
        authData
      );

      if (type === "signup") {
        if (response.status === 411) {
          toast.error(`Error in signing up! Invalid Inputs`);
          return;
        }
        if (response.status === 403) {
          toast.error(
            `Error in signing up! User Already Exists with this email`
          );
          return;
        }
        if (response.status === 401) {
          toast.error(`Error in signing up!`);
          return;
        }
      } else if (type === "signin") {
        if (response.status === 411) {
          toast.error(`Error in signing in! Invalid Inputs`);
          return;
        }
        if (response.status === 401) {
          toast.error(`Error in signing in! User with this email not found`);
          return;
        }
        if (response.status === 401) {
          toast.error(`Error in signing in! `);
          return;
        }
      }

      if (response.status !== 200) {
        toast.error(
          `Error in ${type === "signup" ? "signing up" : "loging in"}`
        );
        return;
      }

      login(response.data.token, response.data.user);
      toast.success(
        `${
          type === "signup"
            ? "User created successfully"
            : "Logged In successfully"
        }`
      );
      navigate("/blogs");
    } catch (error) {
      console.log(error);
      toast.error(`Error in ${type === "signup" ? "signup" : "signin"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md shadow-md rounded-2xl p-8 sm:p-10">
      <div className="self-center text-center mb-6">
        <div className="text-3xl font-extrabold">
          {type === "signup" ? "Create an account" : "Login account"}
        </div>
        <div className="text-slate-400">
          {type === "signup"
            ? "Already have an account?"
            : "Don't have an account"}
          <Link
            className="pl-2 underline"
            to={type === "signup" ? "/signin" : "/signup"}
          >
            {type === "signup" ? "Login" : "Signup"}
          </Link>
        </div>
      </div>
      <div>
        {type === "signup" && (
          <Input
            type="text"
            name="name"
            value={(authData as SignupInput).name}
            placeholder="John Doe..."
            label="Username"
            onChange={handleChange}
            disabled={loading}
          />
        )}
        <Input
          type="email"
          name="email"
          value={authData.email}
          placeholder="Johndoe999@hmail.com"
          label="Email"
          onChange={handleChange}
          disabled={loading}
        />
        <Input
          type="password"
          name="password"
          value={authData.password}
          placeholder="yoursecretpassword123"
          label="Password"
          onChange={handleChange}
          disabled={loading}
        />
      </div>
      <button
        type="button"
        disabled={loading} // <-- disable button
        className={`w-full mt-6 text-white bg-gray-800 hover:cursor-pointer hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-md text-sm px-5 py-2.5 me-2 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleSubmit}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
            Processing...
          </div>
        ) : type === "signup" ? (
          "Sign Up"
        ) : (
          "Sign In"
        )}
      </button>
    </div>
  );
};

export default Auth;
