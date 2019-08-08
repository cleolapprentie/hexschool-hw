(function(){
  var viewport = window.innerWidth
  if (viewport < 768) {
    document.querySelector('.js--search').classList.add('active')
  }
  document.querySelector('.floating-cart-after').style.opacity = 1
})();

$(document).ready(function(){
  window.addEventListener('resize', function(){
    if(window.innerWidth < 768) {
      document.querySelector('.js--search').classList.add('active')
    } else {
      document.querySelector('.js--search').classList.remove('active')
    }
    floatingCartFun()
  })
  
  floatingCartFun()
  
  function floatingCartFun() {
    var pageWidth = document.body.offsetWidth
    var pageHeight = window.innerHeight
    var targetLeft = document.querySelector('.displayContent').offsetLeft
    var targetWidth = document.querySelector('.displayContent').offsetWidth
    var floatingCart = document.querySelector('.floating-cart')
    var footerTop = document.querySelector('#footer').offsetTop
    floatingCart.style.position = 'fixed'
    floatingCart.style.right = pageWidth - (targetLeft + targetWidth) + 15 + 'px'
    floatingCart.style.bottom = '10px'
    
    window.addEventListener('scroll', function() {
      if (window.pageYOffset + pageHeight > footerTop) {
        floatingCart.style = ''
      } else {
        floatingCart.style.position = 'fixed'
        floatingCart.style.right = pageWidth - (targetLeft + targetWidth) + 15 + 'px'
        floatingCart.style.bottom = '10px'
      }
    })
  }
  
  
  
  
  
  
  
  
  document.body.addEventListener('click', function(e){
    var target = e.target
    if (target.classList.contains('search-input')) {
      searchBar(target)
    } else if (target.parentElement.classList.contains('add-quantity')) {
      addQuantity(target)
    } else if(target.classList.contains('add-to-fav')) {
      addFav(target)
    } else if(target.classList.contains('add-to-cart') || target.parentElement.classList.contains('add-to-cart')) {
      addToCart(target)
    } else {
      if (document.querySelector('.search-input').value) { return }
      if (target.classList.contains('search-btn')) { return }
      if (window.innerWidth < 768) { return }
      document.querySelector('.js--search').classList.remove('active')
    } 
  })
  
//  document.querySelectorAll('.add-to-cart').forEach(el => {
//    el.addEventListener('click', addToCart)
//  })
//  
//  
  document.querySelector('.search-btn').addEventListener('click', btnAnimation)
  document.querySelector('.sidebar__list').addEventListener('click', function(e){
    if (!e.target.nodeName === 'LI') { return }
    btnAnimation(e)
  })
  
  function searchBar(target) {
    if (target.parentElement.classList.contains('active')) {
      if (target.classList.contains('search-input')) { return }
      if (target.value) { return }
      if (window.innerWidth < 768) { return }
      target.parentElement.classList.remove('active')
    } else {
      target.parentElement.classList.add('active')
    }
  }
  
  function btnAnimation(e) {
    if (!e.target.parentElement.parentElement.classList.contains('nav')) {
      e.preventDefault()
    }
    var circle = document.createElement('div')
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
  
  function addFav(target) {
    var heart = target.firstElementChild
    if(heart.classList.contains('far')) {
      heart.classList.replace('far', 'fas')
      heart.style.color = '#db5857'
    } else {
      heart.classList.replace('fas', 'far')
      heart.style = ''
    }
  }
  
  
  function addQuantity(target) {
    var el = target.parentElement.firstElementChild
    var elPrice = target.parentElement.parentElement.firstElementChild
    var price = parseInt(elPrice.dataset.price)
    var newPrice
    var num = parseInt(el.textContent)
    if (target.classList.contains('plus')) {
      if (num == 10) { return }
      num += 1
    } else {
      if (num == 1) { return }
      num -= 1
    }
    el.textContent = num
    newPrice = num*price
    
    var n = newPrice.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")

    elPrice.textContent = n
  }
  
  function addToCart(target) {
    var orderNum = target.parentElement.childNodes[3]
    var clone = orderNum.firstChild.cloneNode(true)
    var newObj = document.createElement('div')
    var contentArea = document.querySelector('.displayContent')
    newObj.appendChild(clone)
    newObj.classList.add('add-cart-animation')
    contentArea.appendChild(newObj)
    var t = orderNum.firstChild.textContent
    var num = parseInt(t)
    var numDisplay = document.querySelector('.goCart__quantity')
    var cartNum = parseInt(numDisplay.dataset.num)
    cartNum += num
    numDisplay.dataset.num = cartNum
    numDisplay.textContent = cartNum
    if (cartNum > 0) {
      numDisplay.classList.add('active')
      document.querySelector('.cart__text').classList.add('active')
    }

    // count distance
    var targetBtn = orderNum.getBoundingClientRect()
    var floatingCart = document.querySelector('.floating-cart').getBoundingClientRect()
    var newObjWidth = document.querySelector('.add-cart-animation').getBoundingClientRect().width
    var offsetX = Math.abs((floatingCart.left + floatingCart.width / 2) - (targetBtn.left + targetBtn.width / 2)) - newObjWidth/2
    var offsetY = Math.abs((floatingCart.top + floatingCart.height / 2) - (targetBtn.top + targetBtn.height / 2))
    var scrollTop = window.pageYOffset
    newObj.style.left = targetBtn.left - contentArea.offsetLeft + targetBtn.width / 2 + 'px'
    newObj.style.top = targetBtn.top + scrollTop - contentArea.offsetTop + 'px'
    // animation
    
    
    setTimeout(function(){
      document.querySelector('.floating-cart').classList.add('active')
      newObj.style.transform = 'translate3d(' + offsetX + 'px, 0, 0)' 
      newObj.querySelector('span').style.transform = 'translate3d(0, ' + offsetY + 'px, 0)'
      newObj.style.opacity = 0
    }, 0)
    
    setTimeout(function(){
//      newObj.remove()
      document.querySelector('.floating-cart .goCart__quantity').textContent = cartNum
      document.querySelector('.floating-cart .goCart__quantity').classList.add('active')
    }, 400)
    
    setTimeout(function(){
      document.querySelector('.floating-cart-after').style.opacity = 0
      document.querySelector('.floating-cart').classList.remove('active')
    }, 700)
    
    setTimeout(function(){
      document.querySelector('.floating-cart-after').style.opacity = 1
    }, 850)

  }
  
  
});