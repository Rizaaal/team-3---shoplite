const express = require('express');
const router = express.Router();

const roles = {
  admin: "ADMIN",
  user: "USER"
}

const mockUsers = [
  { id: 1, username: "chick78", email: "chick@mail.com", password: "1234", role: roles.admin },
  { id: 2, username: "bizi99", email: "bizi@mail.com", password: "0000", role: roles.user }
];

// get all users
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users")
    const users = rows.map(({
      id, 
      name,
      last_name, 
      date_of_birth, 
      nationality 
    }) => ({
      id,
      name,
      lastName: last_name,
      dateOfBirth: date_of_birth,
      nationality
    }))
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server error: couldn't get users"})
  }
});

// add new user
router.post('/', async (req, res) => {
  try {
    const { name, lastName, dateOfBirth, nationality } = req.body;
    const [result] = await db.query("INSERT INTO user (name, last_name, date_of_birth, nationality) VALUES (?, ?, ?, ?)", 
      [name, lastName, dateOfBirth, nationality]
    )
    res.json({ id: result.insertId });
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "server error: couldn't update users" })
  }
});

// delete user by id
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.query("DELETE FROM users WEHRE id = ?", [id])
    res.json({ success: true })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error: couldn't remove user "})
  }
});

module.exports = {
  usersRouter: router,
  mockUsers
};

