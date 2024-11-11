   let currentUser = null;


        window.onload = function() {
            document.querySelector('.g_id_signin').style.display = 'block'; // Show sign-in button
        };

        // Handle the Google Sign-In Response
        function handleCredentialResponse(response) {
            const jwt = response.credential;
            console.log("JWT ID token: " + jwt);

            fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${jwt}`)
                .then(res => res.json())
                .then(data => {
                    console.log("User data:", data);
                    currentUser = data;

                    // Store user data in sessionStorage
                    sessionStorage.setItem('user', JSON.stringify(currentUser));

                    // After successful login, redirect to the weather app
                    window.location.href = 'weatherApp.html'; // Redirect to weather app page
                })
                .catch(error => {
                    console.error('Error decoding JWT:', error);
                });
        }