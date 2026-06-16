import { useEffect, useState } from "react";
import axios from "axios";
import { Users, CheckCircle, AlertTriangle } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDays } from 'lucide-react';
import DateInput from '../../Components/DateInput';

export default function Attendance() {

  const [summary, setSummary] = useState({
    active: 0,
    completed: 0,
    invalidCheckIns: 0,
    invalidCheckOuts: 0
  });

  const [attendance, setAttendance] = useState([]);

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [date]);

  const fetchSummary = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/attendance-summary`,
        { withCredentials: true }
      );
      setSummary(res.data);
      // console.log("attendence summary",res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/attendance`,
        {
          params: { date },
          withCredentials: true
        }
      );
      setAttendance(res.data.data);
      // console.log(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  //  Format date + time nicely
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
    <div className="space-y-6 p-4">

      {/*  CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        <div className="bg-[#1e1e2f]  p-6 rounded-2xl flex justify-between">
          <div className="">
            <p className="text-gray-400 text-sm">Active Now</p>
            <h2 className="text-3xl font-bold">{summary.active}</h2>
          </div>
          <Users className="text-green-400" />
        </div>

        <div className="bg-[#1e1e2f] p-6 rounded-2xl flex justify-between">
          <div>
            <p className="text-gray-400 text-sm">Completed</p>
            <h2 className="text-3xl font-bold">{summary.completed}</h2>
          </div>
          <CheckCircle className="text-blue-400" />
        </div>

        <div className="bg-[#1e1e2f] p-6 rounded-2xl flex justify-between">
          <div>
            <p className="text-gray-400 text-sm">Invalid Check-Ins</p>
            <h2 className="text-3xl font-bold">{summary.invalidCheckIns}</h2>
          </div>
          <AlertTriangle className="text-red-400" />
        </div>

        <div className="bg-[#1e1e2f] p-6 rounded-2xl flex justify-between">
          <div>
            <p className="text-gray-400 text-sm">Invalid Check-Outs</p>
            <h2 className="text-3xl font-bold">{summary.invalidCheckOuts}</h2>
          </div>
          <AlertTriangle className="text-red-400" />
        </div>

      </div>

      {/*  DATE FILTER */}
      <div className="flex items-center gap-4">
        <DatePicker
  selected={date}
 onChange={(d) => setDate(d.toISOString().split("T")[0])}
  placeholderText="Select date"
  customInput={<DateInput placeholderText="Select date" />}
/>
      </div>

      {/*  TABLE */}
      <div className="bg-[#0D1422] border border-[#1A2B3C] rounded-xl p-4">
        <p className="text-sm font-semibold mb-4">
          Attendance ({date})
        </p>

        <table className="w-full text-sm border-separate border-spacing-y-2">

          {/* HEADER */}
          <thead className="text-[#4E6680] text-left ">
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

          {/* BODY */}
          <tbody>
            {attendance.map((row, i) => {

              const checkIn = formatDateTime(row.checkInTime);
              const checkOut = formatDateTime(row.checkOutTime);

              const isInvalid =
                row.checkInValid === 0 || row.checkOutValid === 0;

              return (
                <tr
                  key={i}
                  className={`bg-[#0F172A] rounded-lg ${isInvalid ? "border border-red-500/30" : ""
                    }`}
                >

                  <td className="px-4 py-3">{row.employeeId}</td>

                  <td className="px-4 py-3">{row.substationId}</td>

                  <td className="px-4 py-3">{row.shiftId}</td>

                  {/* CHECK-IN */}
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

                  {/* CHECK-IN VALID */}
                  <td className="px-4 py-3">
                    {row.checkInTime ? (
                      row.checkInValid === 1 ? (
                        <span className="text-green-400">Valid ✔</span>
                      ) : (
                        <span className="text-red-500">Invalid 🚩</span>
                      )
                    ) : "-"}
                  </td>

                  {/* CHECK-OUT */}
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

                  {/* CHECK-OUT VALID */}
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
            })}
          </tbody>

        </table>
      </div>

    </div>
  );
}