const db = require("../config/db-config");

const WEEKLY_HOURS_LIMIT = 45;

/**
 * Get total worked minutes for each employee in the given week.
 */
async function getWorkedMinutes(weekStart, weekEnd) {
  const [rows] = await db.query(
    `
    SELECT
      employeeId AS employee_id,
      SUM(
        TIMESTAMPDIFF(
          MINUTE,
          checkInTime,
          checkOutTime
        )
      ) AS totalMinutes

    FROM attendance

    WHERE
      workStatus = 'CHECKED_OUT'
      AND attendanceDate BETWEEN ? AND ?

    GROUP BY employeeId
    `,
    [weekStart, weekEnd],
  );

  return rows;
}

/**
 * Insert or update one employee's weekly hours.
 */
async function saveWeeklyHours(
  employeeId,
  weekStart,
  weekEnd,
  totalHours,
  overtimeHours,
) {
  await db.query(
    `
    INSERT INTO employee_weekly_hours (
      employee_id,
      week_start_date,
      week_end_date,
      total_hours,
      overtime_hours
    )

    VALUES (?, ?, ?, ?, ?)

    ON DUPLICATE KEY UPDATE
      total_hours = VALUES(total_hours),
      overtime_hours = VALUES(overtime_hours)
    `,
    [employeeId, weekStart, weekEnd, totalHours, overtimeHours],
  );
}

/**
 * Calculate and update weekly hours for all employees.
 */
async function updateWeeklyHours(weekStart, weekEnd) {
  const employees = await getWorkedMinutes(weekStart, weekEnd);

  for (const employee of employees) {
    try {
      const totalHours = Number(employee.totalMinutes) / 60;

      const overtimeHours = Math.max(0, totalHours - WEEKLY_HOURS_LIMIT);

      await saveWeeklyHours(
        employee.employee_id,
        weekStart,
        weekEnd,
        Number(totalHours.toFixed(2)),
        Number(overtimeHours.toFixed(2)),
      );
    } catch (err) {
      console.error(
        `Failed to update weekly hours for employee ${employee.employee_id}`,
        err,
      );
    }
  }
}

module.exports = {
  updateWeeklyHours,
};
