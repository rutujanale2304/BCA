const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully - server.js:17");
    })
    .catch((error) => {
        console.log("MongoDB Connection Error: - server.js:20", error.message);
    });

// Student Schema
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    course: {
        type: String,
        required: true,
    },
});

const Student = mongoose.model("Student", studentSchema);

// Home Route
app.get("/", (req, res) => {
    res.send("Practical 16 API is Running");
});

// CREATE Student
app.post("/students", async(req, res) => {
    try {
        const student = await Student.create(req.body);
        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// READ All Students
app.get("/students", async(req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE Student
app.put("/students/:id", async(req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body, { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json(student);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE Student
app.delete("/students/:id", async(req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Start Server
const PORT = process.env.PORT || 1500;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT} - server.js:103`);
});