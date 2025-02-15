const idParamSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['id'],
  properties: {
    id: { type: 'integer', minimum: 1 },
  },
};

const nameSchema = { type: 'string', minLength: 1 };
const emailSchema = { type: 'string', format: 'email' };
const passwordSchema = { type: 'string', minLength: 6 };

export const userCreateSchema = {
  body: {
    type: 'object',
    additionalProperties: false,
    required: ['name', 'email', 'password'],
    properties: {
      name: nameSchema,
      email: emailSchema,
      password: passwordSchema,
    },
  },
  response: {
    201: {
      type: 'object',
      additionalProperties: false,
      properties: {
        message: { type: 'string' },
      },
    },
  },
};

export const userLoginSchema = {
  body: {
    type: 'object',
    additionalProperties: false,
    required: ['email', 'password'],
    properties: {
      email: emailSchema,
      password: { type: 'string', minLength: 1 },
    },
  },
  response: {
    200: {
      type: 'object',
      additionalProperties: false,
      properties: {
        message: { type: 'string' },
        accessToken: { type: 'string' },
      },
    },
  },
};

export const userUpdateSchema = {
  params: idParamSchema,
  body: {
    type: 'object',
    additionalProperties: false,
    minProperties: 1,
    properties: {
      name: nameSchema,
      email: emailSchema,
    },
  },
};

export const userIdParamsSchema = {
  params: idParamSchema,
};

export const barbershopCreateSchema = {
  body: {
    type: 'object',
    additionalProperties: false,
    required: ['name', 'address', 'phone'],
    properties: {
      name: nameSchema,
      address: nameSchema,
      phone: { type: 'string', minLength: 3 },
    },
  },
};

export const barbershopUpdateSchema = {
  params: idParamSchema,
  body: {
    type: 'object',
    additionalProperties: false,
    minProperties: 1,
    properties: {
      name: nameSchema,
      address: nameSchema,
      phone: { type: 'string', minLength: 3 },
    },
  },
};

export const appointmentCreateSchema = {
  body: {
    type: 'object',
    additionalProperties: false,
    required: ['barber_id', 'service_id', 'date_time', 'status'],
    properties: {
      barber_id: { type: 'integer', minimum: 1 },
      service_id: { type: 'integer', minimum: 1 },
      date_time: { type: 'string', format: 'date-time' },
      status: {
        type: 'string',
        enum: ['scheduled', 'confirmed', 'completed', 'cancelled'],
      },
    },
  },
};

export const appointmentUpdateSchema = {
  params: idParamSchema,
  body: {
    type: 'object',
    additionalProperties: false,
    minProperties: 1,
    properties: {
      barber_id: { type: 'integer', minimum: 1 },
      service_id: { type: 'integer', minimum: 1 },
      date_time: { type: 'string', format: 'date-time' },
      status: {
        type: 'string',
        enum: ['scheduled', 'confirmed', 'completed', 'cancelled'],
      },
    },
  },
};

export const appointmentIdParamsSchema = {
  params: idParamSchema,
};

export const okMessageSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    message: { type: 'string' },
  },
};
