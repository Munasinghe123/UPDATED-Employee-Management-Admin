import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import { Pencil, Eye, EyeOff } from 'lucide-react'
import userImage from '../../Images/userImage.jpg'

function Settings() {

  const { user } = useContext(AuthContext)

  const [open, setOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [form, setForm] = useState({
    name: user?.name || "",
    userName: user?.userName || "",
    password: "",
  })

  const handleUpdate = async () => {
    try {

      const payload = { ...form }

      //  don’t send empty password
      if (!payload.password) {
        delete payload.password
      }

      await axios.put(
        `${import.meta.env.VITE_API_URL}/users/${user.employeeId}`,
        payload,
        { withCredentials: true }
      )

      setOpen(false)
      alert("Updated successfully ")

    } catch (err) {
      console.error("UPDATE ERROR:", err.response?.data || err.message)
    }
  }

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <h1 className="text-2xl font-semibold text-white">Settings</h1>

      {/* CARD */}
      <div className="bg-[#0D1422] p-6 rounded-2xl border border-[#1A2B3C] shadow-xl w-[400px] grid grid-cols-2">

        <div className="space-y-3 text-sm">

          <div>
            <p className="text-gray-400">Employee ID</p>
            <p className="text-white font-medium">{user.employeeId}</p>
          </div>

          <div>
            <p className="text-gray-400">Name</p>
            <p className="text-white font-medium">{user.name}</p>
          </div>

          <div>
            <p className="text-gray-400">Role</p>
            <p className="text-purple-400 font-medium">{user.role}</p>
          </div>

        </div>

        <div className=''>
          <img src={userImage} className='h-full w-full'/>
        </div>


        {/* <button
          onClick={() => setOpen(true)}
          className="mt-5 flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm transition"
        >
          <Pencil size={16} />
          Edit Profile
        </button> */}

      </div>

      {/* MODAL */}
      {/* {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-[#0D1422] p-6 rounded-2xl w-[400px] border border-[#1A2B3C] shadow-xl animate-fadeIn">

            <h3 className="text-lg font-semibold text-white mb-4">
              Update Profile
            </h3>

            <div className="space-y-3">

              <input
                value={user.employeeId}
                disabled
                className="w-full bg-[#1e1e2f] px-3 py-2 rounded opacity-60"
              />

              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Name"
                className="w-full bg-[#1e1e2f] px-3 py-2 rounded"
              />

              <input
                value={form.userName}
                onChange={(e) => setForm({ ...form, userName: e.target.value })}
                placeholder="Username"
                className="w-full bg-[#1e1e2f] px-3 py-2 rounded"
              />

            
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-[#1e1e2f] px-3 py-2 pr-10 rounded"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

            </div>

          
            <div className="flex justify-end gap-3 mt-5">

              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                Update
              </button>

            </div>

          </div>
        </div>
      )} */}

    </div>
  )
}

export default Settings