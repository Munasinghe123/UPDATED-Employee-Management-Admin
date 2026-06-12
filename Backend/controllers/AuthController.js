
const bcrypt = require('bcrypt');
const db = require('../config/db-config');
const jwt = require('jsonwebtoken')

const login = async (req, res) => {
    try {

        console.log("login endpoint hit");
        const { employeeId, password } = req.body;

        if (!employeeId || !password) {
            return res.status(400).json({ message: 'Missing credentials' });
        }

        const [rows] = await db.query(
            `
        SELECT 
          e.employeeId,
          e.name,
          e.password,
          e.role
        FROM admin e
        WHERE e.employeeId = ?
      `,
            [employeeId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No such user' });
        }

        const user = rows[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const accessToken = jwt.sign(
            {
                employeeId: user.employeeId,
                name: user.name,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,        //  must be false in localhost
            sameSite: "lax"       //  important for cross-origin
        });

        res.status(200).json({ accessToken });

        console.log('Login successful');

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const register = async (req, res) => {
    try {
        console.log("register endpoint hit");
        const { name, email, password, employeeId } = req.body;

        const role = "admin"

        // console.log(req.body);

        if (!name || !password || !employeeId || !role || !email) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const [existingUser] = await db.query('SELECT employeeId,email FROM admin WHERE employeeId=? OR email=?', [employeeId, email]);
        console.log("existingUser:", existingUser);

        const error = {}

        existingUser.forEach(user => {

            if (user.email === email) {
                error.email = "Email already exixts"
            }

            if (user.employeeId === employeeId) {
                error.employeeId = "Employee Id already exists"
            }
        });
        if (Object.keys(error).length > 0) {
            return res.status(409).json({ error });
        }

        // if (existingUser.length > 0) {
        //     return res.status(409).json({ message: 'User already exists' });
        // }


        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            'INSERT INTO admin (name,email,password,employeeId,role) VALUES (?,?,?,?,?)',
            [name, email, hashedPassword, employeeId, role]
        );

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error("REGISTER ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

const checkToken = async (req, res) => {
    try {
        // console.log("COOKIES:", req.cookies);
        const accessToken = req.cookies.accessToken;
        // console.log("token check, ", accessToken);
        if (!accessToken) return res.status(401).json({ message: "No token found" });

        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        res.status(200).json({ accessToken });
    } catch (err) {
        console.log(err);
        res.status(401).json({ message: "Invalid or expired token" });
    }
}


const logoutUser = (req, res) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    });
    return res.status(200).json({ message: 'Logout successful' });
};

const editAccount = async (req, res) => {
    const { id } = req.params
    const { name, password } = req.body

    try {

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);

            await db.query(
                "UPDATE admin SET password=? WHERE employeeId=?",
                [hashedPassword, id]
            )
        } else{
            await db.query(
                "UPDATE admin SET name=? WHERE employeeId=?",
                [name, id]
            )
        }

        res.json({ message: "Updated successfully" })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}


module.exports = { register, login, checkToken, logoutUser, editAccount }