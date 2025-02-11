import {
  getAllBarbershop,
  createBarbershop,
  findBarbershopByName,
  updateBarbershop,
  deleteBarbershop,
  findOwnerById
} from '../repositories/barbershopRepository.js'

export const allBarbershop = async (req, res) => { 
  const barbershops = await getAllBarbershop();
  res.status(200).send(barbershops);
}; 

export const registerBarbershop = async (req, res) => {
  const { name, address, phone, owner_id} = req.body;
  if (!name || !address || !phone || !owner_id) {
    return res.status(400).send({ message: 'Provide all mandatory data!' });
  };
  const existingBarbershop = await findBarbershopByName(name);
  if (existingBarbershop) {
    return res.status(400).send({ message: 'Barbershop already exists!' });
  };
  await createBarbershop({ name, address, phone, owner_id});
  res.status(201).send({ message: 'Barbershop created successfully' });
};

export const getBarbershopProfile = async (req, res) => {
  const { id } = req.params;
  const user = await findOwnerById(id);
  if(!user){
    res.status(404).send({ message: 'Barbershop not found!' });
  };
  res.status(200).send(user);
};

export const updateBarbershopProfile = async (req, res) => {
  const { id } = req.params;
  const { name, address, phone } = req.body;
  const barbershopName = await findBarbershopByName(name);
  const user = await findOwnerById(id);
  if(!user || !barbershopName){
    res.status(404).send({ message: 'Barbershop not found!' });
  };
  const updateData = {};
  if (address !== null) {
    updateData.address = address;
  }
  if (phone !== null) {
    updateData.phone = phone;
  }
  await updateBarbershop(id, name, updateData);
  res.status(200).send({message: 'Barbershop updated successfully' });
};

export const deleteBarbershopProfile = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const user = await findOwnerById(id);
  const barbershopName = await findBarbershopByName(name);
  if (!user || !barbershopName) {
    return res.status(404).send({ message: 'Barbershop not found!' });
  }
  if (id != barbershopName.owner_id) {
    res.status(403).send({ message: 'Operation forbidden!' });
  }
  await deleteBarbershop(id, name);
  res.status(200).send({ message: 'Barbershop deleted successfully' });
}; 
