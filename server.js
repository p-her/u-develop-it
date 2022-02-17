const express = require('express');
const mysql = require('mysql2');
const inputCheck = require('./utlis/inputCheck');

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





// err, which is the error response, if there are no errors
// in the sql query, the err value is null

// rows, which is the database query response
// db.query(`SELECT * FROM candidates`, (err, rows) => {
//     console.log(rows);
// });



// we assign the captured value populated in the req.params object
// with the key id to params.
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if(err){
            res.status(400).json({error: err.message});
            return;
        }

        res.json({
            message: 'success',
            data: row
        });
    });
});




// ? denotes a placeholder, making this a prepared statement
// a prepared statement can execute the same sql statements repeatedly using 
// different values in place of the placeholder
// affectedRows is 1 = meaning that only one row was affected by the DELETE command

app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if(err){
            res.statusMessage(400).json({ error: res.message});
        }else if(!result.affectedRows){
            // if there are no affectedRows as a result of the delete query, that means
            // that there was no candidate by that id
            res.json({
                messsage: 'Candidate not found'
            });
        }else{
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

// create a candidate
// we use object destructuring to pull the body property out of the
// request object, until now we've been passing the entire request object to
// the routes in the req parameter.
app.post('/api/candidate', ({body}, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if(errors){
        res.status(400).json({error: errors});
        return;
    }

    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
                VALUES (?, ?, ?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, result) =>{
        if(err){
            res.status(400).json({error: err.message});
            return ;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});

// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
//             VALUES (?, ?, ?, ?)`;
// const params = [1, 'Ronald', 'Firbank', 1];

// db.query(sql, params, (err, result) => {
//     if(err){
//         console.log(err);
//     }
//     console.log(result);
// });


app.get('/api/candidates', (req, res) => {
    const sql = `SELECT * FROM candidates`;

    db.query(sql, (err, rows) => {
        if(err){
            res.status(500).json({error: err.message});
            return;
        }

        res.json({
            message: 'success',
            data: rows
        });
    });
});





app.use((req, res) => {
    res.status(404).end();
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});