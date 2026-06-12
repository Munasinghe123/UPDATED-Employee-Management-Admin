import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Search } from 'lucide-react';
import { CalendarDays } from 'lucide-react';
import { forwardRef } from 'react';
import DateInput from '../../Components/DateInput';


function OverTime() {

  const [otHours, setOtHours] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);


  useEffect(() => {

    const fetchOT = async () => {
      try {

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/getOtHours`, { withCredentials: true })
        setOtHours(response.data);
        console.log("ot hours", response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchOT()
  }, [])

  const filteredEmployees = otHours.filter(emp => {
    const matchesSearch =
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());

    const weekStart = new Date(emp.week_start_date);

    const matchesDate =
      (!startDate || weekStart >= startDate) &&
      (!endDate || weekStart <= endDate);

    return matchesSearch && matchesDate;
  });

  const exportToExcel = () => {
    const data = filteredEmployees.map(emp => ({
      "Employee ID": emp.employeeId || emp.id,
      "Name": emp.name,
      "Overtime Hours": emp.overtime_hours,
      "Total Working Hours": emp.total_hours,
      "Week Start Date": new Date(emp.week_start_date).toLocaleDateString(),
      "Week End Date": new Date(emp.week_end_date).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Overtime");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "overtime_report.xlsx");
  };

  return (
    < div className='flex flex-col gap-6' >
      <div className="flex flex-row space-x-6">
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

        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          placeholderText="Start date"
          customInput={<DateInput placeholderText="Start date" />}
        />

        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          placeholderText="End date"
          minDate={startDate}
          customInput={<DateInput placeholderText="End date" />}
        />

        <button
          onClick={exportToExcel}
          className="text-white  hover:bg-[#5B21B6] cursor-pointer text-sm rounded-2xl py-2 px-5 bg-[#7C3AED]  transition"
        >
          Export to Excel
        </button>

      </div>


      <div className='border border-[#1A2B3C] p-4 rounded-2xl'>

        {filteredEmployees.length > 0 ? (
          <table className="w-full text-sm text-center  ">
            <thead className="text-[#4E6680] border-b border-[#1A2B3C]">
              <tr>
                <th>Employee Id</th>
                <th>Name</th>
                <th>OverTime Hours </th>
                <th>Total working Hours</th>
                <th>Week Start Date</th>
                <th>Week End Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.map((data, index) => {

                return (
                  <tr className="border-t border-[#1A2B3C] hover:bg-[#111827] transition">
                    <td className="p-3">{data.employeeId || data.id}</td>
                    <td className="p-3">{data.name}</td>
                    <td className="p-3">{data.overtime_hours}</td>
                    <td className="p-3">{data.total_hours}</td>
                    <td className="p-3">
                      {new Date(data.week_start_date).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      {new Date(data.week_end_date).toLocaleDateString()}
                    </td>
                  </tr>
                )

              })}
            </tbody>
          </table>
        ) : (
          <p className="text-white">No overtime hours found.</p>
        )}
      </div>
    </div>
  )
}

export default OverTime
