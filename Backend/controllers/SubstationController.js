const db = require("../config/db-config")


const addSubstation = async (req, res) => { 
    try{
        console.log(req.body, "add substation");
        const{substationId, name, latitude, longitude, address} = req.body;
        if(!substationId || !name || !latitude || !longitude || !address){
            return res.status(400).json({ message: "All fields are required" });
        }
        const [result] = await db.query(
            "INSERT INTO substations (substationId, name, latitude, longitude, address) VALUES (?, ?, ?, ?, ?)",
            [substationId, name, latitude, longitude, address]
        );
        res.status(201).json({ message: "Substation added successfully", substationId: result.insertId });

    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getSubstations = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM substations");

        if (rows.length === 0) {
            return res.status(404).json({ message: "No substations found" });
        }

        res.status(200).json({ data: rows, message: "All substations" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = {
    addSubstation,
    getSubstations
}
