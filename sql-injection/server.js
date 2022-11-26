const express = require('express');
const app = express();
const port = 8080;
const { Client } = require('pg');


app.use(express.static('static'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

const client = new Client({
    user: 'admin',
    host: 'localhost',
    database: 'postgres',
    password: 'admin',
    port: 5432,
});
client.connect();





app.get('/', (req, res) => {
  res.send('SQli 101! <br/> 1: <a href="/login.html">login</a>')
})

app.post('/signin', async (req, res) => {
    let login = req.body.name;
    let pass = req.body.pass;
    let banned = req.body.banned;
    let sql = "SELECT name as result FROM users WHERE name = '" + login + "' AND pass = '" + pass + "'";
    //let sql = {
    //    text: "SELECT name as result FROM users WHERE name = $1 AND pass = $2 AND banned = $3",
    //   values: [login, pass, banned]
    //};
    try{
        let data = await client.query(sql);
        if(data.rows.length>0 && data.rows[0].result){
            res.send(`success ${data.rows[0].result}`);
        }else
        {
            res.send(`fail ${login}`);
        }
    }
    catch(e)
    {
        console.log(e);
        res.send(`error ${e.message}. <br/> SQL:${sql}`);
    }

  })


app.listen(port, ()=>{
	console.log(`server running at http://localhost:${port}`);
})
