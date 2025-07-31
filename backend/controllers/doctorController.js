import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";

const changeAvailability = async (req, res) => {
    try {

        const { docId } = req.body;

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, {
            available: !docData.available
        });
        res.json({ success: true, message: "Doctor availability updated successfully" });


    } catch (err) {
        console.error(err);
        res.json({ success: false, message: "Error in fetching doctors", error: err.message });
    }
}

const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email']);
        res.json({ success: true, doctors });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: "Error in fetching doctors", error: err.message });
    }
}


// api for doctor login

const LoginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body;
        const doctor = await doctorModel.findOne({ email });

        if (!doctor) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const isMatch = await bcrypt.compare(password, doctor.password);

        if (isMatch) {
            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Login failed", error: error.message });
    }
};


// api to get doctor appointments for doctor panel


const appointmentsDoctor = async (req, res) => {
    try {
        const docId = req.docId; // ✅ Get from middleware

        const appointments = await appointmentModel.find({ doctorId: docId });

        res.json({ success: true, appointments });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching appointments",
            error: error.message,
        });
    }
};

// api to mark appointment as completed by doctor
// appointmentCompleted
const appointmentCompleted = async (req, res) => {
    try {

        const { appointmentId } = req.body;
        const docId = req.docId;

        const appointment = await appointmentModel.findById(appointmentId);

        if (appointment && appointment.doctorId.toString() === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
            return res.json({ success: true, message: "Appointment marked as completed" });
        } else {
            return res.json({ success: false, message: "Appointment not found or does not belong to this doctor" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error marking appointment as completed",
            error: error.message
        });
    }
};


// to cancel appointment for doctor panel
// appointmentCancel
const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const docId = req.docId;

        const appointment = await appointmentModel.findById(appointmentId);

        if (appointment && appointment.doctorId.toString() === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, {
                cancelled: true
            });
            return res.json({ success: true, message: "Appointment cancelled" });
        } else {
            return res.json({ success: false, message: "Appointment not found or does not belong to this doctor" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error cancelling appointment",
            error: error.message
        });
    }
};

// api to get dashboard data for doctor panel

const doctorDashboard = async (req, res) => {
    try {
        const docId = req.docId; // ✅ Correctly assigned

        const appointments = await appointmentModel.find({ doctorId: docId });

        let earnings = 0;

        appointments.forEach((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount;
            }
        });

        let patients = [];

        appointments.forEach((item) => {
            if (!patients.includes(item.userId.toString())) {
                patients.push(item.userId.toString());
            }
        });

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.slice(-5).reverse()
        };

        res.json({ success: true, dashData });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching dashboard data", error: error.message });
    }
};


// api to get doctor profile

const doctorProfile = async (req, res) => {

    try {

        const docId = req.docId; // ✅ Get from middleware
        const profileData = await doctorModel.findById(docId).select(['-password']);

        res.json({ success: true, profileData });


    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching doctor profile", error: error.message });

    }
}

// api to update doctor profile data from doctor panel
const updateDoctorProfile = async (req, res) => {

    try {
        const docId = req.docId; // ✅ Get from middleware
        const { fees, address, available } = req.body;
        await doctorModel.findByIdAndUpdate(docId, {
            fees,
            address: {
                line1: address.line1,
                line2: address.line2,
            },
            available,
        });
        await doctorModel.findByIdAndUpdate(docId, { fees, address, available });
        res.json({ success: true, message: "Doctor profile updated successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error updating doctor profile", error: error.message });

    }
}


export {
    LoginDoctor, appointmentCancel,
    appointmentCompleted, appointmentsDoctor, changeAvailability,
    doctorDashboard, doctorList,
    doctorProfile, updateDoctorProfile
};

