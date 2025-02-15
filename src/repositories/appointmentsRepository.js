import pool from "../database/db.js";

export const createAppointments = async (client_id, barber_id, service_id, date_time, status, created_by) => {
  const [result] = await pool.query(
    'INSERT INTO appointments (client_id, barber_id, service_id, date_time, status, created_by) VALUES (?, ?, ?, ?, ?, ?)',
    [client_id, barber_id, service_id, date_time, status, created_by]
  );
  return result;
}

export const getAllAppointments = async () => {
  const [rows] = await pool.query(
    `SELECT
      id,
      client_id,
      barber_id,
      service_id,
      date_time,
      status,
      created_by,
      created_at,
      updated_at
     FROM appointments`
  );
  return rows;
} 

export const findAppointmentById = async (id) => {
  const [rows] = await pool.query(
    `SELECT
      id,
      client_id,
      barber_id,
      service_id,
      date_time,
      status,
      created_by,
      created_at,
      updated_at
     FROM appointments
     WHERE id = ?`,
    [id]
  );
  return rows.length > 0 ? rows[0] : null;
}

export const updateAppointment = async (id, data) => {
  const fields = [];
  const values = [];

  if (data.client_id !== undefined) {
    fields.push('client_id = ?');
    values.push(data.client_id);
  }

  if (data.barber_id !== undefined) {
    fields.push('barber_id = ?');
    values.push(data.barber_id);
  }

  if (data.service_id !== undefined) {
    fields.push('service_id = ?');
    values.push(data.service_id);
  }

  if (data.date_time !== undefined) {
    fields.push('date_time = ?');
    values.push(data.date_time);
  }

  if (data.status !== undefined) {
    fields.push('status = ?');
    values.push(data.status);
  }

  if (data.created_by !== undefined) {
    fields.push('created_by = ?');
    values.push(data.created_by);
  }

  if (fields.length === 0) {
    throw new Error('No fields provided for update');
  }

  values.push(id);

  const [result] = await pool.query(
    `UPDATE appointments
     SET ${fields.join(', ')}
     WHERE id = ?`,
    values
  );

  return result;
}

export const deleteAppointment = async (id) => {
  const [result] = await pool.query('DELETE FROM appointments WHERE id = ?', [id]);
  return result;
};
