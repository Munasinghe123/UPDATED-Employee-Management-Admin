import React from "react"
import { Link } from 'react-router-dom'
import laptop from '../../Images/lap.png'
import phone from '../../Images/phone.png'
import card from '../../Images/card.png'
import { useEffect } from "react"
import gsap from "gsap"
import bg from '../../Images/bg.png'
import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import { Lock, UserPlus } from "lucide-react"


function LandingPage() {

  const { user } = useContext(AuthContext)


  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-black/60 z-10"></div>

      <img src={bg} alt="Background" className="absolute top-0 left-0 w-full h-full object-cover z-0 " />

      <div className="grid grid-cols-1 lg:grid-cols-[50%_50%] z-20 pt-14 items-center w-full px-20">

        {/* LEFT SIDE */}
        <div className="relative h-full  flex items-center justify-start ">
          <div className="absolute -left-30 -bottom-10 z-0">

          </div>

          <div className="absolute space-y-14 w-[800px] left-0  z-30">

            <h1
              style={{ fontFamily: "'Inter', sans-serif" }}
              className=" text-5xl lg:text-[80px] font-bold leading-[1.2] tracking-tight">
              <span className="text-[#7C3AED] block">
                Admin Portal
              </span>

              <span className="text-white block">
                For Workforce <br /> Management
              </span>
            </h1>

            <div>
              <div className="bg-[#7C3AED] w-20 h-0.5 rounded-2xl"></div>

              <div>
                <p className="text-gray-200 mt-2 text-lg max-w-md">
                  Seamlessly track attendance, manage shifts, monitor your workforce, and oversee primary substations, all in one powerful platform
                </p>
              </div>
            </div>

            {
              user ? (
                <div className="absolute left-0 -bottom-5">
                  <Link
                    to="/dashboard/attendance"
                    className="px-8 py-3 bg-[#7C3AED] cursor-pointer
                                rounded-xl font-semibold text-white shadow-lg 
                                hover:shadow-[#7C3AED]/40
                                flex items-center overflow-hidden">
                    Dashboard
                  </Link>
                </div>
              ) :
                (
                  <div className="flex gap-5">

                    {/* Login */}
                    <Link
                      to="/login"
                      className="
                          px-6 py-3 bg-[#7C3AED]
                          rounded-xl
                          font-bold
                          text-white
                          shadow-lg shadow-purple-900/30
                          border border-purple-400/20
                          hover:scale-105
                          transition-all duration-300
                          flex items-center gap-2
                        "
                    >
                      <Lock size={18} strokeWidth={2.5} />
                      LOGIN
                    </Link>

                    {/* Register */}
                    <Link
                      to="/register"
                      className="
                          px-6 py-3
                          bg-white/10
                          backdrop-blur-md
                          border border-white/20
                          rounded-xl
                          font-bold
                          text-white
                          hover:bg-white/20
                          hover:scale-105
                          transition-all duration-300
                          flex items-center gap-2
                        "
                    >
                      <UserPlus size={18} strokeWidth={2.5} />
                      REGISTER
                    </Link>

                  </div>
                )
            }




          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="relative w-[700px] h-[700px] flex justify-end items-center translate-x-10">
          <div className="absolute -right-40 top-20 z-0">
            <svg
              className="w-[900px] h-[450px] opacity-20"
              viewBox="0 0 654 401"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 356.747L44.0983 0H654L612.144 401L0 356.747Z"
                fill="#C165EF"
              />
            </svg>
          </div>

          <img
            src={laptop}
            className="absolute scale-125 right-10 "
          />

          <img
            src={phone}
            className="absolute -left-30 bottom-52 h-80"
            style={{
              transform: `
                perspective(1400px)
                translateZ(300px)
              `,
              filter: "drop-shadow(0 40px 35px rgba(0,0,0,0.45))"
            }}
          />
          <img
            src={card}
            className="absolute right-12 h-60 w-96 bottom-5"

          />
        </div>



      </div>
    </section>
  )
}

export default LandingPage