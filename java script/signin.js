// start log in
// HTML ELEMENTS
var signEmail = document.querySelector('#signEmail');
var signPassword = document.querySelector('#signPassword');
var loginBtn = document.getElementById('loginBtn');

// APP VARIABLES
let arr2 = JSON.parse(localStorage.getItem('user')) || [];

// FUNCTIONS
function check() {
    let loginSuccessful = false;
    for (let i = 0; i < arr2.length; i++) {
        if (signEmail.value === arr2[i].email && signPassword.value === arr2[i].password) {
            loginSuccessful = true;
            break;
        }
    }

    if (loginSuccessful) {
        swal({
            title: "Success",
            text: "Wait a few seconds!",
            icon: "success",
            button: "OK",
        }).then(() => {
            location.href = '../html/index.html';
        });
    } else {
        swal({
            title: "Email or Password is incorrect",
            text: "Please enter correct data",
            icon: "error",
            button: "OK",
        });
    }
}

// EVENTS
if (loginBtn) {
    loginBtn.addEventListener('click', function () {
        if (signEmail.value === '' || signPassword.value === '') {
            swal({
                title: "All inputs are required",
                text: "Please enter correct data",
                icon: "error",
                button: "OK",
            });
        } else {
            check();
        }
    });
}
// end log in