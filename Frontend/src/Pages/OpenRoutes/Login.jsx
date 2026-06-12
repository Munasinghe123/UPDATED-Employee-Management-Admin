import React from "react";
import bg from "../../Images/authbg.png";
import logo from '../../Images/Leco.png'
import LoginCard from '../../Images/logincard.png'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from 'axios'
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { jwtDecode } from 'jwt-decode';
import { Lock, User } from "lucide-react"
import { ShieldUser } from 'lucide-react';

function Login() {

  const { login } = useContext(AuthContext);

  const navigate = useNavigate();
  const [employeeId, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError] = useState("")

  const loginUser = async (e) => {

    try {
      // Swapped out localhost for the environment variable config
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`, 
        { employeeId, password }, 
        { withCredentials: true }
      );
      console.log(response.data.accessToken);
      login(response.data.accessToken);

      const decode = jwtDecode(response.data.accessToken)

      if (decode.role === 'admin') {
        navigate('/dashboard');
      }

    } catch (error) {
      console.log(error.response.data.message);
      setError(error.response.data.message);
    }

  }

  return (
    <div className="relative overflow-hidden flex-1 flex w-full pt-28 px-10 md:px-20 lg:px-20 py-10  items-center justify-center bg-[#0b0f19]">
      <div className="absolute inset-0 bg-black/60 z-10"></div>
      <img src={bg} alt="Background" className="absolute top-0 left-0 w-full h-full object-cover z-0 " />

      {/* Glass Card */}
      <div
        className="relative grid grid-cols-10 z-20 max-w-3xl w-full
  rounded-3xl overflow-hidden
  bg-[#1A1F35]/70
  border border-purple-700/20
  shadow-[0_0_80px_rgba(0,0,0,0.45)]"
      >

        {/* LEFT PANEL */}
        <div className="relative col-span-4 overflow-hidden">

          {/* Overlay */}
          <div className="absolute inset-0 bg-[#050816]/50" />

          {/* Purple Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-fuchsia-500/10" />

          <div
            className="relative z-10 h-full
      flex flex-col items-center justify-center
      px-8 py-12 text-center"
          >

            <div
              className="w-20 h-20 rounded-full
  bg-white/[0.04]
  border border-white/10
  backdrop-blur-xl
  flex items-center justify-center
  shadow-[0_0_50px_rgba(139,92,246,0.15)]"
            >
              <ShieldUser
                size={38}
                strokeWidth={2}
                className="text-violet-300"
              />
            </div>

            <div className="mt-8 space-y-4">
              <h2 className="text-3xl font-semibold text-white tracking-tight">
                Welcome
                <span className="text-violet-400 ml-2">
                  Admin
                </span>
              </h2>

              <p className="text-sm text-white/60 leading-7 max-w-[240px]">
                Sign in to access workforce management,
                attendance monitoring, and operational controls
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div
          className="relative flex flex-col col-span-6 justify-center
          pl-12 py-12 pr-12 
    bg-[#111827]/80 text-white"
        >
          <div className="absolute top-1/2 right-[-120px]  -translate-y-1/2 
            w-[500px] h-[500px] rounded-full 
            bg-violet-500/12 blur-3xl pointer-events-none" />

          <h1 className="text-4xl  font-semibold mb-8 tracking-tight">
            Login
          </h1>

          <div className="flex flex-col gap-6 w-full max-w-md">

            <div>
              <label className="block mb-2 text-sm text-white/60">
                Employee ID
              </label>

              <div className="relative">
                <User
                  size={18}
                  strokeWidth={2.5}
                  className="absolute z-20 left-4 top-1/2
            -translate-y-1/2 text-violet-400"
                />

                <input
                  type="text"
                  onChange={(e) => setId(e.target.value)}
                  className="w-full py-3 pl-12 rounded-xl
            bg-white/[0.04]
            border border-white/10
            text-white
            placeholder:text-white/30
            focus:outline-none
            focus:border-violet-400/40
            transition-all duration-300"
                />
                {error && (
                  <p className="text-red-400 text-sm mt-1">{error}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  strokeWidth={2.5}
                  className="absolute z-20 left-4 top-1/2
            -translate-y-1/2 text-violet-400"
                />

                <input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-3 pl-12 rounded-xl
            bg-white/[0.04]
            border border-white/10
            text-white
            placeholder:text-white/30
            focus:outline-none
            focus:border-violet-400/40
            transition-all duration-300"
                />
              </div>
            </div>

            <button
              className="mt-2 py-3 rounded-xl
        bg-violet-500 font-bold
        hover:scale-[1.02]
        transition-all duration-300
        shadow-[0_0_25px_rgba(139,92,246,0.25)]
        cursor-pointer"
              onClick={() => loginUser(employeeId, password)}
            >
              LOGIN
            </button>

            <div className="flex space-x-2">
              <p className="text-sm text-white/60 mb-2">
                Don't have an account ? Click here to
              </p>

              <Link to="/register" className="text-sm underline text-violet-400 hover:underline">
                Register
              </Link>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}

export default Login;