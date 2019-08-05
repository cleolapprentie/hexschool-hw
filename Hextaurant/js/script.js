(function(){
  var inputNum = document.querySelectorAll('input[type="number"]')
  if (inputNum.length) {
    inputNum.forEach(el => {
      el.parentElement.classList.add('number')
    })
  }
})();


$(document).ready(function(){
  
  if (window.location.hash) {
    scroll(0,0)
    setTimeout(function(){
      scroll(0,0)
    }, 0)
    
    var target = $(window.location.hash)
    $('html, body').animate({
      scrollTop: target.offset().top - 50
    }, 600)
  }
  
  
  
  // menu
  var $nav = $('.nav')
  var $stickyNav = $nav.before($nav.clone().addClass('sticky'))
  
  $(window).on('scroll', function(){
    var $scrollTop = $(window).scrollTop()
    $('.nav').toggleClass('scroll', ($scrollTop > 120))
    if ($('.nav').hasClass('scroll') && $('.menu-trigger').hasClass('active')) {
      $('.nav').find('.nav__menu').slideUp()
      $('.menu-trigger').removeClass('active')
    }
  })
  
  
  $('.nav a[href^="#"]').on('click', function(e){
    e.preventDefault()
    var $target = $(this.hash)
    if ($target.length) {
      $('html, body').animate({
        scrollTop: $target.offset().top - 50
      }, 800)
    }
  })
  
  
  $('.menu-trigger').on('click', function(e){
    $(this).toggleClass('active')
    $(this).parent().find('.nav__menu').slideToggle(400)
  })
  
  
  // click event
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
    if (e.target.classList.contains('btn') && !e.target.parentElement.parentElement.classList.contains('nav')) {
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









