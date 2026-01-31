import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Auth: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [authState, setAuthState] = useState<"Log in" | "Sign up">("Log in");
  const [name, setName] = useState<string>("");
  const endpoint = isLogin ? "login" : "signup";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      await axios.post(
        `http://localhost:3000/api/${endpoint}`,
        isLogin ? { email, password } : { name, email, password },
        isLogin ? { withCredentials: true } : {},
      );

      if (isLogin) {
        sessionStorage.setItem("isLoggedIn", "true");
        navigate("/kanban");
      } else {
        setAuthState("Log in");
        setIsLogin(true);
        setName("");
      }
    } catch {
      sessionStorage.removeItem("isLoggedIn");
      setError(
        `${authState} failed. Please check your credentials and try again.`,
      );
    }
  };

  const toggleAuthState = () => {
    setError(null);
    if (authState === "Log in") {
      setIsLogin(false);
      setAuthState("Sign up");
    } else {
      setIsLogin(true);
      setAuthState("Log in");
    }
  };

  const inputBase =
    "w-full h-12 px-4 rounded-lg border-2 bg-transparent outline-none transition-colors placeholder:text-slate-400 " +
    "border-slate-200 focus:border-slate-400 dark:border-slate-600 dark:focus:border-slate-400 " +
    "text-slate-900 dark:text-slate-100";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4 dark:bg-slate-950">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
              {authState}
            </h1>
            <button
              onClick={toggleAuthState}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            >
              {authState === "Log in" ? "Sign up" : "Log in"}
            </button>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-400"
                >
                  Namn
                </label>
                <input
                  className={inputBase}
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Ditt namn"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-400"
              >
                E-post
              </label>
              <input
                className={inputBase}
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="din@epost.se"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-400"
              >
                Lösenord
              </label>
              <input
                className={inputBase}
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="mt-2 h-12 w-full cursor-pointer rounded-lg border-2 border-slate-800 bg-slate-800 font-medium text-white transition-colors hover:border-slate-700 hover:bg-slate-700 dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900 dark:hover:border-slate-200 dark:hover:bg-slate-200"
            >
              {authState}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Kanban app made by Dennis
        </p>
      </div>
    </div>
  );
};

export default Auth;
