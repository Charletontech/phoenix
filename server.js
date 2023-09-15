const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const formidable = require('formidable');
const crypto = require('crypto');
const session = require('express-session');
const cookieParser = require('cookie-parser')
const cloudinary = require('cloudinary').v2;


const app = express();
// app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());
const http = require('http')
const fs = require('fs')
const path = require('path')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
//app.use(express.json());

//Database connection details
// const connection = mysql.createConnection({
//       host: 'localhost',
//       user: 'root',
//       password: "",
//       database: "phoenix"
//     });

// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'phoenixd_root',
//   password: "#Hustle#loyalty99#",
//   database: "phoenixd_phoenixdigitalcrest_db"
// });

// const connection = mysql.createConnection({
//   host: 'sql11.freesqldatabase.com',
//   user: 'sql11645752',
//   password: "zlz6UkM4Ks",
//   database: "sql11645752",
//   port: 3306,
// });


// Cloudinary configuration
cloudinary.config({
  cloud_name: 'dbfue99qr',
  api_key: '546556377339452',
  api_secret: '0IPt7T-Ie-9UKpY3fiV58OE8eGo',
});

const connection = mysql.createConnection({
  host: 'db4free.net',
  user: 'phoenixdigital',
  password: "phoenix1",
  database: "phoenixdigital",
  port: 3306,
});

app.use(session({
  secret: 'mysecret', 
  resave: false, 
  saveUninitialized: true 
}));

//Setting up all neccessary databases and database tables 
app.get('/initializing', (req, res) => {
   
  connection.connect((err) => {
    if (err) throw err
      console.log('connected to database') 
  })
    
  var sql = 'CREATE TABLE IF NOT EXISTS investment_table (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(20), plan VARCHAR(20), amount int(20), roi int(20), dateInvested VARCHAR(20), dateDue VARCHAR(20))' ;
  connection.query(sql, (err, result) => { 
    if (err) throw err
      console.log('result:', result)
  })

    var sql = ' CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(20), wallet DECIMAL(10,2), email VARCHAR(255), password VARCHAR(255))' ;
    connection.query(sql, (err, result) => { 
      if (err) throw err
        console.log('result:', result)
    })


  var sql = ' CREATE TABLE IF NOT EXISTS fund_requests (id INT AUTO_INCREMENT PRIMARY KEY, fundAmount DECIMAL(10, 2) NOT NULL, proof VARCHAR(255) NOT NULL, username VARCHAR(255) NOT NULL, status VARCHAR(255) NOT NULL )' ;
  connection.query(sql, (err, result) => { 
    if (err) throw err
      console.log('result:', result)
  })

  

connection.query(sql, function(err, result) {
  if (err) {
    throw err;
  }
  console.log('Table created successfully:', result);
});



  connection.end(() => {
    console.log('query ended...')
  })
})


app.get('/', (req, res) => {
  res.render('index')
})

app.get('/signup', (req, res) => {
  res.render('signup')
})

// Route for the customer signup form
app.post('/signup', (req, res) => {
  console.log(req.body)
    

    const password = req.body.password;
    const hash = crypto.createHash('sha256');
    hash.update(password);
    const hashedPassword = hash.digest('hex');
    // Insert the customer into the database
    const sql = `INSERT INTO users (username, wallet, email, password) VALUES (?, ?, ?, ?)`;
    var initialAmount = 0;
    const values = [req.body.username, initialAmount, req.body.email, hashedPassword];
    connection.query(sql, values, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      var investmentSql = 'INSERT INTO investment_table (plan, amount, duration, roi, dateInvested, dateDue, username) VALUES (?, ?, ?, ?, ?, ?, ?) ';
      connection.query(investmentSql, ["No Active Plan", 0, 0, 0, "00/00", "00/00", req.body.username], (err, investmentResults) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error inserting investment data');
        } 
      });
      res.redirect('/login')
    });

 });






  //serve login page
  app.get('/login', (req, res) => {
    res.render('login')
  })


  // Login route
 app.post('/login', (req, res) => {   
    const username = req.body.username;
    const password = req.body.password;
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    connection.query('SELECT * FROM users', (err, results) => {
      if (err) throw err;
      const user = results.find((result) => {
      return result.username === username && result.password == hashedPassword;
      });
      if (user) {
        req.session.user = user;
        req.session.save()
        res.cookie('username', user.username)
        const mycookie = req.cookies.username //code to retrieve cookie
        res.redirect('/dashboard')
        
      }else{
        if (username === 'superAdmin' && password === '000') {
          req.session.user = 'superAdmin';
          req.session.save()
          res.redirect('/admin')
        }else{
          res.send('<p style="font-size: 1.4rem"><b>Incorrect credentials:</b> password or username not found!</p>')
         }
      } 
    })
  });

  


