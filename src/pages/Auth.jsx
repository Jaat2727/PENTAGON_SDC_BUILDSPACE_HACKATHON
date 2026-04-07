/*
  Auth.jsx
  --------
  Login + Signup page. Toggles between the two forms.
  Also has a GitHub OAuth button. On success, redirects to /feed.
*/

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser } from "react-icons/hi";
import { FaGithub } from "react-icons/fa";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function Auth() {
  const navigate  = useNavigate();
  const { signUp, signIn, signInWithGitHub, loading, error, setError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]         = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    let ok;
    if (isLogin) {
      ok = await signIn({ email, password });
    } else {
      ok = await signUp({ email, password, displayName: name });
    }

    if (ok) navigate("/feed");
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-heading dark:text-white">
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-body dark:text-slate-400 mt-2">
            {isLogin
              ? "Log in to pick up where you left off."
              : "Join BuildSpace and start collaborating."}
          </p>
        </div>

        {/* form card */}
        <div className="rounded-2xl border border-border dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
          {/* GitHub OAuth */}
          <button
            onClick={signInWithGitHub}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-border dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-sm font-medium text-heading dark:text-white hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors cursor-pointer"
          >
            <FaGithub className="w-5 h-5" />
            Continue with GitHub
          </button>

          {/* divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border dark:bg-slate-700" />
            <span className="text-xs text-muted uppercase tracking-wide">or</span>
            <div className="flex-1 h-px bg-border dark:bg-slate-700" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* show name field only for sign-up */}
            {!isLogin && (
              <Input
                label="Display Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            )}

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            {error && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Please wait…" : isLogin ? "Log In" : "Create Account"}
            </Button>
          </form>

          {/* toggle between login and signup */}
          <p className="text-center text-sm text-muted mt-5">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(null); }}
              className="text-brand-600 dark:text-brand-400 font-medium hover:underline cursor-pointer"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
