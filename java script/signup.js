// start registration
//Html elements
var signName = document.querySelector('#signupName');
var signEmail = document.querySelector('#signupEmail');
console.log(signEmail);

var signPassword = document.querySelector('#signupPassword');
var signUpBtn = document.querySelector('#signupBtn');
var messEmail = document.querySelector('#messEmail');
var messName = document.querySelector('#messName');
var messPassword = document.querySelector('#messPassword');
// App variables
var arr = [];
// Functions
if (localStorage.getItem('user') != null) {
    arr = JSON.parse(localStorage.getItem('user'));
}
else {
    arr = [];
}
// console.log(arr[0].name);
// console.log(arr[0].email);


function add() {
    if (signName.value == '' || signEmail.value == '' || signPassword.value == '') {
        swal({
            title: "all inputs are required",
            text: "please enter correct data",
            icon: "error",
            button: "OK",
        });
    }
    else {
        if (validationEmail() == true && validationName() == true && validationPassword() == true) {
            var obj = {
                name: signName.value,
                email: signEmail.value,
                password: signPassword.value,
            }
            arr.push(obj);
            messEmail.classList.remove('is-valid');
            swal({
                title: "Success Registration",
                text: "Wait a few seconds!",
                icon: "success",
                button: "OK",
            }).then(() => {
                location.href = '../html/login.html';
                localStorage.setItem('user', JSON.stringify(arr));
            })
        }
    }

}

function validationEmail() {
    var regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    var validateEmail = signEmail.value;
    if (regex.test(validateEmail) == true) {
        signEmail.classList.add('is-valid');
        signEmail.classList.remove('is-invalid');
        messEmail.classList.add('d-none');
        return true;
    }
    else {
        signEmail.classList.add('is-invalid');
        signEmail.classList.remove('is-valid');
        messEmail.classList.remove('d-none');
        return false;
    }
};
function validationName() {
    var regex = /^[A-Z][a-z]{0,}$/;
    var validateName = signName.value;
    if (regex.test(validateName) == true) {
        signName.classList.add('is-valid');
        signName.classList.remove('is-invalid');
        messName.classList.add('d-none');
        return true;
    }
    else {
        signName.classList.add('is-invalid');
        signName.classList.remove('is-valid');
        messName.classList.remove('d-none');
        return false;
    }
};
function validationPassword() {
    var regex = /^[a-zA-Z]{2,}[0-9]{2,}$/;
    var validatePassword = signPassword.value;
    if (regex.test(validatePassword) == true) {
        signPassword.classList.add('is-valid');
        signPassword.classList.remove('is-invalid');
        messPassword.classList.add('d-none');
        return true;
    }
    else {
        signPassword.classList.add('is-invalid');
        signPassword.classList.remove('is-valid');
        messPassword.classList.remove('d-none');
        return false;
    }
};
// end registration