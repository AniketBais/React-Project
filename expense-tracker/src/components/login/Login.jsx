import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../auth/UserContext";

function Login() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

function hanldeLogin(e) {
  e.preventDefault();
  const savedUsers = JSON.parse(localStorage.getItem("users"));
  //safety check 
  const users = Array.isArray(savedUsers) ? savedUsers : [];

  const foundUser = users.find(
    (user) => user.name === name && user.password === password
  );

  if (!foundUser) {
    setError("Invalid username or password");
    return;
  }

  localStorage.setItem("user", JSON.stringify(foundUser));
  setUser(foundUser);

  navigate("/home");
}




  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
      {/* Left Container */}
      <div className="w-full md:w-3/5 min-h-[35vh] md:min-h-screen bg-linear-to-br from-emerald-500 via-teal-600 to-indigo-900 flex flex-col justify-center items-center px-6 py-10 md:p-8 text-center shadow-2xl z-10">
        <h1 className="text-2xl sm:text-3xl md:text-3xl font-light text-white tracking-wide leading-relaxed">
          Welcome to the <br />
          <span className="font-extrabold text-amber-300 text-3xl sm:text-4xl md:text-4xl block mt-2 drop-shadow-md">
            Manage Expenses
          </span>
          Application
        </h1>
      </div>

      {/* Right Container */}
      <div className="w-full md:w-2/5 flex-1 md:min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4 py-8 sm:p-6">
        <h2 className="mb-5 text-xl sm:text-2xl font-bold tracking-wide">
          WELCOME!
        </h2>

        <div className="bg-slate-950/60 border border-slate-800/80 p-5 sm:p-8 rounded-2xl shadow-xl flex flex-col justify-center items-center w-full max-w-sm">
          <form
            className="flex flex-col gap-y-4 w-full"
            onSubmit={hanldeLogin}
          >
            {/* Name Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Enter Name:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Your Name"
                className="bg-slate-900 text-white placeholder-slate-500 px-3 py-2.5 rounded-xl border border-slate-800 outline-none focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Password:
              </label>
              <input
                type="password"
                value={password}
                placeholder="********"
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-900 text-white placeholder-slate-500 px-3 py-2.5 rounded-xl border border-slate-800 outline-none focus:border-emerald-500 transition-all"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button className="w-full bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold py-2.5 rounded-xl transition-all duration-200">
              Login
            </button>
          </form>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-x-1.5 mt-6 text-sm text-center">
            <span className="text-slate-400">Don't have an account?</span>
            <Link
              to="/signUp"
              className="text-emerald-400 font-semibold hover:text-emerald-300 hover:underline transition-colors duration-150"
            >
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
