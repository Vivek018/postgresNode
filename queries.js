const Pool = require("pg").Pool;

const pool = new Pool({
    user: "me",
    host: "localhost",
    database: "api",
    password: "password",
    port: 5432,
});

const getUsers = (_, res) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', 
    (err, result) => {
        if(err) {
            throw err;
        }
        res.status(200).json(result.rows);
    });
}

const getUserById = (req, res) => {
    const id = parseInt(req.params.id);

    pool.query('SELECT * FROM users WHERE id = $1', [id], 
    (err, result) => {
        if (err) {
            throw err;
        }
        res.status(200).json(result.rows);
    });
}

const createUser = (req, res) => {
    const { name, email } = req.body;

    pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email],    (err, result) => {
        if (err) {
            throw err;
        }
        res.status(201).send(`User added with ID: ${result.rows[0].id}`)
    })
}

const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const { name, email } = req.body;

    pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [name, email, id],
    (err, result) => {
        if (err) {
            throw err;
        }
        res.status(201).send(`User updated with ID: ${result.rows[0].id}`)
    });
}

const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);

    pool.query('DELETE FROM users WHERE id = $1', [id],
    (err, _result) => {
        if (err) {
            throw err;
        }
        res.status(201).send(`User deleted with ID: ${id}`)
    });
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    pool,
};

