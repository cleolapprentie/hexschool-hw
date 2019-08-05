$(document).ready(function () {
  
  document.querySelectorAll('.signup-btn').forEach(el => {
    el.addEventListener('click', togglePanel)
  })
  
  document.querySelectorAll('.login-btn').forEach(el => {
    el.addEventListener('click', togglePanel)
  })
  
  function togglePanel(){
    var target = document.querySelector('.main-container')
    if(!target.classList.contains('active')) {
      target.classList.add('active')
    } else {
      target.classList.remove('active')
    }
  }
  
  
});