import React from 'react'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { UserCheck } from 'lucide-react';

function DisabledEmployees() {

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/all-disabled-employees`, {
          withCredentials: true
        })
        console.log("disabled emps", response.data.data);
        setEmployees(response.data.data);
      } catch (err) {

      }
    }

    fetchEmployees()
  }, [])

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

  const enableUser = async (employeeId) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/admin/enable-employee/${employeeId}`,
        {},
        { withCredentials: true }
      )

      setEmployees(prev =>
        prev.filter(emp => emp.employeeId !== employeeId)
      );
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
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
              <th>Enable User</th>
            </tr>
          </thead>

          <tbody>
            {employees.map(emp => (
              <tr key={emp.employeeId}
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
                <td>
                  <button onClick={() => enableUser(emp.employeeId)}>
                    <UserCheck
                      className='w-full text-blue-400 hover:text-blue-500' />
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DisabledEmployees
