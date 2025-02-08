import pool from '../database/db.js';

export const createUser = async ({ name, email, password, role }) => {
  await pool.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [name, email, password, role]
  );
};

export const findUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT email, password_hash, role FROM users WHERE email = ?', [email]);
  return rows.length > 0 ? rows[0] : null; // Retorna o primeiro usuário encontrado ou null se não existir
};

export const findUserById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows.length > 0 ? rows[0] : null;
};

export const updateUser = async (id, {name, email} ) => {
  let setClause = '';
  let params = [];
  
  if (name !== null && name !== undefined) {
      setClause += 'name = ?, ';
      params.push(name);
  }
  
  if (email !== null && email !== undefined) {
      setClause += 'email = ?, ';
      params.push(email);
  }
  
  if (setClause.endsWith(', ')) {
      setClause = setClause.slice(0, -2);
  }
  
  if (setClause.length === 0) {
      throw new Error('No fields provided to update.');
  }
  
  const query = `UPDATE users SET ${setClause} WHERE id = ?`;
  params.push(id);
  
  await pool.query(query, params);
};

export const deleteUser = async (id) => {
  await pool.query('DELETE FROM users WHERE id = ?', [id]);
};

export const getAllUsers = async () => {
  const [rows] = await pool.query('SELECT name, email, role, created_at, updated_at FROM users');
  return rows.length > 0 ? rows : null;
}