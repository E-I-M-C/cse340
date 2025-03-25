const psswrdTg = document.getElementById('password-button');

psswrdTg.addEventListener('click', () => {
  const psswrdInput = document.getElementById('password');
  const type = psswrdInput.getAttribute('type');
  if (type === 'password') {
    psswrdInput.setAttribute('type', 'text');
    psswrdTg.innerHTML = 'Hide Password';
  } else {
    psswrdInput.setAttribute('type', 'password');
    psswrdTg.innerHTML = 'Show Password';
  }
});