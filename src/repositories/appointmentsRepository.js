import pool from "../database/db.js";

export const createAppointments = async (client_id, barber_id, service_id, date_time, status, created_by) => {
  await pool.query('INSERT INTO appointments (client_id, barber_id, service_id, date_time, status, created_by) VALUES (?, ?, ?, ?, ?, ?);', [client_id, barber_id, service_id, date_time, status, created_by])
}

export const getAllAppointments = async () => {
  const [rows] = await pool.query('SELECT * FROM appointments;')
  return rows.length > 0 ? rows : null;
} 

export const getUserAppointments = async (id, isClient) => {  
  const [rows] = await pool.query(`SELECT * FROM appointments WHERE ${isClient ? 'client_id' : 'barber_id'} = ?`, [id]);
  return rows.length > 0 ? rows : null;
}

export const putUserAppointments = async (id, isCLient, {client_id,barber_id, service_id, update_time, date_time} ) => {
  let setClause = '';
  let params = [];
  
  if (isCLient ? client_id : barber_id  !== null && isCLient ? client_id : barber_id !== undefined) {
    setClause += `${isCLient ? 'client_id = ?' : 'barber_id = ?'}`;
    params.push(isCLient ? client_id : barber_id);
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
  
  const query = `UPDATE appointments SET ${setClause} WHERE (${isCLient ? 'client_id = ?' : 'barber_id = ?'} AND date_time = ?)`;
  params.push(id, date_time);
  
  await pool.query(query, params);
}

export const deleteAppointments = async (id, isCLient, { date_time }) => {
  await pool.query(`DELETE FROM appointments WHERE (${isCLient ? 'client_id = ?' : 'barber_id = ?'} AND date_time = ?) `, [id, date_time]);
};