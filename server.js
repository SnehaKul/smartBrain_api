const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const Clarifai = require('clarifai');
var knex = require('knex');

const register = require('./controllers/register');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'mysql',
  connection: {
    host : '127.0.0.1',
    user : 'root',
    password : 'test@123',
    database : 'smart_brain'
  }
});

db.select('*').from('users').then(data =>{
	console.log(data);
});
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res)=> { res.send(db.users) })
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})


app.post('/signin',(req,res)=>{
	const {email,password} = req.body;
	if(!email || !password){
		return res.status(400).json('incorrect form submission');
	}
	db.select('email','hash').from('login')
	.where('email','=',email)
	.then(data =>{
		const isValid = bcrypt.compareSync(password, data[0].hash);
		if(isValid){
			return db.select('*').from('users')
			.where('email','=',email)
			.then(user =>{
				res.json(user[0]);
			})
			.catch(err => res.status(400).json('unable to get user'));
		} else {
			res.status(400).json('Wrong credentials');
		}
		
	})
	.catch(err => res.status(400).json('wrong credentials'));
})


app.listen(3001, ()=>{
	console.log('app is running on port 3001');
});

/*
/ --> res = this is working
/signin --> POST = sucess/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user
*/