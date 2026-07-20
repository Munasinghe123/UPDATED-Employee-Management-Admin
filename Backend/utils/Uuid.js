
const db = require('../config/db-config');

const generateUuid = async () => {
  const today = new Date().toISOString().split("T")[0];

  // Find the latest UUID for today
  const [rows] = await db.query(
    `
    SELECT uuid
    FROM employee
    WHERE uuid LIKE ?
    ORDER BY uuid DESC
    LIMIT 1
    `,
    [`leco-${today}-%`]
  );

  let nextNumber = 1;

  if (rows.length > 0) {
    const lastUuid = rows[0].uuid;

    // Get the last number after the final '-'
    const lastSequence = parseInt(lastUuid.split("-").pop(), 10);

    nextNumber = lastSequence + 1;
  }

  const sequence = String(nextNumber).padStart(3, "0");

  return `leco-${today}-${sequence}`;
};

module.exports = { generateUuid };