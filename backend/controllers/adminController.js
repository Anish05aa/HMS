// api for adding doctor

import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import validator from "validator";
import connectCloudinary from "../config/cloudinary.js";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModel.js";

connectCloudinary();

// Function to add a doctor
const addDoctor = async (req, res) => {
    try {
        const { name, password, speciality, email, experience, about, fees, address } = req.body;
        const imageFile = req.file;
        // console.log({name, password, image, speciality, email, experience, about, fees, address},imageFile);

        // checking for all data to add doctor
        if (!name || !password || !imageFile || !speciality || !email || !experience || !about || !fees || !address) {
            return res.json({ message: "Please fill all the fields", success: false });
        }

        //validating email format
        if (!validator.isEmail(email)) {
            return res.json({ message: "Invalid email format", success: false });
        }

        //validating strong password
        if (password.length < 8) {
            return res.json({ message: "Password must be at least 8 characters long", success: false });
        }

        //hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // upload image to cloudinary
        const imageupload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageUrl = imageupload.secure_url;

        const doctorData = {
            name,
            password: hashedPassword,
            image: imageUrl,
            speciality,
            email,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        };

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save();

        res.json({ success: true, message: "Doctor added successfully", doctor: newDoctor });

    } catch (err) {
        console.error(err);
        res.json({ success: false, message: "Error in adding doctor", error: err.message });
    }

}

// API for admin login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("Login attempt:", {
            received: { email, password },
            expected: {
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD
            }
        });

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(
                { email: email }, // Payload
                process.env.JWT_SECRET,
                { expiresIn: '24h' } // Recommended to add expiration
            );

            console.log("Generated token:", token);
            return res.status(200).json({
                success: true,
                token: token,
                message: "Login successful"
            });
        }

        return res.status(401).json({
            success: false,
            message: "Invalid credentials"
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error during login",
            error: error.message
        });
    }
};


// API to get all doctor list for admin panel
const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password');
        res.json({ success: true, doctors });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: "Error in fetching doctors", error: err.message });
    }
}

// api to get all appointments list for admin panel
const appointmentsAdmin=async (req, res) => {

    try {
        
        const appointments =await appointmentModel.find({})
        res.json    ({ success: true, appointments });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error in fetching appointments", error: error.message });
    }
}

// to cancel the appointment for admin
const Appointmentcancel = async (req, res) => {
    try {
        // const userId = req.user.id;
        const { appointmentId } = req.body;

        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        // if (appointment.userId.toString() !== userId.toString()) {
        //     return res.status(403).json({ success: false, message: "Unauthorized to cancel this appointment" });
        // }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        const { doctorId, slotDate, slotTime } = appointment;

        if (doctorId) {
            const doctorData = await doctorModel.findById(doctorId);
            if (doctorData) {
                let slots_booked = doctorData.slots_booked || {};

                if (slots_booked[slotDate]) {
                    slots_booked[slotDate] = slots_booked[slotDate].filter(slot => slot !== slotTime);

                    if (slots_booked[slotDate].length === 0) {
                        delete slots_booked[slotDate];
                    }

                    await doctorModel.findByIdAndUpdate(doctorId, { slots_booked });
                }
            }
        }

        return res.json({ success: true, message: "Appointment cancelled successfully" });

    } catch (error) {
        console.error("Cancel Appointment Error:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// api to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {
        
        const doctors =await doctorModel.find({})
        const user =await userModel.find({})
        
        const appointments = await appointmentModel.find({});


        const dashData={
            doctors:doctors.length,
            appointments:appointments.length,
            patients:user.length,
            latestAppointments:appointments.reverse().slice(0,5)

        }

        return res.json({ success: true, dashData});

    } catch (error) {
        console.error("Cancel Appointment Error:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};



export { Appointmentcancel, addDoctor, adminDashboard, allDoctors, appointmentsAdmin, loginAdmin };

