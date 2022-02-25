// Define needed frameworks
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
const path = require('path');
const fs = require('fs');

// Parse application/json
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Server listening
app.listen(5000, () => {
  console.log('Server started on port 5000...');
});

// Routing
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'indexModelling.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'indexPrediction.html'));
});

// Escape from the CORS Errors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

const multer = require('multer');

// Destination of the uploaded image with a new name
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'FILL HERE WITH THE PATH OF ......htdocs//CPS//.... FOR STIMULI IMAGE SAVING FILE');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

// Accept only image type inputs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Store the image
const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

// Make the destination folder static to access directly
app.use(express.static('model-image'));

// Create database connection
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'cps'
});

// Connect to database
con.connect((err) => {
  if (err) throw err;
  console.log('Mysql Connected...');
});

// Show all models
app.get('/models', (req, res) => {
  let sql = "SELECT * FROM models";
  let query = con.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify(results));
  });
});

// Show single model
app.get('/models/:model_name', (req, res) => {
  let sql = "SELECT * FROM models WHERE model_name=" + "\"" + req.params.model_name + "\"";
  let query = con.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify(results));
  });
});

// Add new row and store the image
app.post('/newModel', upload.single('mymodel_image'), (req, res) => {
  console.log(JSON.stringify(req.file));
  let data = {
    width: req.body.width,
    height: req.body.height,
    image_path: req.file.path,
    model_name: req.body.model_name,
    stimuli_name: req.body.stimuli_name,
    grid_x: req.body.grid_x,
    grid_y: req.body.grid_y,
    autistic_path: req.body.autistic_path,
    control_path: req.body.control_path,
    flag: req.body.flag,
    description: req.file.filename
  };
  let sql = "INSERT INTO models SET ?";
  let query = con.query(sql, data, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({
      "status": 200,
      "error": null,
      "response": results
    }));
  });
});

// Delete row with ID
app.delete('/modelRemove/:model_name', (req, res) => {
  let sql = "DELETE FROM models WHERE model_name=" + "\"" + req.params.model_name + "\"";
  let query = con.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({
      "status": 200,
      "error": null,
      "response": results
    }));
  });
});

// Delete image from model-image folder
app.get('/imageRemove/:image_name/:extension', (req, res) => {
  let name = req.params.image_name;
  let extension = req.params.extension;
  let path = "FILL HERE WITH THE PATH OF ......htdocs//CPS//.... FOR STIMULI IMAGE SAVING FILE" + name + "." + extension;
  fs.unlinkSync(path);
  res.send(JSON.stringify({
    "status": 200,
    "error": null
  }));
});
