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

  return (
    <div className="bg-primary flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="border-default bg-card rounded-2xl border p-8 shadow-lg">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-primary text-2xl font-semibold">{authState}</h1>
            <button
              onClick={toggleAuthState}
              className="text-secondary hover:bg-tertiary hover:text-primary rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            >
              {authState === "Log in" ? "Sign up" : "Log in"}
            </button>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label
                  htmlFor="name"
                  className="text-secondary mb-1.5 block text-sm font-medium"
                >
                  Namn
                </label>
                <input
                  className="input-base"
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
                className="text-secondary mb-1.5 block text-sm font-medium"
              >
                E-post
              </label>
              <input
                className="input-base"
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
                className="text-secondary mb-1.5 block text-sm font-medium"
              >
                Lösenord
              </label>
              <input
                className="input-base"
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
              <p className="bg-error text-error rounded-lg px-4 py-3 text-sm">
                {error}
              </p>
            )}

            <button type="submit" className="btn-primary mt-2">
              {authState}
            </button>
          </form>
        </div>

        <p className="text-muted mt-6 text-center text-sm">
          Kanban app made by Dennis
        </p>
      </div>
    </div>
  );
};

export default Auth;
