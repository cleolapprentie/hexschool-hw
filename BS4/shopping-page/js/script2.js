$(document).ready(function() {
  var data = $.getJSON("wearing.json", switchList);


  function printItems(data, filter) {
    var display = $('#displayItems');
    display.empty();
    $.each(data, function(i, el) {
      var category = el.itemCategory;
      console.log(el.itemCategory);
      if (filter !== category) { return; }
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
        var soldOutText = document.createElement('div');
        soldOutText.className = 'h2 mb-0 position-absolute sold-out text-white d-flex align-items-center justify-content-center';
        $(soldOutText).text('SOLD OUT');
        $(cardImg).append(soldOutText);
      }

      // Item Price
      priceOuter.className = 'card-text text-muted mt-3';
      priceInner.className = 'price';
      $(cardBody).append($(priceOuter).append(priceInner));
      $(priceInner).text(price);
      if (tag[discount]) {
        var newPrice = price * tag[discount],
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
    });
    if (display.children().length === 0) {
      $(display).addClass('not-found');
      display.html('<div class="col-12 d-flex justify-content-center align-items-center">\
        <div class="h4 font-weight-bold" style="font-family: lato; color: #ccc; letter-spacing: 0.2rem">No items found</div></div>')
    }
  };
  
  data.done(function() {
    $('.price').each(function() {
      var num = $(this).text();
      $(this).text('$ ' + num.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
    });
    $('a[href="#"]').on('click', function (e) {
      e.preventDefault();
    });
    // $('.add-to-fav').on('click', function (e) {
    //   e.preventDefault();
    //   console.log(e.target)
    //   if ($(this).find('i').hasClass('far')) {
    //     $(this).find('i').removeClass('far').addClass('fas');
    //   } else {
    //     $(this).find('i').removeClass('fas').addClass('far');
    //   }
    // });
  });

  function switchList(data) {
    var filter = $('.list-group-item.active').data('list');
    printItems(data, filter);
    $('.list-group-item').on('click', function(e) {
      e.preventDefault();
      $('displayItems').removeClass('not-found');
      var target = e.target;
      $(this).siblings().each(function() {
        $(this).removeClass('active')
      });
      $(target).addClass('active');
      filter = $('.list-group-item.active').data('list');
      printItems(data, filter);
    });
  }

  $('#cart-preview .dropdown-menu').on('click', function(e) {
    e.stopPropagation();
  });

  

});