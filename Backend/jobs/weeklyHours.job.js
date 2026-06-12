const cron = require("node-cron");
const db = require("../config/db-config");

const runWeeklyHoursJob = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      console.log("Running weekly hours job...");

      await db.query(`
          INSERT INTO employee_weekly_hours (
            employee_id,
            week_start_date,
            week_end_date,
            total_hours,
            overtime_hours
          )
          SELECT 
            a.employeeId,
            @weekStart,
            @weekEnd,

            ROUND(SUM(TIMESTAMPDIFF(MINUTE, a.checkInTime, a.checkOutTime)) / 60, 2) AS total_hours,

            CASE 
              WHEN SUM(TIMESTAMPDIFF(MINUTE, a.checkInTime, a.checkOutTime)) > (45 * 60)
              THEN ROUND(
                (SUM(TIMESTAMPDIFF(MINUTE, a.checkInTime, a.checkOutTime)) - (45 * 60)) / 60, 
                2
              )
              ELSE 0
            END AS overtime_hours

          FROM attendance a
          WHERE 
            a.workStatus = 'CHECKED_OUT'
            AND a.attendanceDate BETWEEN @weekStart AND @weekEnd

          GROUP BY a.employeeId

          ON DUPLICATE KEY UPDATE
            total_hours = VALUES(total_hours),
            overtime_hours = VALUES(overtime_hours);
     
        `)

      console.log("Weekly hours updated");

    } catch (err) {
      console.error("Cron job error:", err);
    }
  });
};

module.exports = runWeeklyHoursJob;