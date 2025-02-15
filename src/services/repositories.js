import * as userRepository from '../repositories/userRepository.js';
import * as barbershopRepository from '../repositories/barbershopRepository.js';
import * as appointmentsRepository from '../repositories/appointmentsRepository.js';
import * as authUtils from '../utils/authUtils.js';

export const repositories = {
  users: {
    createUser: userRepository.createUser,
    findUserByEmailForLogin: userRepository.findUserByEmailForLogin,
    findUserByEmail: userRepository.findUserByEmail,
    findUserById: userRepository.findUserById,
    findAuthUserById: userRepository.findAuthUserById,
    updateUser: userRepository.updateUser,
    deleteUser: userRepository.deleteUser,
    getAllUsers: userRepository.getAllUsers,
  },
  barbershops: {
    getAllBarbershop: barbershopRepository.getAllBarbershop,
    createBarbershop: barbershopRepository.createBarbershop,
    findBarbershopByName: barbershopRepository.findBarbershopByName,
    findBarbershopById: barbershopRepository.findBarbershopById,
    updateBarbershop: barbershopRepository.updateBarbershop,
    deleteBarbershop: barbershopRepository.deleteBarbershop,
  },
  appointments: {
    createAppointments: appointmentsRepository.createAppointments,
    getAllAppointments: appointmentsRepository.getAllAppointments,
    findAppointmentById: appointmentsRepository.findAppointmentById,
    updateAppointment: appointmentsRepository.updateAppointment,
    deleteAppointment: appointmentsRepository.deleteAppointment,
  },
  auth: {
    hashPassword: authUtils.hashPassword,
    comparePassword: authUtils.comparePassword,
  },
};
