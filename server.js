const app = require("express")();
const bodyParser = require("body-parser");
const db = require('./queries')

const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));

app.get('/users', db.getUsers);
app.get('/users/:id', db.getUserById);
app.post('/users', db.createUser);
app.put('/users/:id', db.updateUser);
app.delete('/users/:id', db.deleteUser);

app.listen(port, () => {
    db.pool.connect((err, res) => {
        if(err) {
            throw err;
        }
        console.log(`App is connected to db and running on port ${port}`);
    });
});