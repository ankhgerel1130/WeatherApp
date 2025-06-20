const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();


const pool = new Pool({
  user: 'ankhaa',
  host: 'localhost',
  database: 'user_auth',
  password: 'Theguitar22',
  port: 5432,
});

// Enable CORS
app.use(cors());

app.use(express.json());


pool.connect()
  .then(() => {
    console.log('Connected to the database!');
  })
  .catch(err => {
    console.error('Database connection error:', err.stack);
  });


app.get('/testdb', (req, res) => {
  pool.query('SELECT NOW()', (error, results) => {
    if (error) {
      console.error('Error querying the database:', error.stack);
      res.status(500).send('Database query error');
    } else {
      console.log('Database query result:', results.rows[0]);
      res.json(results.rows[0]);
    }
  });
});
app.post('/register', async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    console.log('Received registration data:', { first_name, last_name, email, password });

    try {
        const query = 'INSERT INTO users(first_name, last_name, email, password) VALUES($1, $2, $3, $4) RETURNING *';
        const values = [first_name, last_name, email, password];

        const result = await pool.query(query, values);
        console.log('User registered:', result.rows[0]);
        
        // Return the full user object, including first name
        res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
    } catch (error) {
        console.error('Error during registration:', error);  // Log error details here
        res.status(500).json({ error: 'Something went wrong. Please try again later.' });
    }
});

  

// Login route (without password comparison using bcrypt)
app.post('/login', async (req, res) => {
    console.log("Received login request:", req.body); // Log incoming request body

    const { email, password } = req.body;

    try {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            console.log('User found:', user);

            if (password === user.password) {
                res.status(200).json({ message: 'Login successful', user: { id: user.user_id, email: user.email } });
            } else {
                res.status(401).json({ error: 'Invalid email/username or password' });
            }
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Error during login: ' + error.message });
    }
});

// Password update route (without password hashing)
app.post('/update-password', async (req, res) => {
    const { email, newPassword } = req.body;

    try {
      // Update the password in the database (no hashing)
      const query = 'UPDATE users SET password = $1 WHERE email = $2 RETURNING *';
      const result = await pool.query(query, [newPassword, email]);

      if (result.rows.length > 0) {
        res.status(200).json({ message: 'Password updated successfully', user: result.rows[0] });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ error: 'Something went wrong. Please try again later.' });
    }
  });

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
