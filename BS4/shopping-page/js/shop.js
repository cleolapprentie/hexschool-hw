$(document).ready(function() {
  var page = 1,
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

  
  function getData(fn) {
    $.getJSON('json/data.json')
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

  $('.delete-item').children().css('pointer-events', 'none');



  $('#cart-preview .dropdown-menu').on('click', function(e) {
    e.stopPropagation();
    e.preventDefault();
    if ($(e.target).hasClass('delete-item')) {
      $('#deleteModal').modal({
        backdrop: 'static',
        keyboard: false
      }, e.target);
    }
  });
  $('#deleteModal').on('show.bs.modal', function(e) {
    var target = e.relatedTarget,
        modal = $(this),
        title = '刪除 ' + $(target).parent().next().text(),
        counter = parseInt($('.fa-layers-counter').text());
    modal.find('.modal-title').text(title);
    if (!window.mobileAndTabletcheck()) {
      $('.dropdown-menu').css('margin-right', '17px');
    }
    $('.delete').on('click', function() {
      $(target).parentsUntil('tbody').eq(1).remove();
      modal.modal('toggle');
      counter -= 1;
      $('.fa-layers-counter').text(counter)
      if ($('.itemList').find('tbody').children().length === 0) {
        $('.itemList').find('tbody').append('<tr><td class="text-center pt-3 pb-2" style="color: #aaa">還沒有選擇商品哦</td></tr>');
      }
    });
  });
  $('#deleteModal').on('hidden.bs.modal', function() {
    $('.dropdown-menu').css('margin-right', '');
  });

  $('#deleteModal').on('click', function(e) {
    e.stopPropagation();
  });
  
  // detect if mobile device
  window.mobileAndTabletcheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };

})