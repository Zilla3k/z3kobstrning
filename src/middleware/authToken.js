import jwt from "jsonwebtoken";

export const authenticateAndVerify = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Access token is required!' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.is_active) {
      return res.status(403).send({ message: 'User not verified!' });
    }

    req.user = decoded;
  } catch (err) {
    return res.status(403).send({ message: 'Invalid or expired token!' });
  }
};

export const authorizeRoles = (allowedRoles) => {
  return async (req, reply) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return reply.status(403).send({ message: 'Access denied!' });
    }
  };
};
