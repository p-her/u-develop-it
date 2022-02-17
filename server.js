const express = require('express');
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'fishB0n3#mysql',
        database: 'election'
    },
    console.log('Connected to the election database.')
);

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use((req, res) => {
    res.status(404).end();
});


// err, which is the error response, if there are no errors
// in the sql query, the err value is null

// rows, which is the database query response
db.query(`SELECT * FROM candidates`, (err, rows) => {
    console.log(rows);
});


db.query(`SELECT * FROM candidates WHERE  id = 1`, (err, row) => {
    if(err){
        console.log(err);
    }
    console.log(row);
})


// ? denotes a placeholder, making this a prepared statement
// a prepared statement can execute the same sql statements repeatedly using 
// different values in place of the placeholder
// affectedRows is 1 = meaning that only one row was affected by the DELETE command
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
//     if(err){
//         console.log(err);
//     }
//     console.log(result);
// })

const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
            VALUES (?, ?, ?, ?)`;
const params = [1, 'Ronald', 'Firbank', 1];

db.query(sql, params, (err, result) => {
    if(err){
        console.log(err);
    }
    console.log(result);
});




app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});