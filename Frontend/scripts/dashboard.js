const userDetails = document.getElementById('userDetails')
const loading = document.getElementById('loading')
const error = document.getElementById('error')
const logoutBtn = document.getElementById('logout')

const renderUserData = () => {
    loading.style.display = 'block'
    error.style.display = 'none'
    const token = localStorage.getItem('token');
    if (!token) {
        error.style.display = 'block';
        loading.style.display = 'none';
        error.innerText = 'unauthorized: No token found';
        return;
    }
    fetch(`http://localhost:5000/api/user/dashboard`, {
        headers: {
            authorization: token
        }
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            loading.style.display = 'none'
            error.style.display = 'none'
            userDetails.innerHTML = `
            <h3>${data.name}</h3>
            <p>Email: ${data.email}</p>
            <p>Role: ${data.role}</p>
            `;
        })
        .catch((err) => {
            error.style.display = 'block'
            loading.style.display = 'none'
            console.log(err.message)
        })
}

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token')
    window.location.href = '../pages/login.html';
});
renderUserData()