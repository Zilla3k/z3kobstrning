import pool from '../database/db.js';

export const createUser = async ({ name, email, password }) => {
  return pool.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, "client")',
    [name, email, password]
  );
};

export const findUserByEmailForLogin = async (email) => {
  const [rows] = await pool.query(
    `SELECT id, name, email, password_hash, role, is_active, created_at, updated_at
     FROM users
     WHERE email = ?`,
    [email]
  );
  return rows.length > 0 ? rows[0] : null;
};

export const findUserById = async (id) => {
  const [rows] = await pool.query(
    `SELECT
      id,
      name,
      email,
      role,
      is_active,
      created_at,
      updated_at
     FROM users
     WHERE id = ?`,
    [id]
  );
  return rows.length > 0 ? rows[0] : null;
};

export const findAuthUserById = async (id) => {
  const [rows] = await pool.query(
    `SELECT id, role, is_active
     FROM users
     WHERE id = ?`,
    [id]
  );
  return rows.length > 0 ? rows[0] : null;
};

export const updateUser = async (id, data) => {
  const fields = [];
  const values = [];

  if (data.name !== undefined) {
    fields.push('name = ?');
    values.push(data.name);
  }

  if (data.email !== undefined) {
    fields.push('email = ?');
    values.push(data.email);
  }

  if (fields.length === 0) {
    throw new Error('No fields provided for update');
  }

  values.push(id);

  const [result] = await pool.query(
    `UPDATE users
     SET ${fields.join(', ')}
     WHERE id = ?`,
    values
  );

  return result;
};

export const getAllUsers = async () => {
  const [rows] = await pool.query(
    `SELECT
      id,
      name,
      email,
      role,
      is_active,
      created_at,
      updated_at
     FROM users`
  );
  return rows;
};

export const deleteUser = async (id) => {
  const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
  return result;
};

export const findUserByEmail = findUserByEmailForLogin;
