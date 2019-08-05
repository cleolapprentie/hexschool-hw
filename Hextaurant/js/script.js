(function(){
  var inputNum = document.querySelectorAll('input[type="number"]')
  if (inputNum.length) {
    inputNum.forEach(el => {
      el.parentElement.classList.add('number')
    })
  }
})();


$(document).ready(function(){
  

  
  document.body.addEventListener('click', function(e){
    var target = e.target
    if (target.nodeName === 'SELECT') {
      selectItem(target)
    } else if (target.classList.contains('btn')) {
      btnAnimation(e)
    } 
    console.log(target)
  }, false)

  function selectItem(target) {
    target.parentElement.classList.toggle('active')
    target.addEventListener('blur', function(){
    target.parentElement.classList.remove('active')  
    }, false)
  }
  
  function btnAnimation(e) {
    if (e.target.classList.contains('btn') && !e.target.parentElement.parentElement.classList.contains('nav__menu')) {
      e.preventDefault()
    }
    var circle = document.createElement('DIV')
    e.target.appendChild(circle)
    circle.classList.add('btn--active')
    var targetWidth = e.target.offsetWidth
    var x = e.layerX
    var y = e.layerY
    var target = e.target.lastElementChild
    target.style.left = x + 'px'
    target.style.top = y + 'px'
    target.style.transform = 'scale(' + targetWidth*2.1 + ')'
    target.style.opacity = 0
    setTimeout(function(){
      target.remove()
    }, 400)
  }
  
  
});









