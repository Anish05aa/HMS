import express from 'express';
import { Appointmentcancel, addDoctor, adminDashboard, allDoctors, appointmentsAdmin, loginAdmin } from '../controllers/adminController.js';
import { changeAvailability } from '../controllers/doctorController.js';
import authAdmin from '../middlewares/authAdmin.js';
import upload from '../middlewares/multer.js';

const adminRouter = express.Router();

adminRouter.post('/add-doctor',authAdmin, upload.single('image'), addDoctor);
adminRouter.post('/login', loginAdmin);
adminRouter.get('/all-doctors',authAdmin, allDoctors);
adminRouter.post('/change-availability',authAdmin, changeAvailability);
adminRouter.get('/all-appointments',authAdmin, appointmentsAdmin);
adminRouter.post('/cancel-appointment',authAdmin, Appointmentcancel);
adminRouter.get('/dashboard',authAdmin, adminDashboard);

export default adminRouter;
// This code sets up an Express router for admin-related routes, specifically for adding a doctor.