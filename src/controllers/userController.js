import { getAllUsers, createUser, findUserById, updateUser, deleteUser, findUserByEmail  } from '../repositories/userRepository.js';
import { comparePassword, hashPassword } from '../utils/authUtils.js'; 
import jwt from 'jsonwebtoken';

export const allUsers = async (req, res) => {
  const users = await getAllUsers();
  res.status(200).send(users);
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    res.status(400).send({ message: 'Provide all mandatory data!' });
  }

  const user = await findUserByEmail(email);
  if (!user) {
    res.status(401).send({ message: 'Email or password incorrect!' });
  }

  const verifyPassword = await comparePassword(password, user.password_hash);
  if (!verifyPassword) {
    res.status(401).send({ message: 'Email or password incorrect!' });
  }

   if (!user.is_active) { return res.status(403).send({ message: 'Account not verified!' });
  }

  const accessToken = jwt.sign({ email: user.email, role: user.role, is_active: user.is_active }, process.env.JWT_SECRET, { expiresIn: '5m' });

  res.header('Authorization', `Bearer ${accessToken}`)
  res.status(200).send({ message: 'Login successful!', accessToken});
};

export const registerUser = async (req, res) => {
  const { name, email, password} = req.body;

  if (!name || !email || !password) {
    return res.status(400).send({ message: 'Provide all mandatory data!' });
  };

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(400).send({ message: 'User already exists!' });
  };

  const hashedPassword = await hashPassword(password);

  await createUser({ name, email, password: hashedPassword});

  res.status(201).send({  message: 'User created successfully' });
};

export const getUserProfile = async (req, res) => {
  const { id } = req.params;
  const user = await findUserById(id);
  
  console.log()
  if(!user){
    res.status(404).send({ message: 'User not found!' });
  };
  res.status(200).send(user);
};

export const updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const existingUser = await findUserById(id);
  if (!existingUser) {
    return res.status(404).send({ message: 'User not found!' });
  };

  await updateUser(id, { name, email });

  res.status(200).send({ message: 'User updated successfully' });
};

export const deleteUserProfile = async (req, res) => {
  const { id } = req.params;
  const existingUser = await findUserById(id);
  if (!existingUser) {
    return res.status(404).send({ message: 'User not found!' });
  };
  await deleteUser(id);
  res.status(200).send({ message: 'User deleted successfully!' }); 
};
