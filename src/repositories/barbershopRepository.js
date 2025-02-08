import pool from '../database/db.js';

export const getAllBarbershop = async (role) => {
  const [rows] = await pool.query(
    'SELECT name, address, phone, owner_id FROM barbershops');
  return rows.length > 0 ? rows : null;
};

export const createBarbershop = async ({ name, address, phone, owner_id }) => {
  const [rows] = await pool.query(
    'INSERT INTO barbershops (name, address, phone, owner_id) VALUES (?, ?, ?, ?)',
    [name, address, phone, owner_id]
  );
};

export const findBarbershopByName = async (name) => {
  const [rows] = await pool.query('SELECT name, address, phone FROM barbershops WHERE name = ?', [name]);
  return rows.length > 0 ? rows[0] : null; // Retorna o primeiro usuário encontrado ou null se não existir
};

export const findBarbershopByOwnerId = async (owner_id) => {
  const [rows] = await pool.query('SELECT * FROM barbershops WHERE owner_id = ?', [owner_id]);
  return rows.length > 0 ? rows : null; // Retorna o primeiro usuário encontrado ou null se não existir
};

export const updateBarbershop = async (owner_id, name, { address, phone} ) => {
  let setClause = '';
  let params = [];
  
  if (address !== null && address !== undefined) {
      setClause += 'address = ?, ';
      params.push(address);
  }
  
  if (phone !== null && phone !== undefined) {
      setClause += 'phone = ?, ';
      params.push(phone);
  }
  
  if (setClause.endsWith(', ')) {
      setClause = setClause.slice(0, -2);
  }
  
  if (setClause.length === 0) {
      throw new Error('No fields provided to update.');
  }
  
  const query = `UPDATE barbershops SET ${setClause} WHERE name = ? AND owner_id = ?`;
  params.push(name, owner_id);
  
  await pool.query(query, params);
};

export const deleteBarbershop = async (id,name) => {
  await pool.query('DELETE FROM barbershops WHERE (name = ? AND owner_id = ?)', [name,id]);
};
