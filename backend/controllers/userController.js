import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import razorpay from "razorpay";
import validator from "validator";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModel.js";

// API to register user



const registerUser = async (req, res) => {

    try {

        const { name, email, password, phone } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Please fill all the fields" });
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email format" });
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters long" });
        }

        // hashing user-password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const userData = {
            name,
            email,
            password: hashedPassword,
        }

        const newUser = new userModel(userData);
        const user = await newUser.save();


        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET);

        res.json({ success: true, message: "User registered successfully", user, token });

    } catch (err) {
        console.error(err);
        res.json({ success: false, message: "error", error: err.message });
    }
}

//  API for user login

const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        // comparing password with hashed password

        const isPasswordValid = await bcrypt.compare(password, user.password);
        // if(!isPasswordValid) {
        //     return res.json({ success: false, message: "Invalid password" });
        // }
        // generating JWT token

        if (isPasswordValid) {
            const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET);
            res.json({ success: true, message: "User logged in successfully", user, token });
        }
        else {
            res.json({ success: false, message: "Invalid password" });
        }


    } catch (error) {
        console.error(err);
        res.json({ success: false, message: "error", error: err.message });
    }
}

// api to get user profile data
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Use decoded token from middleware
        const userData = await userModel.findById(userId).select("-password");

        res.json({ success: true, userData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};


// api to update user profile data
const updateUserProfile = async (req, res) => {
    try {
        const { name, phone, address, dob, gender } = req.body;
        const userId = req.user.id; // Use decoded token from middleware
        const imagefile = req.file;

        if (!name || !phone || !address || !dob || !gender) {
            return res.json({ success: false, message: "Please fill all the fields" });
        }

        const updatedFields = {
            name,
            phone,
            address: JSON.parse(address),
            dob,
            gender
        };

        if (imagefile) {
            const imageUpload = await cloudinary.uploader.upload(imagefile.path, {
                resource_type: "image"
            });
            updatedFields.image = imageUpload.secure_url;
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $set: updatedFields },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: "User profile updated successfully", user: updatedUser });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};






// api to book appointment:

const bookAppointment = async (req, res) => {

    try {

        const userId = req.user.id; // Use decoded token from middleware
        const { docId, slotDate, slotTime } = req.body;

        // get doctor data
        const docData = await doctorModel.findById(docId).select("-password");

        if (!docData) {
            return res.json({ success: false, message: "Doctor not found" });
        }

        let slots_booked = docData.slots_booked;

        // checking for slot availability

        if (slots_booked[slotDate]) {
            // if slot is already booked
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: "slot is not available" });
            }
            else {
                slots_booked[slotDate].push(slotTime);
            }
        }
        // if slot is not booked yet
        else {
            slots_booked[slotDate] = [slotTime];
        }


        const userData = await userModel.findById(userId).select("-password");

        delete docData.slots_booked; // Remove slots_booked from doctor data

        // create appointment data
        const appointmentData = {
            userId,
            doctorId: docId,
            slotDate,
            slotTime,
            userData,
            docData,
            amount: docData.fees,
            date: Date.now(), // Current date in YYYY-MM-DD format
        }

        // create appointment model
        const newAppointment = new appointmentModel(appointmentData);
        // save appointment in db
        await newAppointment.save();


        // save new slots_booked in doctor data:
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: "Appointment booked successfully" });


    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }

}




// api to ger user appointments for frontend my-appointmnets page

const listAppointments = async (req, res) => {

    try {

        const userId = req.user.id;
        // Fetch appointments for the user

        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments });


    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });

    }
}

// api to cancel appointment

const cancelAppointment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { appointmentId } = req.body;

        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        if (appointment.userId.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized to cancel this appointment" });
        }

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

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
// api to make payment of appointment using razorpay
const paymentRazorpay = async (req, res) => {

    try {
        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        // creating options for razorpay payment
        const options = {
            amount: appointmentData.amount * 100, // Amount in paise
            currency: process.env.CURRENCY,
            receipt: appointmentId,

        }

        // creating order in razorpay
        const order = await razorpayInstance.orders.create(options);

        res.json({ success: true, order });
    } catch (error) {
        console.error("Cancel Appointment Error:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }






}


// api to verify payment of razorpay
const verifyRazorpay = async (req, res) => {

    try {
        
        const {razorpay_order_id} = req.body;
        const  orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
        console.log(orderInfo);

        if (orderInfo.status=='paid') {
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
            res.json({ success: true, message: "Payment successfully" });
        }
        else{
            res.json({ success: false, message: "Payment failed" });
        }

    } catch (error) {
        console.error("Verify Razorpay Error:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}


export { bookAppointment, cancelAppointment, getUserProfile, listAppointments, loginUser, paymentRazorpay, registerUser, updateUserProfile, verifyRazorpay };