app.get('/dashboard', (req, res) => {
  //getting user info from sesion storage
  // const profile = req.session.user;
  var username = req.session.user.username;
  connection.query(`SELECT * FROM users WHERE username = '${username}'`, (err, result) => {
    if (err) throw err;
    var wallet = result[0].wallet
    
    connection.query(`SELECT * FROM investment_table WHERE username = '${username}'`, (err, results) => {
      if (err) throw err;
      var plan = results[0].plan
      var amount = results[0].amount
      var roi = results[0].roi
      var duration = results[0].duration
      var dateInvested = results[0].dateInvested
      var dateDue = results[0].dateDue
      var x = dateInvested.slice(0,2)


      var currentDate = new Date().getDate();
     
      var difference =   parseFloat(currentDate) - parseFloat(x) 
      var progressBarData = difference / duration * 100
      console.log(progressBarData);
      
      res.render('dashboard', {username, wallet, plan, amount, roi, duration, dateInvested, dateDue, progressBarData}) 
    })
  })
})




app.post('/invest', (req, res) => {
  var username = req.cookies.username;

  // First, fetch the user's wallet balance
  var sql = 'SELECT wallet FROM users WHERE username = ?'
  connection.query(sql, [username], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching user wallet');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('User not found'); // Handle the case when the user is not found
      return;
    }

    var oldWallet = results[0].wallet; // Access the wallet column value from the result
    var newWallet = parseFloat(oldWallet) - parseFloat(req.body.investmentAmount);

    // Now, update the user's wallet with the new balance
    var sql = 'UPDATE users SET wallet = ? WHERE username = ?';
    connection.query(sql, [newWallet, username], (err, updateResult) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error updating user wallet');
        return;
      }

      //calculating the roi
      var roiValue = parseFloat(req.body.roi) / 100 * req.body.investmentAmount      
      var roiProfit = parseFloat(req.body.investmentAmount) + roiValue;

      //calculating the duration
      // Get the current date
      var currentDateObj = new Date();
      var currentDate = currentDateObj.getDate(); // Get the day of the month (1-31)
      var currentMonth = currentDateObj.toLocaleString('default', { month: 'long' }); // Get the month name

      // Create the "DD month" format
      var formattedCurrentDate = currentDate.toString().padStart(2, '0') + ' ' + currentMonth.toLowerCase();

      // Add "duration" days to the current date
      var dueDateObj = new Date(currentDateObj.getTime() + parseFloat(req.body.duration) * 24 * 60 * 60 * 1000); // 5 days in milliseconds
      var dueDate = dueDateObj.getDate() + ' ' + dueDateObj.toLocaleString('default', { month: 'long' }).toLowerCase();
      
      // Continue with your investment table update here
      var investmentSql = 'UPDATE investment_table SET plan = ?, amount = ?, duration = ?, roi = ?, dateInvested = ?, dateDue = ? WHERE username = ?';
      connection.query(investmentSql, [req.body.plan, req.body.investmentAmount, req.body.duration, roiProfit, formattedCurrentDate, dueDate, username], (err, investmentResults) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error updating investment data');
        } 
      });
    });
  });
});


app.get('/fund-wallet', (req, res) => {
  res.render('fundWalletStep1')
})

