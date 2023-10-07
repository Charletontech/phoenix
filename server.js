const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const formidable = require('formidable');
const crypto = require('crypto');
const session = require('express-session');
const cookieParser = require('cookie-parser')
const cloudinary = require('cloudinary').v2;
const nodemailer = require('nodemailer')

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
  saveUninitialized: true ,
  cookie: {
    sameSite:'lax'
  }
}));

//Setting up all neccessary databases and database tables 
app.get('/initializing', (req, res) => {
   
  connection.connect((err) => {
    if (err) throw err
      console.log('connected to database') 
  })
    
  var sql = 'CREATE TABLE IF NOT EXISTS investment_table (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(20), plan VARCHAR(20), amount int(20), roi int(20), dateInvested VARCHAR(20), dateDue VARCHAR(20), status VARCHAR(20))' ;
  connection.query(sql, (err, result) => { 
    if (err) throw err
      console.log('result:', result)
  })

    var sql = 'CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(20), wallet DECIMAL(10,2), email VARCHAR(255), phone VARCHAR(25) password VARCHAR(255))' ;
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

//ROute for sign up form submission
app.post('/signup-request', (req, res) =>{
  var {email, phone, username} = req.body
  const password = req.body.password;
  const hash = crypto.createHash('sha256');
  hash.update(password);
  const hashedPassword = hash.digest('hex');

  const token = crypto.randomBytes(32).toString('hex') 
  const uniqueLink = `https://phoenix-ie3c.onrender.com/verify-user?token=${token}&email=${email}&phone=${phone}&username=${username}&password=${hashedPassword}`
  
  //Sending the uniqueLink to the user email for verification
  const transporter = nodemailer.createTransport({
    host: 'smtp.elasticemail.com',
    port: 2525, // Make sure port is specified as a number (not a string)
    secure: false, // Set secure as a boolean
    auth: {
      user: 'phoenixdigitalcrest@mail.com',
      pass: '486D7B3214844781DDC0D377BBBDE2773968',
    },
  });


  //Mail details
  const mailContent = {
    from: 'phoenixdigitalcrest@mail.com',
    to: `${email}`,
    subject: 'no reply - Phoenix Email Verification',
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style>
        /* Reset styles for email clients */
        body, p {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
        }
    
        /* Container */
        .container {
          background-color: black;
          padding: 20px;
        }
    
        /* Header */
        .header {
          background-color: #d7a917;
          color: black;
          text-align: center;
          padding: 12px 15px; 
        }
    
        /* Company Logo */
        .logo {
          text-align: center;
          margin-bottom: 20px;
          display: block;
          margin: auto;
        }
    
        /* Logo Image */
        .logo img {
          width: 100px; /* Adjust the size as needed */
          height: 100px; /* Adjust the size as needed */
          border-radius: 50%; /* Makes the logo round */
        }
    
        /* Content */
        .content {
          background-color: black;
          padding: 20px;
          border-radius: 3px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          color: #777;
          line-height: 1.4rem; text-align: center;
        }
    
        /* Button */
        .button {
          background-color: #d7a917;
          color: black;
          padding: 6px 12px;
          text-decoration: none;
          display: block;
          border-radius: 5px;
          text-align: center;
          margin:1.1rem auto;
          border: none;
          font-size: 1rem;
        }

        a {
            text-decoration: none;
        }
    
        /* Footer */
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="container">
          <div class="logo">
            <img src="https://res.cloudinary.com/dbfue99qr/image/upload/v1694767455/phoenix/phoenix-uploads/logo1_daltoh.png" alt="Company Logo">
          </div>
        <div class="header">
          
          <h1>Email Verification</h1>
        </div>
        <div class="content">
          <p>Dear ${username}, we wanted to be sure its really you. You're good to go. Click the <b>"Verify"</b> button below to verify your email (or open this link in your browser: <a href="${uniqueLink}">${uniqueLink}</a>). You will then be redirected to login to your dashboard.</p>
          <button class="button"><a href="${uniqueLink}" style="color: black;">Verify</a></button>
        </div>
        <div class="footer">
          <p>&copy; 2023 Phoenix Digital Crest</p>
        </div>
      </div>
    </body>
    </html>
    
    `
  }

  //Sending the mail
  transporter.sendMail(mailContent, (error, info) =>{
    if (error){
      console.error('error sending mail', error)
    }else{
      console.log('Email sent', info.response)
      res.send(`<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          /* Reset styles for email clients */
          body{
              height: 100vh;
          }
          body, p {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
          }
      
          /* Container */
          .container {
            background-color: black;
            padding: 20px;
            height: 100vh;
          }
      
          /* Header */
          .header {
            background-color: #d7a917;
            color: black;
            text-align: center;
            padding: 12px 15px; 
          }
      
          /* Company Logo */
          .logo {
            text-align: center;
            margin-bottom: 20px;
            display: block;
            margin: auto;
          }
      
          /* Logo Image */
          .logo img {
            width: 100px; /* Adjust the size as needed */
            height: 100px; /* Adjust the size as needed */
            border-radius: 50%; /* Makes the logo round */
          }
      
          /* Content */
          .content {
            background-color: black;
            padding: 20px;
            border-radius: 3px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            color: #777;
            line-height: 1.4rem; text-align: center;
          }
      
          /* Button */
          .button {
            background-color: #d7a917;
            color: black;
            padding: 6px 12px;
            text-decoration: none;
            display: block;
            border-radius: 5px;
            text-align: center;
            margin:1.1rem auto;
            border: none;
            font-size: 1rem;
          }
  
          a {
              text-decoration: none;
          }
      
          /* Footer */
          .footer {
            text-align: center;
            margin-top: 7rem;
            color: #777;
          }
  
          @media only screen and (min-width: 600px) and (max-width: 800px){
              .header{
                  width: 50%;
              }
          }
  
          @media screen and (min-width: 600px) {
              .header{
                  width: 40%;
                  margin: auto;
                  display: block;
              }
  
              .button {
                  width: 8rem;
              }
  
              .footer {
                  margin-top: 11rem;
              }
          }
        </style>
      </head>
      <body>
        <div class="container">
            <div class="logo">
              <img src="https://res.cloudinary.com/dbfue99qr/image/upload/v1694767455/phoenix/phoenix-uploads/logo1_daltoh.png" alt="Company Logo">
            </div>
          <div class="header">
            
            <h1>Verification Link Sent</h1>
          </div>
          <div class="content">
              <p>A verification link has been sent to your email.</p>
              <p>Please check your 'Inbox' or 'Spam' folder for the link.</p>
              
            </div>
          <div class="footer">
            <p>&copy; 2023 Phoenix Digital Crest</p>
          </div>
        </div>
      </body>
      </html>  
      `)
    }
  })
  
})



// Route  for handling email verification requests from the user's email
app.get('/verify-user', (req, res) => {  
    //Insert the customer into the database
    const sql = `INSERT INTO users (username, wallet, email, phone, password) VALUES (?, ?, ?, ?, ?)`;
    var initialAmount = 0;
    const values = [req.query.username, initialAmount, req.query.email, req.query.phone, req.query.password];
    connection.query(sql, values, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      var investmentSql = 'INSERT INTO investment_table (plan, amount, duration, roi, dateInvested, dateDue, username, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ';
      connection.query(investmentSql, ["No Active Plan", 0, 0, 0, "00/00", "00/00", req.query.username, "pending"], (err, investmentResults) => {
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
    var email = result[0].email
    connection.query(`SELECT * FROM investment_table WHERE username = '${username}' AND status = "pending" `, (err, results) => {
      if (err) throw err;
      var plan = results[0].plan
      var amount = results[0].amount
      var roi = results[0].roi
      var duration = results[0].duration
      var dateInvested = results[0].dateInvested
      var dateDue = results[0].dateDue

      var currentDate = new Date();     
      var investedDateParts = dateInvested.split(' ');
      var investedDate = new Date(`${investedDateParts[1]} ${investedDateParts[0]}, ${new Date().getFullYear()}`);
      var timeDifference = currentDate - investedDate; 
      var daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
      var progressBarData = Math.round(daysDifference / duration * 100)
      if (progressBarData > 100) {
        progressBarData = 100
      }
      
      //test
      for (let i = 0; i < results.length; i++) {
        var each = results[i];
        var id = each.id
        var amountEach = each.amount
        var roiEach = each.roi
        var durationEach = each.duration
        var planEach = each.plan
       // Sample date format like "27 September"
        const dateInvestedEach = each.dateInvested;

        // Convert the date string to a valid date object
        const investedDateParts = dateInvestedEach.split(' ');

        const investedDate = new Date(`${investedDateParts[1]} ${investedDateParts[0]}, ${new Date().getFullYear()}`);

        // Calculate the time difference in milliseconds between the invested date and the current date
        const currentDate = new Date();
        const timeDifference = currentDate - investedDate;

        // Calculate the number of days by dividing the time difference by the number of milliseconds in a day
        const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

        
         if (daysDifference >= durationEach) {
            //crediting the user
            var profit = parseFloat(roiEach) - parseFloat(amountEach)
            var newBalance = parseFloat(wallet) + profit

            var sql = `UPDATE users SET wallet ='${newBalance}' where username = '${username}'`
            connection.query(sql, (err, result3) => {
              if (err) {
                console.error(err);
                res.status(500).send('Error UPDATING completed investment status');
                return;
              }
            })
            var sql = ` UPDATE investment_table SET status = 'completed' WHERE id = '${id}'`
            connection.query(sql, (err, result4) => {
              if (err) {
                console.error(err);
                res.status(500).send('Error UPDATING completed investment status');
                return;
              }
            })
            
            //Sending an email notification to the user
            const nodemailer = require('nodemailer');

            const transporter = nodemailer.createTransport({
              host: 'smtp.elasticemail.com',
              port: 2525, // Make sure port is specified as a number (not a string)
              secure: false, // Set secure as a boolean
              auth: {
                user: 'phoenixdigitalcrest@mail.com',
                pass: '486D7B3214844781DDC0D377BBBDE2773968',
              },
            });

          
            //Mail details
            const mailContent = {
              from: 'phoenixdigitalcrest@mail.com',
              to: `${email}`,
              subject: 'Credit alert!',
              html:`<!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Verification</title>
                <style>
                  /* Reset styles for email clients */
                  *{
                    list-style: none;
                  }
                  body{
                      height: 100vh;
                  }
                  body, p {
                    margin: 0;
                    padding: 0;
                    font-family: Arial, sans-serif;
                  }
              
                  /* Container */
                  .container {
                    background-color: black;
                    padding: 20px;
                    height: 100vh;
                    overflow: scroll;
                  }
              
                  /* Header */
                  .header {
                    background-color: #d7a917;
                    color: black;
                    text-align: center;
                    padding: 12px 15px; 
                  }
              
                  /* Company Logo */
                  .logo {
                    text-align: center;
                    margin-bottom: 20px;
                    display: block;
                    margin: auto;
                  }
              
                  /* Logo Image */
                  .logo img {
                    width: 100px; /* Adjust the size as needed */
                    height: 100px; /* Adjust the size as needed */
                    border-radius: 50%; /* Makes the logo round */
                  }
              
                  /* Content */
                  .content {
                    background-color: black;
                    padding: 20px;
                    border-radius: 3px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    color: #777;
                    line-height: 1.4rem; 
                    text-align: left;
                    width: 100%;
                  }
                  b{
                    color: white;
                    
                  }
          
                  h3{
                    margin-top: 1.1rem;
                    margin-bottom: -.7rem;
                  }
                  h3  b{
                    color: #d7a917;
                    
                  }
          
                  ul{
                    margin-left: -2.6rem;
                  }
                  
          
                  a {
                      text-decoration: none;
                  }
              
                  /* Footer */
                  .footer {
                    text-align: center;
                    margin-top: 7rem;
                    color: #777;
                  }
          
                  @media only screen and (min-width: 600px) and (max-width: 800px){
                      .header{
                          width: 50%;
                      }
                  }
          
                  @media screen and (min-width: 600px) {
                      .header{
                          width: 40%;
                          margin: auto;
                          display: block;
                      }
          
                      .button {
                          width: 8rem;
                      }
          
                      .footer {
                          margin-top: 11rem;
                      }
                  }
                </style>
              </head>
              <body>
                <div class="container">
                    <div class="logo">
                      <img src="https://res.cloudinary.com/dbfue99qr/image/upload/v1694767455/phoenix/phoenix-uploads/logo1_daltoh.png" alt="Company Logo">
                    </div>
                  <div class="header">
                    
                    <h1>Investment Complete!</h1>
                  </div>
                  <div class="content">
                      <p>Your investment is mature and you have been credited.</p>
                      <h3><b>Details</b></h3>
                      <ul>
                        <li><b>Plan: </b>${planEach}</li>
                        <li><b>Date Of Investment: </b>${dateInvestedEach}</li>
                        <li><b>Amount Invested: </b>$${amountEach}</li>
                        <li><b>Profit: </b>$${profit}</li>
                      </ul>
                    </div>
                  <div class="footer">
                    <p>&copy; 2023 Phoenix Digital Crest</p>
                  </div>
                </div>
              </body>
              </html> 
              `
            }

            transporter.sendMail(mailContent, (error, info) =>{
              if (error){
                console.error('error sending mail', error)
              }else{
                console.log('mail sent', info.response);
                
              }
            })
            
          } 

      }
      var sql = `SELECT plan FROM investment_table WHERE username = '${username}' AND status = "pending"`
      connection.query(sql, (err, results2) => {
        if (err) throw err;
         res.render('dashboard', {username, wallet, plan, amount, roi, duration, dateInvested, dateDue, progressBarData, results2})
      })
    })
  })
})




app.post('/invest', (req, res) => {
  var username = req.cookies.username;
  var sql = 'DELETE FROM investment_table WHERE username = ? AND plan = "No Active Plan"'
  connection.query(sql, [username], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error DELETING default plan');
      return;
    }
    console.log(username, req.body.plan);
    
  })
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
      var investmentSql = 'INSERT INTO investment_table (username, plan, amount, duration, roi, dateInvested, dateDue, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      connection.query(investmentSql, [username, req.body.plan, req.body.investmentAmount, req.body.duration, roiProfit, formattedCurrentDate, dueDate, "pending"], (err, investmentResults) => {
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

app.get('/switch-plan', (req, res) =>{
  var sql = 'SELECT * FROM investment_table WHERE username = ? AND plan = ?';
      connection.query(sql, [req.query.username, req.query.planName], (err, result) => {  
        if (err) throw err;
        var plan = result[0].plan;
        var username = result[0].username;
        var amount = result[0].amount
        var roi = result[0].roi
        var duration = result[0].duration
        var dateInvested = result[0].dateInvested
        var dateDue = result[0].dateDue

        var x = dateInvested.slice(0,2)
        var currentDate = new Date().getDate();
        var difference =   parseFloat(currentDate) - parseFloat(x) 
        var progressBarData = Math.round(difference / duration * 100)   
        res.send({plan, username, amount, roi, duration, dateInvested, dateDue, progressBarData})
  }); 
})

app.get('/logout', (req, res) =>{
  req.session.destroy((err) =>{
    if (err) throw err
    console.log('ok');
    res.redirect('/login')
  })
})


// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
