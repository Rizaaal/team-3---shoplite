const roles = {
  admin: 'ADMIN',
  user: 'USER',
};

const mockUsers = [
  { id: 1, username: 'chick78', email: 'chick@mail.com', password: '1234', role: roles.admin },
  { id: 2, username: 'bizi99', email: 'bizi@mail.com', password: '0000', role: roles.user },
];

module.exports = {
  mockUsers,
  roles,
};
