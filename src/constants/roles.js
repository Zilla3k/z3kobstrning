export const Roles = Object.freeze({
  ADMIN: 'admin',
  DEVELOPER: 'developer',
  OWNER: 'owner',
  BARBER: 'barber',
  CLIENT: 'client',
});

export const PrivilegedRoles = Object.freeze([
  Roles.ADMIN,
  Roles.DEVELOPER,
]);

export const isPrivilegedRole = (role) => PrivilegedRoles.includes(role);
