const db = require("../config/db-config");
const bcrypt = require("bcrypt");
const { generateUuid } = require("../utils/Uuid");

const checkLoggedIn = async (req, res) => {
  try {
    console.log("loged in user", req.user);

    res.status(200).json({ user: req.user });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getTodayCheckins = async (req, res) => {
  try {
    const [result] = await db.query(`
            SELECT COUNT(*) AS total 
            FROM attendance
            WHERE created_at >= CURDATE()
            AND created_at < CURDATE() + INTERVAL 1 DAY;
        `);

    return res.status(200).json({
      message: "Today's check-ins",
      total: result[0].total,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getAttendance = async (req, res) => {
  try {
    const { date } = req.query;

    console.log(date);

    const selectedDate = date || new Date().toISOString().split("T")[0];

    const [rows] = await db.query(
      `SELECT 
                a.id,
                a.employeeId,
                a.substationId,
                a.shiftId,
                a.checkInTime,
                a.checkOutTime,
                a.checkInValid,
                a.checkOutValid
            FROM attendance a
            WHERE DATE(a.attendanceDate) = ?`,
      [selectedDate],
    );

    console.log("attendece ", rows);

    return res.status(200).json({
      data: rows,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAttendanceSummary = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const [rows] = await db.query(
      `
      SELECT 
        COUNT(CASE WHEN checkInTime IS NOT NULL AND checkOutTime IS NULL THEN 1 END) AS active,
        COUNT(CASE WHEN checkInTime IS NOT NULL AND checkOutTime IS NOT NULL THEN 1 END) AS completed,
        COUNT(CASE WHEN checkInValid = 0 THEN 1 END) AS invalidCheckIns,
        COUNT(CASE WHEN checkOutValid = 0 THEN 1 END) AS invalidCheckOuts
      FROM attendance
      WHERE attendanceDate = ?
    `,
      [today],
    );

    console.log(rows[0]);

    return res.status(200).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const allEmployees = async (req, res) => {
  try {
    // const [employees] = await db.query('SELECT * FROM employee')

    const [employees] = await db.query(
      `SELECT
    e.employeeId,
    e.name,
    e.userName,
    e.role,
    e.substationId,
    creator.name AS createdBy,
    editor.name AS updatedBy,
    e.createdAt,
    e.updatedAt
FROM employee e

LEFT JOIN admin creator
    ON creator.employeeId = e.createdBy

LEFT JOIN admin editor
    ON editor.employeeId = e.updatedBy

WHERE e.isActive = 1`,
    );

    // console.log(employees);

    if (employees.length === 0) {
      return res.status(404).json("No employees found");
    }

    // console.log("all employees", employees);

    res.status(200).json({
      message: "All employees",
      data: employees,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addEmployee = async (req, res) => {
  try {
    console.log("add employee hit", req.body);

    const { employeeId, name, userName, password, role, substationId } =
      req.body;

    const createdBy = req.user.employeeId;
    console.log(createdBy);

    const hashedPassword = await bcrypt.hash(password, 10);

    const uuid =await generateUuid();

    await db.query(
      "INSERT INTO employee (employeeId, name, userName, password, role, substationId, createdBy, uuid) VALUES (?, ?, ?, ?, ?, ?, ?,?)",
      [
        employeeId,
        name,
        userName,
        hashedPassword,
        role,
        substationId,
        createdBy,
        uuid,
      ],
    );

    res.json({ message: "Employee added" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, userName, substationId, employeeId, password } = req.body;

    const updatedBy = req.user.employeeId;

    let result;

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);

      [result] = await db.query(
        `UPDATE employee
                 SET
                    employeeId = ?,
                    name = ?,
                    userName = ?,
                    password = ?,
                    substationId = ?,
                    updatedBy = ?,
                    updatedAt = NOW()
                 WHERE employeeId = ?`,
        [
          employeeId,
          name,
          userName,
          hashedPassword,
          substationId,
          updatedBy,
          id,
        ],
      );
    } else {
      [result] = await db.query(
        `UPDATE employee
                 SET
                    employeeId = ?,
                    name = ?,
                    userName = ?,
                    substationId = ?,
                    updatedBy = ?,
                    updatedAt = NOW()
                 WHERE employeeId = ?`,
        [employeeId, name, userName, substationId, updatedBy, id],
      );
    }

    console.log("Update Result:", result);

    res.json({
      success: true,
      message: "Employee updated",
    });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const disableEmployee = async (req, res) => {
  try {
    console.log("disable hit", req.params);
    const { id } = req.params;

    console.log("logged in user", req.user);

    await db.query(
      `UPDATE employee 
                        SET isActive=0 , updatedBy=? , updatedAt=NOW() 
                        WHERE employeeId=?`,
      [req.user.employeeId, id],
    );

    res.json({ message: "Employee disabled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const enableEmployee = async (req, res) => {
  try {
    console.log("enable hit", req.params);
    const { id } = req.params;

    console.log("logged in user", req.user);

    await db.query(
      `UPDATE employee 
                        SET isActive=1 , updatedBy=? , updatedAt=NOW() 
                        WHERE employeeId=?`,
      [req.user.employeeId, id],
    );

    res.json({ message: "Employee enabled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getFullLogs = async (req, res) => {
  try {
    const { substation, employeeId, startDate, endDate } = req.query;

    const cleanSub = substation?.trim();
    const cleanEmp = employeeId?.trim();

    let query = `
            SELECT dl.*, s.name AS substationName
            FROM daily_logs dl
            JOIN substations s ON dl.substationId = s.substationId
            WHERE 1=1
        `;

    const params = [];

    // Substation filter
    if (cleanSub) {
      query += ` AND dl.substationId = ?`;
      params.push(cleanSub);
    }

    // Employee filter
    if (cleanEmp) {
      query += ` AND dl.employeeId = ?`;
      params.push(cleanEmp);
    }

    // Start date filter
    if (startDate) {
      query += ` AND DATE(dl.logDate) >= ?`;
      params.push(startDate);
    }

    // End date filter
    if (endDate) {
      query += ` AND DATE(dl.logDate) <= ?`;
      params.push(endDate);
    }

    query += `
            ORDER BY dl.logDate DESC,
                     dl.logTime DESC
        `;

    const [logs] = await db.query(query, params);

    if (logs.length === 0) {
      return res.json([]);
    }

    const fullLogs = [];

    for (const log of logs) {
      const logId = log.id;

      const [feeders] = await db.query(
        `
                SELECT feederNo, current
                FROM feeder_logs
                WHERE dailyLogId = ?
                `,
        [logId],
      );

      const [stationRows] = await db.query(
        `
                SELECT voltage, amps
                FROM station_supply_logs
                WHERE dailyLogId = ?
                `,
        [logId],
      );

      const [transformers] = await db.query(
        `
                SELECT transformerNo,
                       kv33,
                       kv11,
                       amps11,
                       tapPosition,
                       pf
                FROM transformer_logs
                WHERE dailyLogId = ?
                `,
        [logId],
      );

      fullLogs.push({
        ...log,
        stationSupply: stationRows[0] || null,
        feeders,
        transformers,
      });
    }

    return res.json(fullLogs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const getOtHours = async (req, res) => {
  try {
    const [query] = await db.query(`
            SELECT w.total_hours , w.overtime_hours, w.week_start_date,w.week_end_date,e.employeeId, e.name 
            FROM employee_weekly_hours w
            JOIN employee e ON e.employeeId = w.employee_id
            ORDER BY w.week_start_date DESC
            `);

    if (query.length < 0) {
      return;
    }

    // console.log('ot data', query[0]);

    return res.json(query);
  } catch (error) {
    console.error("Error fetching weekly hours:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getAttendanceById = async (req, res) => {
  try {
    const { employeeId } = req.query;

    if (!employeeId) {
      return res.status(400).json({ message: "employeeId is required" });
    }

    const [rows] = await db.query(
      `SELECT * FROM attendance WHERE employeeId = ? ORDER BY checkInTime DESC`,
      [employeeId],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No records found" });
    }

    console.log("attendence", rows);

    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const searchEmployees = async (req, res) => {
  try {
    const { employeeId } = req.query;

    if (!employeeId || employeeId.trim() === "") {
      return res.status(400).json({
        message: "employeeId query param is required",
      });
    }

    const [rows] = await db.query(
      `
      SELECT 
        employeeId,
        name,
        userName,
        role,
        substationId
      FROM employee
      WHERE employeeId LIKE ?
      `,
      [`%${employeeId.trim()}%`],
    );

    return res.status(200).json({
      data: rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const disabledEmployees = async (req, res) => {
  try {
    const [employees] = await db.query(
      `
            SELECT e.employeeId,e.name,e.userName,e.role,e.substationId ,a.name as createdBy,e.createdAt,e.updatedBy,e.updatedAt 
            FROM employee e
            LEFT JOIN admin a
            ON a.employeeId = e.createdBy
            WHERE e.isActive=0`,
    );
    // console.log(employees);

    return res.status(200).json({
      data: employees,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  searchEmployees,
  enableEmployee,
  checkLoggedIn,
  disabledEmployees,
  getAttendanceById,
  getFullLogs,
  allEmployees,
  getTodayCheckins,
  getAttendance,
  getAttendanceSummary,
  disableEmployee,
  updateEmployee,
  addEmployee,
  getOtHours,
};
