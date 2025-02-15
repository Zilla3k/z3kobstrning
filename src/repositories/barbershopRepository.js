import pool from '../database/db.js';

export const getAllBarbershop = async () => {
  const [rows] = await pool.query(
    `SELECT
      id,
      name,
      address,
      phone,
      owner_id,
      created_at,
      updated_at
     FROM barbershops`
  );
  return rows;
};

export const createBarbershop = async ({ name, address, phone, owner_id }) => {
  const [result] = await pool.query(
    'INSERT INTO barbershops (name, address, phone, owner_id) VALUES (?, ?, ?, ?)',
    [name, address, phone, owner_id]
  );
  return result;
};

export const findBarbershopByName = async (name) => {
  const [rows] = await pool.query(
    `SELECT id, name, address, phone, owner_id, created_at, updated_at
     FROM barbershops
     WHERE name = ?`,
    [name]
  );
  return rows.length > 0 ? rows[0] : null;
};

export const findBarbershopById = async (id) => {
  const [rows] = await pool.query(
    `SELECT id, name, address, phone, owner_id, created_at, updated_at
     FROM barbershops
     WHERE id = ?`,
    [id]
  );
  return rows.length > 0 ? rows[0] : null;
};

export const updateBarbershop = async (id, data) => {
  const fields = [];
  const values = [];

  if (data.name !== undefined) {
    fields.push('name = ?');
    values.push(data.name);
  }

  if (data.address !== undefined) {
    fields.push('address = ?');
    values.push(data.address);
  }

  if (data.phone !== undefined) {
    fields.push('phone = ?');
    values.push(data.phone);
  }

  if (fields.length === 0) {
    throw new Error('No fields provided for update');
  }

  values.push(id);

  const [result] = await pool.query(
    `UPDATE barbershops
     SET ${fields.join(', ')}
     WHERE id = ?`,
    values
  );

  return result;
};

export const deleteBarbershop = async (id) => {
  const [result] = await pool.query('DELETE FROM barbershops WHERE id = ?', [id]);
  return result;
};
