import express from 'express';
import { LoginDoctor, appointmentCancel, appointmentCompleted, appointmentsDoctor, doctorDashboard, doctorList, doctorProfile, updateDoctorProfile } from '../controllers/doctorController.js';
import authDoctor from '../middlewares/authDoctor.js';


const doctorRouter = express.Router()

doctorRouter.get('/list', doctorList)
doctorRouter.post('/login', LoginDoctor)
doctorRouter.post('/complete-appointments', authDoctor, appointmentCompleted)
doctorRouter.post('/cancel-appointments', authDoctor, appointmentCancel)
doctorRouter.get('/appointments', authDoctor, appointmentsDoctor)
doctorRouter.get('/dashboard', authDoctor, doctorDashboard)
doctorRouter.get('/profile', authDoctor, doctorProfile)
doctorRouter.post('/update-profile', authDoctor, updateDoctorProfile)



export default doctorRouter;