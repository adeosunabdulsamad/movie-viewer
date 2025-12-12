const signInFormDiv = document.getElementById('signInForm');
const signUpFormDiv = document.getElementById('signUpForm');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

document.getElementById('showSignUp').addEventListener('click', (e) => {
  e.preventDefault();
  signInFormDiv.style.display = 'none';
  signUpFormDiv.style.display = 'block';
});

document.getElementById('showSignIn').addEventListener('click', (e) => {
  e.preventDefault();
  signUpFormDiv.style.display = 'none';
  signInFormDiv.style.display = 'block';
});

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  if (users.find(u => u.email === email)) {
    alert('Email already registered!');
    return;
  }
  
  users.push({ name, email, password });
  localStorage.setItem('users', JSON.stringify(users));
  
  alert('Account created successfully!');
  signUpFormDiv.style.display = 'none';
  signInFormDiv.style.display = 'block';
  registerForm.reset();
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    alert(`Welcome, ${user.name}`)
    window.location.href = 'index.html';
  } else {
    alert('Invalid email or password!');
  }
});
