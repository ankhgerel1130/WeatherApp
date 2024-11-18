const API_BASE_URL = 'http://localhost:8080';  // Update to the correct port
 // Backend server URL

let currentUser = null;

window.onload = function () {
    // Check for stored user session
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        window.location.href = 'weatherApp.html'; // Redirect to weather app
    } else {
        document.querySelector('.g_id_signin').style.display = 'block'; // Show Google login
    }
};

// Handle Google Sign-In response
function handleCredentialResponse(response) {
    const jwt = response.credential;
    console.log("JWT ID token: " + jwt);

    fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${jwt}`)
        .then(res => res.json())
        .then(data => {
            console.log("Google User Data:", data);
            currentUser = data;

            // Save Google user data in session storage
            sessionStorage.setItem('user', JSON.stringify({
                name: data.name,
                picture: data.picture,
                email: data.email,
            }));

            window.location.href = 'weatherApp.html'; // Redirect to weather app
        })
        .catch(error => {
            console.error('Error decoding JWT:', error);
        });
}

const registerUser = async (event) => {
    event.preventDefault();
    const firstName = document.getElementById("register-first-name").value;
    const lastName = document.getElementById("register-last-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    console.log('Registering user with:', { firstName, lastName, email, password });

    const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password
        })
    });

    const data = await response.json();
    console.log('Response from server:', data);

    if (response.ok) {
        // Save user data including first name in sessionStorage
        sessionStorage.setItem('user', JSON.stringify({
            first_name: data.user.first_name,
            last_name: data.user.last_name,
            email: data.user.email,
        }));

        alert('Registration successful!');
        window.location.href = 'index.html';  // Redirect to login page
    } else {
        alert('Registration failed: ' + data.error);
    }
};

// Log in an existing user
async function loginUser() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    console.log('Logging in with:', { email, password });

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();
        if (response.ok) {
            sessionStorage.setItem('user', JSON.stringify(result.user)); // Save user session
            window.location.href = 'weatherApp.html'; // Redirect to weather app
        } else {
            console.log('Error during login:', result.error); // Log the error
            alert(result.error);
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('Something went wrong. Please try again later.');
    }
}



// Switch to the registration form
function showRegister() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('register-section').style.display = 'block';
}

// Switch to the login form
function showLogin() {
    document.getElementById('register-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
}
