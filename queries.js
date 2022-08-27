const pool = require("./postgres");

const getEmployees = (_, res) => {
    pool.query('SELECT * FROM employees ORDER BY id ASC', 
    (err, result) => {
        if(err) {
            throw err;
        }
        res.status(200).json(result.rows);
    });
}

const getEmployeesByDepartment = (req, res) => {
    const id = parseInt(req.params.id);
    const {date1, date2} = req.body;

    pool.query("SELECT employees.name, employees.email, employees.salary, employees.bonus, employees.joining_date, departments.name AS department_name FROM employees join departments on employees.department_id = departments.id WHERE (joining_date BETWEEN $1 AND $2) AND employees.department_id = $3", [date1, date2, id] , 
    (err, result) => {
        if(err) {
            throw err;
        }
        res.status(200).json(result.rows);
    });
}

const getEmployee = (req, res) => {
    const id = parseInt(req.params.id);

    pool.query('SELECT employees.name, employees.email, employees.salary, employees.bonus, employees.joining_date, departments.name AS department_name FROM employees join departments on employees.department_id = departments.id WHERE employees.id = $1', [id], 
    (err, result) => {
        if(err) {
            throw err;
        }
        res.status(200).json(result.rows);
    });
}

const getDepartments = (_, res) => {
    pool.query('SELECT * FROM departments ORDER BY id ASC', 
    (err, result) => {
        if(err) {
            throw err;
        }
        res.status(200).json(result.rows);
    });
}

const createDepartment = (req, res) => {
    const { name } = req.body;

    pool.query('INSERT INTO departments (name) VALUES ($1) RETURNING *', [name],    
    (err, result) => {
        if (err) {
            throw err;
        }
        res.status(201).send(`Department added with ID: ${result.rows[0].id}`)
    })
}

const createEmployee = (req, res) => {
    const { name, email, salary, joining_date, department_id } = req.body;

    pool.query('INSERT INTO employees (name, email, salary, joining_date, department_id) VALUES ($1, $2, $3, $4, $5) RETURNING *', [name, email, salary, joining_date, department_id],    (err, result) => {
        if (err) {
            throw err;
        }
        res.status(201).send(`Employee added with ID: ${result.rows[0].id}`)
    })
}

const deleteEmployee = (req, res) => {
    const id = parseInt(req.params.id);

    pool.query('DELETE FROM employees WHERE id = $1', [id],
    (err, _result) => {
        if (err) {
            throw err;
        }
        res.status(201).send(`Employee deleted with ID: ${id}`)
    });
}

const deleteDepartment = (req, res) => {
    const id = parseInt(req.params.id);

    pool.query('DELETE FROM departments WHERE id = $1 AND no_of_employees = 0', [id],
    (err, _result) => {
        if (err) {
            throw err;
        }
        res.status(201).send(`Department deleted with ID: ${id}`)
    });
}

module.exports = {
    getEmployee,
    getEmployees,
    getEmployeesByDepartment,
    getDepartments,
    createDepartment,
    createEmployee,
    deleteEmployee,
    deleteDepartment,
    pool,
};


