import React, { use, useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { ChevronDown, Search, Building2 } from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DateInput from "../../Components/DateInput";

function EmployeeLogs() {

  const [logs, setLogs] = useState([]);
  const [expandedLogId, setExpandedLogId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [substation, setSubstation] = useState("")
  const [employeeId, setEmployeeId] = useState("")
  const [allSubstations, setAllSubstations] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const exportToExcel = (log) => {
    const ws = XLSX.utils.aoa_to_sheet([]);

    //  HEADER ROW
    XLSX.utils.sheet_add_aoa(ws, [
      ["DAILY LOG SHEET", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      [
        "Time",
        "Tr1 kV33", "Tr1 kV11", "Tr1 Amp", "Tap", "PF",
        "Tr2 kV33", "Tr2 kV11", "Tr2 Amp", "Tap", "PF",
        "Total 11kV",
        "Feeder1", "Feeder2", "Feeder3", "Feeder4", "Feeder5", "Feeder6", "Feeder7",
        "Voltage", "Amps",
        "Remarks"
      ]
    ], { origin: "A1" });

    //  DATA ROW (you can loop if multiple logs)
    const row = [
      log.logTime,

      // Transformer 1 (example using first transformer)
      log.transformers[0]?.kv33 || "",
      log.transformers[0]?.kv11 || "",
      log.transformers[0]?.amps11 || "",
      log.transformers[0]?.tapPosition || "",
      log.transformers[0]?.pf || "",

      // Transformer 2
      log.transformers[1]?.kv33 || "",
      log.transformers[1]?.kv11 || "",
      log.transformers[1]?.amps11 || "",
      log.transformers[1]?.tapPosition || "",
      log.transformers[1]?.pf || "",

      log.total11kV || "",

      // Feeders (map safely)
      ...Array.from({ length: 7 }).map((_, i) => log.feeders[i]?.current || ""),

      log.stationSupply?.voltage || "",
      log.stationSupply?.amps || "",

      log.remarks || ""
    ];

    XLSX.utils.sheet_add_aoa(ws, [row], { origin: -1 });

    //  MERGE CELLS (like your sheet)
    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 10 } }, // Title merge
    ];

    //  COLUMN WIDTHS (important for readability)
    ws["!cols"] = [
      { wch: 8 }, // Time
      { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 6 }, { wch: 6 },
      { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 6 }, { wch: 6 },
      { wch: 10 },
      ...Array(7).fill({ wch: 8 }),
      { wch: 8 }, { wch: 8 },
      { wch: 15 }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Log Sheet");

    XLSX.writeFile(wb, `Structured_Log_${log.id}.xlsx`);
  };

  useEffect(() => {

    axios.get(
      `${import.meta.env.VITE_API_URL}/admin/getFullLogs`,
      {
        params: {
          substation,
          employeeId,
          startDate: startDate?.toISOString().split("T")[0],
          endDate: endDate?.toISOString().split("T")[0]
        },
        withCredentials: true
      }
    )
      .then((res) => {
        setLogs(res.data);
        console.log("log data", res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [substation, employeeId, startDate, endDate]);

  useEffect(() => {
    const fetchSubstations = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/substation/get`, { withCredentials: true });
        setAllSubstations(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSubstations();
  }, []);


  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4 space-y-6">

      <div className="flex space-x-6">

        <h2 className="text-2xl font-semibold text-white space-x-3">

          <div className="flex items-center gap-2 border border-[#7C3AED]/50 rounded-2xl py-2 px-4 bg-transparent w-52">
            <Search className="w-4 h-4 text-[#7C3AED] shrink-0" />
            <div className="w-px h-4 bg-[#7C3AED]/60" />
            <input
              type="text"
              placeholder="Search by ID"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="text-white placeholder:text-gray-500 text-sm bg-transparent outline-none w-full"
            />
          </div>
        </h2>

        <h2 className="text-2xl font-semibold text-white space-x-3">

          <div className="flex items-center gap-2 border border-[#7C3AED]/50 rounded-2xl py-2 px-4 bg-transparent w-52 relative">
            <Building2 className="w-4 h-4 text-[#7C3AED] shrink-0" />
            <div className="w-px h-4 bg-[#7C3AED]/60" />
            <select
              value={substation}
              onChange={(e) => setSubstation(e.target.value)}
              className="appearance-none bg-transparent text-sm text-gray-500 outline-none w-full cursor-pointer"
            >
              <option value="" disabled className="bg-[#0A0F1A]">Select Substation</option>
              {allSubstations.data && allSubstations.data.map((sub, idx) => (
                <option key={idx} value={sub.substationId} className="bg-[#0A0F1A]">{sub.name}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[#7C3AED] shrink-0 pointer-events-none" />
          </div>
        </h2>

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
      </div>



      {/* TABLE CARD */}
      <div className="bg-[#0D1422] p-4 rounded-2xl border border-[#1A2B3C] shadow-xl overflow-x-auto">

        <table className="w-full text-sm text-center">

          {/* HEADER */}
          <thead className="text-[#4E6680] border-b border-[#1A2B3C]">
            <tr>
              <th className="text-left py-3 px-2">Date</th>
              <th>Time</th>
              <th>Employee Id</th>
              <th>Substation</th>
              <th>Remarks</th>
              <th>Action</th>
              <th>Export</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <React.Fragment key={log.id}>

                {/* MAIN ROW */}
                <tr className="border-t border-[#1A2B3C] hover:bg-[#111827] transition">

                  <td className="text-left py-3 px-2 text-white">
                    {new Date(log.logDate).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",

                    })}
                  </td>

                  <td className="text-gray-300">{log.logTime}</td>
                  <td className="text-gray-300">{log.employeeId}</td>
                  <td className="text-gray-300">{log.substationName}</td>
                  <td className="text-gray-400">{log.remarks}</td>

                  <td>
                    <button
                      onClick={() =>
                        setExpandedLogId(
                          expandedLogId === log.id ? null : log.id
                        )
                      }
                      className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-lg text-xs transition"
                    >
                      {expandedLogId === log.id ? "Hide" : "View"}
                    </button>
                  </td>

                  <td >
                    <button
                      onClick={() => exportToExcel(log)}
                      className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg text-xs transition"
                    >
                      Export
                    </button>
                  </td>
                </tr>

                {/* EXPANDED ROW */}
                {expandedLogId === log.id && (
                  <tr>
                    <td colSpan="5">
                      <div className="bg-[#111827] p-5 rounded-xl border border-[#1A2B3C] mt-2 space-y-5 text-left">
                        {/* Transformers */}
                        <div>
                          <h4 className="text-purple-400 font-semibold mb-2">
                            Transformers
                          </h4>

                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead className="text-[#4E6680] border-b border-[#1A2B3C]">
                                <tr>
                                  <th className="text-left py-2">No</th>
                                  <th>kV33</th>
                                  <th>kV11</th>
                                  <th>Tap</th>
                                  <th>PF</th>
                                </tr>
                              </thead>

                              <tbody>
                                {log.transformers.map((t, i) => (
                                  <tr key={i} className="border-t border-[#1A2B3C]">
                                    <td className="py-2 text-white">{t.transformerNo}</td>
                                    <td className="text-gray-300">{t.kv33}</td>
                                    <td className="text-gray-300">{t.kv11}</td>
                                    <td className="text-gray-300">{t.tapPosition}</td>
                                    <td className="text-gray-300">{t.pf}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-purple-400 font-semibold mb-2">
                            Total 11Kv Amps
                          </h4>
                          <td className="text-gray-300">{log.total11kV}</td>

                        </div>

                        {/* Feeders */}
                        <div>
                          <h4 className="text-purple-400 font-semibold mb-2">
                            11Kv Out Going feeders Feeders
                          </h4>

                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead className="text-[#4E6680] border-b border-[#1A2B3C]">
                                <tr>
                                  <th className="text-left py-2">Feeder No</th>
                                  <th>Current</th>
                                </tr>
                              </thead>

                              <tbody>
                                {log.feeders.map((f, i) => (
                                  <tr key={i} className="border-t border-[#1A2B3C]">
                                    <td className="py-2 text-white">{f.feederNo}</td>
                                    <td className="text-gray-300">{f.current}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Station Supply */}
                        <div>
                          <h4 className="text-purple-400 font-semibold mb-2">
                            Station Supply
                          </h4>

                          {log.stationSupply ? (
                            <p className="text-gray-300">
                              Voltage: {log.stationSupply.voltage} | Amps:{" "}
                              {log.stationSupply.amps}
                            </p>
                          ) : (
                            <p className="text-gray-500">No data</p>
                          )}
                        </div>

                      </div>
                    </td>
                  </tr>
                )}

              </React.Fragment>
            ))}
          </tbody>

        </table>
      </div>

    </div >
  );
}

export default EmployeeLogs;