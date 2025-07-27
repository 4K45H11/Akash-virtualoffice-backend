const loginForm = document.getElementById('loginForm')


const result = document.getElementById('result')

const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');

const formData = {}
loginEmail.addEventListener('change', (e) => {
    formData.email = e.target.value;
})

loginPassword.addEventListener('change', (e) => {
    formData.password = e.target.value;
})

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const response = await fetch(`http://localhost:5000/api/auth/login`, {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        loginEmail.value = '';
        loginPassword.value = '';

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || 'Invalid credentials. Please try again.');
            return;
        }

        localStorage.setItem('token', `Bearer ${data.token}`);
        window.location.href = '../pages/dashboard.html';

    } catch (error) {
        console.log(error.message);
        alert('Invalid credentials. Please try again.');
    }
});