app.get('/fund-wallet-step2', (req, res) => {
  res.render('fundWalletStep2')
})




// app.post('/fund-wallet-request', (req, res) => { 
//   const form = new formidable.IncomingForm();

//   form.parse(req, (err, fields, files) => {
//     if (err) {
//       console.error('Error parsing form:', err);
//       res.status(500).send('Internal Server Error');
//       return;
//     }
//     const fundAmount = fields.fundAmount;
//     const proofFile = files.proof;
//     var username = req.cookies.username
    

//     // Store "fundAmount" and "proofFile" in the "investment_requests" table
//     var status = 'pending';
//     const sql = 'INSERT INTO fund_requests (fundAmount, proof, username, status) VALUES (?, ?, ?, ?)';
//     connection.query(sql, [fundAmount, proofFile.originalFilename, username, status], (insertErr, result) => {
//       if (insertErr) {
//         console.error('Error inserting data into the database:', insertErr);
//         res.status(500).send('Error submitting the form');
//         return;
//       }
//     });
//   });

//   form.on('fileBegin', (name, file) => {
//     file.filepath = __dirname + '/public/css/files/uploads/' + file.originalFilename;
//   })

//   form.on('end', (name, file) => {
//     console.log('File uploaded and data inserted into the database');
//     res.render('invest')
//   })


// });









app.post('/fund-wallet-request', (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    const fundAmount = fields.fundAmount;
    const proofFile = files.proof;
    
    console.log('File path:', proofFile.filepath);
    const username = req.cookies.username;

    cloudinary.uploader.upload(proofFile.filepath, { folder: 'phoenix' }, (uploadErr, uploadResult) => {
      if (uploadErr) {
        console.error('Error uploading file to Cloudinary:', uploadErr);
        res.status(500).send('Error uploading the file');
        return;
      }

      // Store "fundAmount" and Cloudinary URL in the "fund_requests" table
      const status = 'pending';
      const imageUrl = uploadResult.secure_url;
      

      //Insert data into your database table (replace with your database code)
      const sql = 'INSERT INTO fund_requests (fundAmount, proof, username, status) VALUES (?, ?, ?, ?)';
      connection.query(sql, [fundAmount, imageUrl, username, status], (insertErr, result) => {
        if (insertErr) {
          console.error('Error inserting data into the database:', insertErr);
          res.status(500).send('Error submitting the form');
          return;
        }
        console.log('File uploaded and data inserted into the database');
        res.render('invest');
      });
    });
  });

 
});













app.get('/admin', (req, res) => {
  var status = 'pending';
  var sql = `SELECT * FROM fund_requests WHERE status = '${status}'`;
    connection.query(sql, (insertErr, result) => {
      if (result == "") {
        res.send('<h3>Admin, no fund requests at this time.</h3>')
      } else {
        res.render('admin', {result})
      }      
    });
})

app.post('/admin-action-approve', (req, res) =>{
  var username = req.body.investor
  console.log(username);
   var sql = 'SELECT * FROM users WHERE username = ?';
     connection.query(sql, [username], (err, result) => { 
          if (err) throw err; 
      
      
      var oldBalance = result[0].wallet
      var newBalance = parseFloat(oldBalance) + parseFloat(req.body.amount)
      var sql = 'UPDATE users SET wallet = ? WHERE username = ?';
      connection.query(sql, [newBalance,  username], (err, result) => {  
        if (err) throw err;
        console.log('user credited')
        var sql = 'UPDATE fund_requests SET status = ? WHERE username = ?';
        connection.query(sql, ["approved", username], (err, result) => {  
          if (err) throw err;
          console.log('user credited')
        });
      });
    });
})

app.post('/admin-action-decline', (req, res) =>{
  var username = req.body.investor
  var sql = `UPDATE fund_requests SET status = ? WHERE username = ?`;
      connection.query(sql, [ "declined", username], (err, result) => {  
        if (err) throw err;
        console.log('user declined')
      });
})




// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});