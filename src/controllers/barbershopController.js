import {
  getAllBarbershop,
  createBarbershop,
  findBarbershopByName,
  findBarbershopByOwnerId,
  updateBarbershop,
  deleteBarbershop
} from '../repositories/barbershopRepository.js'

export const allBarbershop = async (req, res) => { 
  const barbershops = await getAllBarbershop();
  res.status(200).send({barbershops});
}; 

// Create new Barbershop
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

// Found Barbershop
export const getBarbershopProfile = async (req, res) => {
  const { owner_id } = req.params;
  const barbershop = await findBarbershopByOwnerId(owner_id);
  if(!barbershop){
    res.status(404).send({ message: 'Barbershop not found!' });
  };
  res.status(200).send(barbershop);
};

// Update Barbershop
export const updateBarbershopProfile = async (req, res) => {
  const { owner_id } = req.params;
  const { name, address, phone } = req.body;

  const barbershopName = await findBarbershopByName(name);
  const barbershopOwner = await findBarbershopByOwnerId(owner_id);

  if(!barbershopOwner || !barbershopName){
    res.status(404).send({ message: 'Barbershop not found!' });
  };

  const updateData = {};
  if (address !== null) {
    updateData.address = address;
  }
  if (phone !== null) {
    updateData.phone = phone;
  }

  await updateBarbershop(owner_id, name, updateData);

  res.status(200).send({message: 'Barbershop updated successfully' });
};

// Delete Barbershop
export const deleteBarbershopProfile = async (req, res) => {
  const { owner_id } = req.params;
  const { name } = req.body;

  const barbershopOwner = await findBarbershopByOwnerId(owner_id);
  const barbershopName = await findBarbershopByName(name);

  if(!barbershopOwner || !barbershopName){
    res.status(404).send({ message: 'Barbershop not found!' });
  };

  await deleteBarbershop(owner_id, name);

  res.status(200).send({message: 'Barbershop deleted successfully' });
};
