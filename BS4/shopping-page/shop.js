$(document).ready(function() {
  var filter = getFilter(),
    page = 1,
    max = 3,
    pageCount;
  // 切換 list 取得 filter
  $("#item-list").on('click', function(e) {
    e.preventDefault();
    filter = $(e.target).data('list');
    page = 1; // reset page
    pageCount = 1; // reset pageCount
    $(e.target).siblings().removeClass('active');
    $(e.target).addClass('active');
    getData(initPage);

    $('html, body').stop().animate({
      scrollTop: $('#displayItems').offset().top - 70
    }, 400);
  });


  getData(initPage);

  $(".pagination").on('click', function(e) {
    e.preventDefault();
    if ($(e.target).is('li')) { return }
    var targetPage = $(e.target).parent().data('page');
    page = targetPage;
    getData(printData);
    $('.page').each(function() {
      $(this).removeClass('active');
    });
    $('[data-page="' + page + '"]').not('.next, .prev').addClass('active');
    if (page === 1) {
      $('.prev').addClass('disabled');
      $('.next').removeClass('disabled');
    } else if (page === pageCount) {
      $('.next').addClass('disabled');
      $('.prev').removeClass('disabled');
    } else {
      $('.prev').removeClass('disabled');
      $('.next').removeClass('disabled');
    }
    $('.next').attr('data-page', (page + 1));
    $('.prev').attr('data-page', (page - 1));

    $('html, body').stop().animate({
      scrollTop: $('#displayItems').offset().top - 70
    }, 400);
  });


  $('.price').each(function() {
    var num = $(this).text();
    $(this).text('NT$ ' + num.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
  });

  $('a[href="#"]').on('click', function (e) {
    e.preventDefault();
  });

  $('#cart-preview .dropdown-menu').on('click', function(e) {
    e.stopPropagation();
  });

  
  function getData(fn) {
    $.getJSON('data.json')
      .done(function(data) {
        fn(data);
        
        $('.add-to-fav').on('click', function(e) {
          e.preventDefault();
          var target = $(this).find('svg');
          if (target.data('prefix') === 'far') {
            target.attr('data-prefix', 'fas');
          } else {
            target.attr('data-prefix', 'far');
          }
        });
      });
  }
  function initPage(data) {
    printData(data);
    pageNav();
  }
  function printData(data) {
    var filter = getFilter(),
        display = $('#displayItems');
    display.empty();

    if (!data[filter]) {
      $(display).addClass('not-found');
      display.html('<div class="col-12 d-flex justify-content-center align-items-center">\
        <div class="h4 font-weight-bold" style="font-family: lato; color: #ccc; letter-spacing: 0.2rem">No items found</div></div>')
      return;
    } else {
      $(display).removeClass('not-found');
    }

    var getData = data[filter];
    pageCount = Math.ceil(getData.length / max);
    getData.forEach(function(el, index) {
      // pagination
      if (index >= max * (page - 1) && index < max * page) {
        printFn(el);
      }
      
      function printFn(el) {
        var colDiv = document.createElement('div'),
          card = document.createElement('div'),
          cardImg = document.createElement('div'),
          cardBody = document.createElement('div'),
          cardFooter = document.createElement('div'),
          footerLinks = '';
        colDiv.className = 'col-md-4';
        card.className = 'card border-0 h-100 box-shadow pb-2';
        cardImg.className = 'card-img-top bg-cover position-relative';
        cardBody.className = 'card-body';
        cardFooter.className = 'card-footer bg-white border-top-0 d-flex align-items-center justify-content-between pt-0';
        footerLinks = '<a class="btn btn-outline-dark" href="#" role="button">查看細節</a>\
              <a href="#" class="add-to-fav ml-auto text-dark h4"><i class="far fa-heart" role="button" title="加入收藏"></i></a>\
              <a href="#" class="add-to-bag ml-3 text-dark h4"><i class="fas fa-shopping-bag" role="button" title="加入購物車"></i></a>'
        $(cardFooter).append(footerLinks);
        $(display).append($(colDiv).append($(card).append(cardImg, cardBody, cardFooter)));

        var state = 0,
          discount = 1,
          soldOut = 2;
        var title = el.itemName,
          tag = el.itemState,
          tagClass = (tag[state] === 'new') ? 'warning' : (tag[state] === 'sale') ? 'danger' : 'normal',
          price = el.itemPrice,
          colorPalette = el.itemColors,
          sizePalette = el.itemSizes,
          itemImg = el.itemImg;
        titleDiv = document.createElement('div');
        titleName = document.createElement('h5');
        stateSpan = document.createElement('span'),
          priceOuter = document.createElement('p'),
          priceInner = document.createElement('span'),
          paletteDiv = document.createElement('div'),
          paletteColorDiv = document.createElement('div'),
          paletteSizeSpan = document.createElement('span');
        $(cardImg).css('background-image', 'url(' + itemImg + ')');
        // Item State
        stateSpan.className = 'badge badge-' + tagClass + ' mr-2 align-top';
        // Item Name
        titleDiv.className = 'd-flex align-items-center';
        $(titleName).addClass('mb-0')
        $(titleName).append($(stateSpan).text(tag[state]), title)
        $(titleDiv).append(titleName);
        $(cardBody).append(titleDiv);
        if (tag[soldOut]) {
          var soldOut = document.createElement('div');
          soldOut.className = 'h2 mb-0 position-absolute sold-out text-white d-flex align-items-center justify-content-center';
          $(soldOut).text('SOLD OUT');
          $(cardImg).append(soldOut);
        }

        // Item Price
        priceOuter.className = 'card-text text-muted mt-3';
        priceInner.className = 'price';
        $(cardBody).append($(priceOuter).append(priceInner));
        $(priceInner).text(price);
        if (tag[discount]) {
          var newPrice = Math.ceil(price * tag[discount]),
            newSpan = document.createElement('span');
          newSpan.className = 'price text-danger ml-2';
          $(priceOuter).html('<del class="price">' + price + '</del>');
          $(newSpan).text(newPrice);
          $(priceOuter).append(newSpan);
          $(titleName).prepend('<i class="far fa-clock h4 mb-0 mr-2" title="Time Sale"></i>');
        }


        paletteDiv.className = 'd-flex justify-between align-items-center';
        // Item Colors
        $(colorPalette).each(function (i, color) {
          var span = document.createElement('span');
          color = color;
          span.className = 'color-palette palette__' + color;
          $(paletteColorDiv).append(span);
        });

        // Item Sizes
        var str = '';
        paletteSizeSpan.className = 'palette__size ml-auto';
        $(sizePalette).each(function (i, size) {
          var size = size;
          str += size;
          if (i !== sizePalette.length - 1) {
            str += ' / ';
          }
        });
        $(paletteSizeSpan).text(str);
        $(paletteDiv).append(paletteColorDiv, paletteSizeSpan);
        $(cardBody).append(paletteDiv);
      }
    });

    display.find('.price').each(function() {
      var num = $(this).text();
      $(this).text('NT$ ' + num.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
    });
  }
  function pageNav() {
    $('.page').remove();
    for (var n = 1; n <= pageCount; n++) {
      var pageNav = '<li class="page page-item" data-page="' + (n) + '"><a class="page-link" href="#">' + (n) + '</a></li>';
      $(pageNav).insertBefore($('.next'));
    }
    $('.pagination').find('[data-page="' + page +'"]').not('.prev, .next').addClass('active');
    $('.pagination').find('.next').addClass('disabled');
    $('.pagination').find('.prev').addClass('disabled');
    if (pageCount > 1) {
      $('.pagination').find('.next').removeClass('disabled');
    }
    $('.next').attr('data-page', (page + 1));
  }
  function getFilter() {
    return $('.list-group-item.active').data('list');
  }

})