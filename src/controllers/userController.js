import { getAllUsers, createUser, findUserById, updateUser, deleteUser, findUserByEmail,  } from '../repositories/userRepository.js';
// import { getAllUsers, createUser, findUserById, updateUser, deleteUser, findUserByEmail } from '../repositories/userRepository.js'; // Pending task: login user
import { comparePassword, hashPassword } from '../utils/authUtils.js'; 
import jwt from 'jsonwebtoken';

// Return all users
export const allUsers = async (req, res) => {
  const users = await getAllUsers();
  res.status(200).send(users); // Retorna o status code e os usuários
};

// Create new user
export const registerUser = async (req, res) => {
  const { name, email, password, role = "client" } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send({ message: 'Todos os campos são obrigatórios.' });
  };

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(400).send({ message: 'User already exists!' });
  };

  const hashedPassword = await hashPassword(password);
  await createUser({ name, email, password: hashedPassword, role });

  res.status(201).send({ message: 'User created successfully' });
};

// Found user
export const getUserProfile = async (req, res) => {
  const { id } = req.params;
  const user = await findUserById(id);
  if(!user){
    res.status(404).send({ message: 'User not found!' });
  };
  res.status(200).send(user); // Retorna o status code e os dados do usuario
};

// Update user
export const updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const existingUser = await findUserById(id);
  if (!existingUser) {
    return res.status(404).send({ message: 'User not found!' });
  };

  await updateUser(id, { name, email });

  res.status(200).send({ message: 'User updated successfully' });
}

// Delete user
export const deleteUserProfile = async (req, res) => {
  const { id } = req.params;
  const existingUser = await findUserById(id);
  if (!existingUser) {
    return res.status(404).send({ message: 'User not found!' });
  };
  await deleteUser(id);
  res.status(200).send({ message: 'User deleted successfully!' }); 
}
