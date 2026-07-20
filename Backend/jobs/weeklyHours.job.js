const cron = require("node-cron");
const { getCurrentWeek } = require("../utils/Week");
const { updateWeeklyHours } = require("../services/weekly-hours-service");

const runWeeklyHoursJob = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      console.log("Running weekly hours job...");

      const { weekStart, weekEnd } = getCurrentWeek();

      await updateWeeklyHours(weekStart, weekEnd);

      console.log("Weekly hours updated.");
    } catch (error) {
      console.error("Weekly hours job failed:", error);
    }
  });
};

module.exports = runWeeklyHoursJob;