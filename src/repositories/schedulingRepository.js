import pool from "../database/db.js";

export const createScheduling = async (client_id, barber_id, service_id, date_time, status, created_by) => {
  await pool.query('INSERT INTO appointments (client_id, barber_id, service_id, date_time, status, created_by) VALUES (?, ?, ?, ?, ?, ?);', [client_id, barber_id, service_id, date_time, status, created_by])
}

export const getAllScheduling = async () => {
  const [rows] = await pool.query('SELECT * FROM appointments;')
  return rows.length > 0 ? rows : null;
} 

export const findSchedulingByDate = async (date_time) =>{
  const [rows] = await pool.query('SELECT * FROM appointments WHERE date_time = ?', [date_time]);
  return rows.length > 0 ? rows : null;
}

export const getUserScheduling = async (id) => {
  const [rows] = await pool.query('SELECT * FROM appointments WHERE client_id = ?', [id]);
  return rows.length > 0 ? rows : null;
}

export const getBarberScheduling = async (id) => {
  const [rows] = await pool.query('SELECT * FROM appointments WHERE barber_id = ?', [id]);
  return rows.length > 0 ? rows : null;
}

export const putUserScheduling = async (id, {barber_id, service_id, update_time, date_time} ) => {
  let setClause = '';
  let params = [];
  
  if (barber_id !== null && barber_id !== undefined) {
      setClause += 'barber_id = ?, ';
      params.push(barber_id);
  }

  if (service_id !== null && service_id !== undefined) {
    setClause += 'service_id = ?, ';
    params.push(service_id);
}
  
  if (update_time !== null && update_time !== undefined) {
      setClause += 'date_time = ?, ';
      params.push(update_time);
  }
  
  if (setClause.endsWith(', ')) {
      setClause = setClause.slice(0, -2);
  }
  
  if (setClause.length === 0) {
      throw new Error('No fields provided to update.');
  }
  
  const query = `UPDATE appointments SET ${setClause} WHERE (client_id = ? AND date_time = ?)`;
  params.push(id, date_time);
  
  await pool.query(query, params);
}

export const putBarberScheduling = async (id, {client_id, service_id, update_time, date_time} ) => {
  let setClause = '';
  let params = [];
  
  if (client_id !== null && client_id !== undefined) {
      setClause += 'client_id = ?, ';
      params.push(client_id);
  }

  if (service_id !== null && service_id !== undefined) {
    setClause += 'service_id = ?, ';
    params.push(service_id);
}
  
  if (update_time !== null && update_time !== undefined) {
      setClause += 'date_time = ?, ';
      params.push(update_time);
  }
  
  if (setClause.endsWith(', ')) {
      setClause = setClause.slice(0, -2);
  }
  
  if (setClause.length === 0) {
      throw new Error('No fields provided to update.');
  }
  
  const query = `UPDATE appointments SET ${setClause} WHERE (barber_id = ? AND date_time = ? AND client_id = ?)`;
  params.push(id, date_time, client_id);
  
  await pool.query(query, params);
}

export const deleteScheduling = async (id, {date_time}) => {
  await pool.query('DELETE FROM appointments WHERE client_id = ? AND date_time = ?', [id, date_time]);
};