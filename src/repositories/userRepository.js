import pool from '../database/db.js';

// Create new user
export const createUser = async ({ name, email, password, role }) => {
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [name, email, password, role]
  );
  return { id: result.insertId, name, email, role };
};

// Find user by email
export const findUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

// Find user by id
export const findUserById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
};

// Update user
export const updateUser = async (id, {name, email} ) => {
  await pool.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);
  return { id, name, email };
};

// Delete user
export const deleteUser = async (id) => {
  await pool.query('DELETE FROM users WHERE id = ?', [id]);
};

// Return all users
export const getAllUsers = async () => {
  const [result] = await pool.query('SELECT name, email, role, created_at, updated_at FROM users');
  return result;
}