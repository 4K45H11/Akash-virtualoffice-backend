const registerForm = document.getElementById('registerForm')
const userName = document.getElementById('name')
const userEmail = document.getElementById('email')
const userPassword = document.getElementById('password')
const userRole = document.getElementById('role')

const formData = {}

userName.addEventListener('change', (e) => {
    formData.name = e.target.value;
})
userEmail.addEventListener('change', (e) => {
    formData.email = e.target.value;
})
userPassword.addEventListener('change', (e) => {
    formData.password = e.target.value;
})
userRole.addEventListener('change', (e) => {
    formData.role = e.target.value;
})

registerForm.addEventListener('submit', (e) => {
    e.preventDefault()
    if (userName && userEmail && userPassword && userRole) {
        fetch(`http://localhost:5000/api/auth/register`, {
            method: 'POST',
            body: JSON.stringify(formData),
            headers:{
                'Content-Type':'application/json'
            }
        })
            .then(res => res.json())
            .then((data) => {
                
                userName.value = ``
                userEmail.value = ``
                userPassword.value = ``
                userRole.value = `Select Role`
                // console.log(formData);
                // console.log(data)
                return window.location.href = `../pages/login.html`
            })
            .catch((err)=>{
                console.log(err.message)
                alert("can't register user")
            })
    }
    else {
        alert('Please enter all the required data')
    }
})