import React from "react";
import bg from "../../Images/authbg.png";
import logo from '../../Images/Leco.png'
import LoginCard from '../../Images/logincard.png'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from 'axios'
import { ShieldUser } from 'lucide-react';
import {
    User,
    Mail,
    IdCard,
    Lock,
} from "lucide-react";


function Register() {

    const navigate = useNavigate()

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});

    const submitForm = async (e) => {

        e.preventDefault();

        setErrors({});

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`,
                { name, password, email, employeeId }
            )

            console.log("register response", response.data);

            navigate("/login");
        } catch (error) {
            setErrors(error.response.data.error)
        }
    }

    return (
        <div className="relative flex-1 max-h-screen pt-16  py-10 px-10 lg:px-20 w-full flex items-center justify-center bg-[#0b0f19] overflow-hidden">
            <div className="absolute inset-0 bg-black/60 z-10"></div>
            <img src={bg} alt="Background" className="absolute top-0 left-0 w-full h-full object-cover z-0 " />
            {/* Register Card */}
            <form
                onSubmit={submitForm}
                className="relative grid grid-cols-1 lg:grid-cols-10
                        max-w-4xl w-full overflow-hidden
                        rounded-[32px] z-20
                        bg-[#0B1020]/15
                        border border-purple-700/20
                        shadow-[0_0_80px_rgba(0,0,0,0.45)]"
            >

                {/* LEFT PANEL */}
                <div className="relative hidden lg:flex lg:col-span-4 overflow-hidden">

                    {/* Background Image */}
                    {/* <img
                        src={LoginCard}
                        alt="Register"
                        className="absolute inset-0 rounded-xl w-full h-full object-cover
                            opacity-75 blur-[1px] object-[40%]"
                    /> */}
                    <div className="absolute inset-0 bg-[#050816]/50" />

                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-fuchsia-500/10" />

                    {/* Content */}
                    <div
                        className="relative z-10 h-full w-full
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


                        {/* Text */}
                        <div className="mt-8 space-y-4">

                            <h2 className="text-4xl font-semibold text-white tracking-tight">
                                Create
                                <span className="text-violet-400 ml-2">
                                    Account
                                </span>
                            </h2>

                            <p className="text-md text-white/60 leading-7 max-w-[240px]">
                                Register to access workforce management,
                                attendance monitoring, and operational controls
                            </p>

                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div
                    className="relative flex flex-col justify-center
    lg:col-span-6 p-8 lg:p-12
    bg-[#1A1F35]/70 text-white overflow-hidden"
                >

                    {/* Purple Glow */}
                    <div
                        className="absolute top-1/2 right-[-120px]
      -translate-y-1/2 w-[280px] h-[280px] bg-violet-500/12 blur-3xl pointer-events-none"/>

                    {/* Subtle Border Highlight */}
                    <div className="absolute inset-0 border border-white/[0.04]  pointer-events-none" />

                    <div className="relative z-10">

                        {/* Heading */}
                        <h1 className="text-4xl font-semibold mb-8 tracking-tight">
                            Register
                        </h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {/* Name */}
                            <div className="relative md:col-span-2">
                                <label className="block mb-2 text-sm text-white/60">
                                    Name
                                </label>

                                <div className="relative">
                                    <User
                                        size={18}
                                        strokeWidth={2.5}
                                        className="absolute z-20 left-4 top-1/2
                                            -translate-y-1/2 text-violet-400"
                                    />
                                    <input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        type="text"
                                        className="w-full pl-12 py-3 px-4 rounded-xl
                                            bg-white/[0.06]
                                            border border-white/10
                                            text-white
                                            focus:outline-none
                                            focus:border-violet-400/40
                                            transition-all duration-300"
                                    />

                                </div>
                            </div>

                            {/* Email */}
                            <div className="md:col-span-2">
                                <label className="block mb-2 text-sm text-white/60">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail
                                        size={18}
                                        strokeWidth={2.5}
                                        className="absolute z-20 left-4 top-1/2
                                            -translate-y-1/2 text-violet-400"
                                    />
                                    <input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        type="email"
                                        className="w-full pl-12 py-3 px-4 rounded-xl
                                            bg-white/[0.06]
                                            border border-white/10
                                            text-white
                                            focus:outline-none
                                            focus:border-violet-400/40
                                            transition-all duration-300"
                                    />


                                    {errors.email && (
                                        <p className="text-red-400 text-sm mt-1">
                                            {errors.email}
                                        </p>
                                    )}

                                </div>


                            </div>

                            {/* Employee ID */}
                            <div className="md:col-span-2">
                                <label className="block mb-2 text-sm text-white/60">
                                    Employee ID
                                </label>
                                <div className="relative">
                                    <IdCard
                                        size={18}
                                        strokeWidth={2.5}
                                        className="absolute z-20 left-4 top-1/2
                                            -translate-y-1/2 text-violet-400"
                                    />
                                    <input
                                        value={employeeId}
                                        onChange={(e) => setEmployeeId(e.target.value)}
                                        type="text"
                                        className="w-full pl-12 py-3 px-4 rounded-xl
                                        bg-white/[0.06]
                                        border border-white/10
                                        text-white
                                        focus:outline-none
                                        focus:border-violet-400/40
                                        transition-all duration-300"
                                    />
                                    {errors.employeeId && (
                                        <p className="text-red-400 text-sm mt-1">
                                            {errors.employeeId}
                                        </p>
                                    )}
                                </div>

                            </div>

                            {/* Password */}
                            <div>
                                <label className="block mb-2 text-sm text-white/60">
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
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        type="password"
                                        className="w-full pl-12 py-3 px-4 rounded-xl
                                        bg-white/[0.06]
                                        border border-white/10
                                        text-white
                                        focus:outline-none
                                        focus:border-violet-400/40
                                        transition-all duration-300"
                                    />
                                </div>

                            </div>

                            {/* Confirm Password */}
                            <div className="">
                                <label className="block mb-2 text-sm text-white/60">
                                    Confirm Password
                                </label>

                                <div className="relative">
                                    <Lock
                                        size={18}
                                        strokeWidth={2.5}
                                        className="absolute z-20 left-4 top-1/2
                                            -translate-y-1/2 text-violet-400"
                                    />
                                    <input
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        type="password"
                                        className="w-full pl-12 py-3 px-4 rounded-xl
                                        bg-white/[0.06]
                                        border border-white/10
                                        text-white
                                        focus:outline-none
                                        focus:border-violet-400/40
                                        transition-all duration-300"
                                    />
                                </div>

                            </div>

                        </div>

                        {/* Button */}
                        <button
                            className="w-full mt-8 py-3 rounded-xl
       bg-violet-500
        hover:scale-[1.01]
        transition-all duration-300
        shadow-[0_0_25px_rgba(139,92,246,0.25)]
        cursor-pointer"
                            type="submit"
                        >
                            CREATE ACCOUNT
                        </button>

                    </div>

                    <div className="flex space-x-2 mt-6">
                        <p className="text-sm text-white/60 mb-2">
                            Already have an account ? Click here to
                        </p>

                        <Link to="/login" className="text-sm underline text-violet-400 hover:underline">
                            Login
                        </Link>
                    </div>

                </div>
            </form>

        </div>
    );
}

export default Register;