
const form = document.getElementById('form')
if (form) {
    form.addEventListener('submit', (event) => {
        document.getElementById('submitButton').style.display = 'none'
        document.getElementById("loader").style.display = 'block';
    })
}