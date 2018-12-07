const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const port = process.env.PORT || 5000;

const apis = require('./apis/index');

var bcrypt = require('bcrypt-nodejs');

var session = require('express-session');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(
    '<h1>This is Express Server Page</h1>\n'
    + '<h2>Go To:</h2>'
    + '<a href="http://localhost:3000/">http://localhost:3000/</a>'
  );
});

/*complaints table*/
var complaints = require('./server/complaints.js');

app.post('/S_complaints',(req, res) =>{
  console.log(req.body);
  complaints.queryComplaints(req, res, function (err, sqlResult) {
    if (err.type) {
      console.log('if (err): ', err);
      res.end(JSON.stringify({ canLog: false }));
    } else {
      console.log('else : Can Log ', sqlResult.insertId);
      res.end(JSON.stringify({ insertId: sqlResult.insertId}));
    }

  });
});

/*
 *  Userid Table: 
 */

var userid = require('./server/userid.js');

app.post('/S_signin', (req, res) => {
  console.log(req.body);
  userid.queryUserID(req, res, function (err, sqlResult) {
    if (err.type) {
      console.log('if (err): ', err);
      res.end(JSON.stringify({ canLog: false }));
    } else {
      console.log('else : Can Log ', sqlResult);
      res.end(JSON.stringify({ canLog: true }));
    }

  });

});

/*
 *  Admin Table: 
 */
var admins = require('./server/admins.js');

app.get('/S_ListAllAdmins', (req, res) => {
  console.log(req.body);
  admins.queryAdmins(req, res, function (err, sqlResult) {
    if (err.type) {
      console.log('if (err): ', err);
      res.end(JSON.stringify(err));
    } else {
      console.log('else : List of  ', sqlResult);
      res.end(JSON.stringify(sqlResult));
    }

  });

});

app.post('/S_CreateAdmin', (req, res) => {
  console.log("Create Admins: ", req.body);
  admins.createAdmins(req, res, function (err, sqlResult) {
    if (err.type) {
      console.log('if (err): ', err);
      res.end(JSON.stringify(err));
    } else {
      console.log('else : List of  ', sqlResult);
      res.end(JSON.stringify(sqlResult));
    }

  });

});

app.post('/S_SearchAdmin', (req, res) => {
  console.log("S_SearchAdmin: ", req.body);
  admins.searchAdmins(req, function (err, sqlResult) {
    if (err.type) {
      console.log('if (err): ', err);
      res.end(JSON.stringify(err));
    } else {
      console.log('else : List of  ', sqlResult);
      res.end(JSON.stringify(sqlResult));
    }

  });

});

app.post('/S_DeleteAdmin', (req, res) => {
  console.log("S_DeleteAdmin: ", req.body.id);
  admins.deleteAdmin(req.body.id, function (err, sqlResult) {
    if (err.type) {
      console.log('if (err): ', err);
      res.end(JSON.stringify(err));
    } else {
      console.log('else : List of  ', sqlResult);
      res.end(JSON.stringify(sqlResult));
    }
  });
});

// APIs:
// Get a number fact from API and send it back to client
app.get('/numberfact', (req, res) => {
  apis.getNumberFact((err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send({ fact: data });
    }
  });
});


// Heroku Deploy:

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));