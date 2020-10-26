const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: '913cb9233b66433aa7c6901b49e70c0e'
});
const handleapiCall = (req,res) =>{
  app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
  .then(data =>{
    res.json(data);
  })
  .catch(err => res.status(400).json('unable to work with api'));
}


const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0]);
  })
  .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
  handleImage,
  handleapiCall
  
}