import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Eye, EyeOff, UserX } from "lucide-react";
import { ChevronDown, Search } from 'lucide-react';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [disableModal, setDisableModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [updateModal, setUpdateModal] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [substations, setSubstations] = useState([]);
  const [viewEmployee, setViewEmployee] = useState(false);
  const [clickedEmployee, setClickedEmployee] = useState(null);
  const [clickedEmployeeDetails, setClickedEmployeeDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    employeeId: "",
    name: "",
    userName: "",
    password: "",
    role: "SBO",
    substationId: ""
  });

  const [editingId, setEditingId] = useState(null);

  const filteredEmployees = employees.filter(emp =>
    emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchEmployees();
    fetchSubstations();
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // FIXED: Swapped single quotes for backticks so this endpoint evaluates properly
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/getAttendenceById`, {
          params: { employeeId: clickedEmployee },
          withCredentials: true
        })
        console.log("employee data", response.data);
        setClickedEmployeeDetails(response.data);
      } catch (error) {
        console.error("Fetch Details Error:", error);
      }
    }

    if (clickedEmployee) {
      fetchDetails();
    }
  }, [clickedEmployee])

  const fetchEmployees = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/all-employees`, {
      withCredentials: true
    });
    console.log(res.data);
    setEmployees(res.data.data);
  };

  const fetchSubstations = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/substation/get`, { withCredentials: true });
      console.log(res.data);
      setSubstations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ADD / UPDATE
  const handleSubmit = async () => {
    if (editingId) {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/admin/update-employee/${editingId}`,
        form,
        { withCredentials: true }
      );
    } else {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/employees`,
        form,
        { withCredentials: true }
      );
      setOpen(false);
    }

    resetForm();
    fetchEmployees();
  };

  // Disable
  const handleDisable = async (id) => {
    try {
      // FIXED: Changed /admin/employees/ to /admin/Disable-employee/ to match backend
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/admin/disable-employee/${id}`, {},
        { withCredentials: true }
      );
      console.log("Disabled:", res.data);
      fetchEmployees();
    } catch (err) {
      console.error("Disable ERROR:", err.response?.data || err.message);
    }
  };

  // EDIT
  const handleEdit = (emp) => {
    setForm(emp);
    setEditingId(emp.employeeId);
  };

  const resetForm = () => {
    setForm({
      employeeId: "",
      name: "",
      userName: "",
      password: "",
      role: "SBO",
      substationId: ""
    });
    setEditingId(null);
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return null;

    const date = new Date(isoString);

    const datePart = date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

    const timePart = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return { datePart, timePart };
  };

  return (
    <div className="space-y-6 p-4 ">
      <div className=" flex space-x-6">

        <div className="flex items-center gap-2 border border-[#7C3AED]/50 rounded-2xl py-2 px-4 bg-transparent w-52">
          <Search className="w-4 h-4 text-[#7C3AED] shrink-0" />
          <div className="w-px h-4 bg-[#7C3AED]/60" />
          <input
            type="text"
            placeholder="Search by ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-white placeholder:text-gray-500 text-sm bg-transparent outline-none w-full"
          />
        </div>

        <button
          onClick={() => setOpen(true)}
          className="text-white  hover:bg-[#5B21B6] cursor-pointer text-sm rounded-2xl py-2 px-5 bg-[#7C3AED]  transition"
        >
          Add Employee
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-[#0D1422] p-4 rounded-xl border border-[#1A2B3C]">
        <table className="w-full text-sm">
          <thead className="text-[#4E6680]">
            <tr>
              <th className="text-left py-2">ID</th>
              <th>Name</th>
              <th>Username</th>
              <th>Role</th>
              <th>Substation</th>
              <th>Created By</th>
              <th>Created At</th>
              <th>Updated By</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.map(emp => (
              <tr key={emp.employeeId}
                onClick={() => { setViewEmployee(true); setClickedEmployee(emp.employeeId); }}
                className="border-t border-[#1A2B3C] text-center hover:bg-[#111A2B] cursor-pointer">

                <td className="text-left py-2">{emp.employeeId}</td>
                <td>{emp.name}</td>
                <td>{emp.userName}</td>
                <td>{emp.role}</td>
                <td>{emp.substationId}</td>
                <td>{emp.createdBy}</td>
                <td>
                  {formatDateTime(emp.createdAt)?.datePart}
                  <br />
                  <span className="text-xs text-gray-400">
                    {formatDateTime(emp.createdAt)?.timePart}
                  </span>

                </td>
                <td>{emp.updatedBy || "-"}</td>

                <td>
                  {emp.updatedAt
                    ? formatDateTime(emp.updatedAt)?.datePart
                    : "-"}

                     <br />
                  <span className="text-xs text-gray-400">
                    {formatDateTime(emp.updatedAt)?.timePart}
                  </span>
                </td>
                {/* ACTIONS */}
                <td className="flex justify-center gap-3 py-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => { setUpdateModal(true); setSelectedEmployee(emp) }}
                    className="text-blue-400 hover:text-blue-500"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedEmployee(emp);
                      setDisableModal(true);
                    }}
                    className="text-red-400 hover:text-red-500"
                  >
                    <UserX size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* add employee modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#0D1422] p-6 rounded-xl w-[400px] border border-[#1A2B3C]">
            <h3 className="mb-4 font-semibold">Add Employee</h3>
            <div className="space-y-3">
              <input
                placeholder="Employee ID"
                className="w-full bg-[#1e1e2f] px-3 py-2 rounded"
                onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
              />

              <input
                placeholder="Name"
                className="w-full bg-[#1e1e2f] px-3 py-2 rounded"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                placeholder="Username"
                className="w-full bg-[#1e1e2f] px-3 py-2 rounded"
                onChange={(e) => setForm({ ...form, userName: e.target.value })}
              />

              <div className="relative">
                <input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  className="w-full bg-[#1e1e2f] px-3 py-2 pr-10 rounded"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative inline-block w-full">
                <select
                  value={form.substationId}
                  onChange={(e) => setForm({ ...form, substationId: e.target.value })}
                  className="appearance-none w-full bg-[#1e1e2f] px-3 py-2 rounded">
                  <option value="" disabled>
                    Select Substation
                  </option>
                  {substations.data && substations.data.map((sub, idx) => (
                    <option key={idx} value={sub.substationId}>{sub.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 bottom-1 text-[#7C3AED] pointer-events-none" />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-2 text-sm text-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-[#7C3AED] px-4 py-2 rounded-full text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disable employee modal */}
      {disableModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#0D1422] p-6 rounded-2xl w-[380px] border border-[#1A2B3C] shadow-xl animate-fadeIn">
            <h3 className="text-lg font-semibold text-white mb-3">
              Disable Employee
            </h3>
            <p className="text-sm text-gray-400 mb-5">
              Are you sure you want to disable{" "}
              <span className="text-red-400 font-medium">
                {selectedEmployee.employeeId}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setDisableModal(false);
                  setSelectedEmployee(null);
                }}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  handleDisable(selectedEmployee.employeeId);
                  setDisableModal(false);
                  setSelectedEmployee(null);
                }}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                Disable
              </button>
            </div>
          </div>
        </div>
      )}

      {/* update modal */}
      {updateModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#0D1422] p-6 rounded-2xl w-[400px] border border-[#1A2B3C] shadow-xl animate-fadeIn">
            <h3 className="mb-4 font-semibold text-white">
              Update Employee
            </h3>

            <div className="space-y-3">
              <input
                value={selectedEmployee.employeeId}
                disabled
                className="w-full bg-[#1e1e2f] px-3 py-2 rounded opacity-60 cursor-not-allowed"
              />

              <input
                value={selectedEmployee.name}
                onChange={(e) =>
                  setSelectedEmployee({ ...selectedEmployee, name: e.target.value })
                }
                className="w-full bg-[#1e1e2f] px-3 py-2 rounded"
                placeholder="Name"
              />

              <input
                value={selectedEmployee.userName}
                onChange={(e) =>
                  setSelectedEmployee({ ...selectedEmployee, userName: e.target.value })
                }
                className="w-full bg-[#1e1e2f] px-3 py-2 rounded"
                placeholder="Username"
              />

              <input
                type="password"
                placeholder="New Password"
                onChange={(e) =>
                  setSelectedEmployee({ ...selectedEmployee, password: e.target.value })
                }
                className="w-full bg-[#1e1e2f] px-3 py-2 rounded"
              />

              <select
                value={selectedEmployee.substationId}
                onChange={(e) =>
                  setSelectedEmployee({ ...selectedEmployee, substationId: e.target.value })
                }
                className="w-full bg-[#1e1e2f] px-3 py-2 rounded"
              >
                <option value="PSS-ANI">Aniyakanda PSS</option>
                <option value="PSS-MAB">Mabola PSS</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setUpdateModal(false);
                  setSelectedEmployee(null);
                }}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {
                    // FIXED: Changed endpoint layout string path to target update-employee
                    await axios.put(
                      `${import.meta.env.VITE_API_URL}/admin/update-employee/${selectedEmployee.employeeId}`,
                      selectedEmployee,
                      { withCredentials: true }
                    );

                    setUpdateModal(false);
                    setSelectedEmployee(null);
                    fetchEmployees();
                  } catch (err) {
                    console.error("UPDATE ERROR:", err.response?.data || err.message);
                  }
                }}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {viewEmployee && clickedEmployee && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#0D1422] p-6 rounded-2xl w-[90%] max-w-6xl border border-[#1A2B3C]">
            <h3 className="text-white mb-4">
              Attendance - {clickedEmployee}
            </h3>

            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full text-sm border-separate border-spacing-y-2">
                <thead className="text-[#4E6680] text-left">
                  <tr>
                    <th className="px-4 py-2">Employee</th>
                    <th className="px-4 py-2">Substation</th>
                    <th className="px-4 py-2">Shift</th>
                    <th className="px-4 py-2">Check-in</th>
                    <th className="px-4 py-2">Check-in Location</th>
                    <th className="px-4 py-2">Check-out</th>
                    <th className="px-4 py-2">Check-out Location</th>
                  </tr>
                </thead>

                <tbody>
                  {clickedEmployeeDetails.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center text-gray-400 py-4">
                        No data found
                      </td>
                    </tr>
                  ) : (
                    clickedEmployeeDetails.map((row, i) => {
                      const checkIn = formatDateTime(row.checkInTime);
                      const checkOut = formatDateTime(row.checkOutTime);
                      const isInvalid = row.checkInValid === 0 || row.checkOutValid === 0;

                      return (
                        <tr
                          key={i}
                          className={`bg-[#0F172A] rounded-lg ${isInvalid ? "border border-red-500/30" : ""}`}
                        >
                          <td className="px-4 py-3">{row.employeeId}</td>
                          <td className="px-4 py-3">{row.substationId}</td>
                          <td className="px-4 py-3">{row.shiftId}</td>
                          <td className="px-4 py-3">
                            {checkIn ? (
                              <div className="flex flex-col">
                                <span>{checkIn.datePart}</span>
                                <span className="text-xs text-gray-400">
                                  {checkIn.timePart}
                                </span>
                              </div>
                            ) : "-"}
                          </td>
                          <td className="px-4 py-3">
                            {row.checkInTime ? (
                              row.checkInValid === 1 ? (
                                <span className="text-green-400">Valid ✔</span>
                              ) : (
                                <span className="text-red-500">Invalid 🚩</span>
                              )
                            ) : "-"}
                          </td>
                          <td className="px-4 py-3">
                            {checkOut ? (
                              <div className="flex flex-col">
                                <span>{checkOut.datePart}</span>
                                <span className="text-xs text-gray-400">
                                  {checkOut.timePart}
                                </span>
                              </div>
                            ) : "-"}
                          </td>
                          <td className="px-4 py-3">
                            {row.checkOutTime ? (
                              row.checkOutValid === 1 ? (
                                <span className="text-green-400">Valid ✔</span>
                              ) : (
                                <span className="text-red-500">Invalid 🚩</span>
                              )
                            ) : "-"}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setViewEmployee(false);
                  setClickedEmployee(null);
                  setClickedEmployeeDetails([]);
                }}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}