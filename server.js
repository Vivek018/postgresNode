const app = require("express")();
const bodyParser = require("body-parser");
const db = require('./queries')

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));

app.get('/employee/:id', db.getEmployee);
app.get('/employeesByDepartment/:id', db.getEmployeesByDepartment);
app.get('/employees', db.getEmployees);
app.get('/departments', db.getDepartments);
app.post('/employee', db.createEmployee);
app.post('/department', db.createDepartment);
app.delete('/employee/:id', db.deleteEmployee);
app.delete('/department/:id', db.deleteDepartment);

app.listen(port, () => {
    db.pool.connect((err, _res) => {
        if(err) {
            throw err;
        }
        console.log(`App is connected to db and running on port ${port}`);
    });
});