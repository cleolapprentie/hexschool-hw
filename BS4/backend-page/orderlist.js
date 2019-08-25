$(document).ready(function () {
  var trigger;
  $('a[href="#"]').on('click', function(e) {
    e.preventDefault();
  });

  $('tbody td:nth-child(3)').each(function() {
    $(this).attr('data-toggle', 'tooltip');
    $(this).attr('data-placement', 'right')
    $(this).attr('title', $(this).text());
  });

  $('tbody td:nth-child(5)').each(customerTag);

  function customerTag() {
    if ($(this).data('customer') && $(this).find('.badge').length === 0) {
      if ($(this).data('customer') === 'problem') {
        $(this).append('<span class="badge badge-pill badge-danger ml-2">奧客</span>');
      } else if ($(this).data('customer') === 'regular') {
        $(this).append('<span class="badge badge-pill badge-success ml-2">常客</span>');
      } else if ($(this).data('customer') === 'vip') {
        $(this).append('<span class="badge badge-pill badge-warning ml-2">VIP</span>')
      } else {
        return;
      }
    }
  }

  $('tbody td:nth-child(7)').each(colorize);

  function colorize() {
    $(this).removeClass('text-danger');
    $(this).parent().removeClass('table-danger');
    $(this).removeClass('text-success');
    if ($(this).text() === '缺貨') {
      $(this).addClass('text-danger');
      $(this).parent().addClass('table-danger');
    } else if ($(this).text() === '已出貨') {
      $(this).addClass('text-success');
    }
  }

  $('tbody td:nth-child(8)').each(calculation);

  function calculation() {
    var target = $(this).siblings(),
        quant = $($(target[3])).text(),
        price = $(target[1]).data('price'),
        total = price * quant,
        d = total.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    $(this).text('$ ' + d);
  }


  $('.add-item').on('click', function() {
    // $('#newOrderModal .modal-body').find('form').append($('.add-new-item').clone());

    var formRow = document.createElement('div');
    var leftCol = document.createElement('div');
    var leftTitle = document.createElement('div');
    var leftInput = document.createElement('div');
    var rightCol = document.createElement('div');
    formRow.className = 'form-row more';
    leftCol.className = 'col-md-9 form-group';
    rightCol.className = 'col-md-3 form-group';
    leftTitle.className = 'form-row';
    leftInput.className = 'input-group col-form-label py-0';
    leftTitle.innerHTML = '<div class="col-3 col-form-label">\
                            <label for="itemNumber" class="mb-0">商品編號</label>\
                          </div>\
                          <div class="col-9 col-form-label">商品名稱</div>';
    leftInput.innerHTML = '<input type="text" id="itemNumber" class="form-control col-3">\
                            <div class="input-group-append col px-0">\
                              <span class="input-group-text w-100" id="sufixId"></span>\
                            </div>';
    rightCol.innerHTML = '<div class="col-form-label">\
                            <label for="newItem-1" class="mb-0">商品數量</label>\
                          </div>\
                          <div class="py-0">\
                            <input type="number" class="form-control quantity-item-1" name="" id="newItem-1" min="0" value="">\
                          </div>';

    leftCol.append(leftTitle, leftInput);
    formRow.append(leftCol, rightCol);
    $('#newOrderModal .modal-body').find('form').append(formRow);
  });

  $('#editModal').on('show.bs.modal', function (e) {
    trigger = $(e.relatedTarget);
    var target = $(this);
    showData(e, trigger, target);
    $('.js--save').on('click', edit);
  });

  $('#editModal').on('hidden.bs.modal', function () {
    // reset
    $('.modal-body').find('input, select').each(function() {
      if ($(this).is('input')) {
        if ($(this).hasClass('readonly')) { return }
        $(this).prop('readonly', false);
      } else {
        $(this).prop('disabled', false);
      }
    })
    $(this).find('select').prop('selectedIndex', 0);
    $('.collapse').collapse('hide');
    $(this).off('click', edit);
    $(this).find('.modal-header').removeClass('bg-danger text-white').addClass('bg-warning');
    $(this).find('.js--save').addClass('btn-warning').removeClass('btn-danger');
    $(this).find('.modal-content').removeClass('modal-delete');
  });

  $('#newOrderModal').on('hidden.bs.modal', function() {
    $('.more').remove();
    $('.total-price > .price').text('0');
  })

  function edit() {
    var targetCol = trigger.parentsUntil('tr').siblings();
    $(targetCol[3]).text($('.quantity-item-1').val());
    $(targetCol[4]).text($('#username').val());
    $(targetCol[5]).text($('#usermail').val())
    $(targetCol[8]).text($('#userphone').val());
    $(targetCol[6]).text($('#orderState').val());
    $(targetCol[6]).attr('data-toggle', 'tooltip');
    $(targetCol[6]).attr('data-title', $('#delivery').val() + ' ' + $('#tracking').val());
    $('tbody td:nth-child(7)').each(colorize);
    $('tbody td:nth-child(8)').each(calculation);
    $('tbody td:nth-child(5)').each(customerTag);
    $('.text-success').tooltip('enable');
    setTimeout(function() {
      $('#editModal').modal('hide');
    }, 300);
  }
  

  function showData(e, trigger, target) {
    var trigger = trigger,
        modal = target,
        title = trigger.data('title'),
        orderNum, orderState, buyerName, buyerMail, buyerPhone, itemCode, itemName, itemQuantity, delivery, trackingCode;


    var colText = trigger.parentsUntil('tr').siblings().map(function(index) {
      var item = $(this).text().trim();
      if (index === 4) {
        var lable = $(this).children().text(),
          name = lable ? $(this).text().split(lable) : $(this).text();
        display = lable ? name[0].trim() : name;
        item = display;
      } else if (index === 6) {
        var el = $(this).data('title') || '';
        delivery = el ? el.slice(0, 2) : '';
        trackingCode = el ? el.split(delivery)[1].trim() : '';
      }
      return item;
    });

    orderNum = colText[0];
    orderState = colText[6]
    buyerName = colText[4];
    buyerMail = colText[5];
    buyerPhone = colText[8];
    itemCode = colText[1];
    itemName = colText[2];
    itemQuantity = colText[3];

    modal.find('.modal-title').text(title + ' #' + orderNum + ' 訂單');
    modal.find('input#username').val(buyerName);
    modal.find('input#usermail').val(buyerMail);
    modal.find('input#userphone').val(buyerPhone);
    modal.find('.item-1').text(itemCode + ' # ' + itemName);
    modal.find('.quantity-item-1').val(itemQuantity);
    modal.find('#tracking').val(trackingCode);

    
    selectionCorrespond('#orderState', orderState);
    selectionCorrespond('#delivery', delivery);

    if (orderState === '已出貨') {
      setTimeout(function() {
        $('#editModal .collapse').collapse('show');
      }, 200)
    }

    $('#orderState').on('change', function (e) {
      if (e.target.value === '已出貨') {
        $('.collapse').collapse('show');
      } else {
        $('.collapse').collapse('hide');
      }
    });

    if (trigger.hasClass('js--delete-order')) {
      modal.find('.modal-header').addClass('bg-danger text-white').removeClass('bg-warning');
      modal.find('.js--save').addClass('btn-danger').removeClass('btn-warning');
      modal.find('.modal-content').addClass('modal-delete');
    }


  }

  function selectionCorrespond(select, value) {
    $(select).find('option').each(function () {
      if ($(this).val() === value) {
        if ($(this).val() === '已出貨') {
          var input = $(this).parentsUntil('.modal-body').find('input, select');
          input.each(function() {
            if ($(this).is('input')) {
              $(this).prop('readonly', true);
            } else {
              $(this).prop('disabled', true);
            }
          });
        }
        $(this).prop('selected', true);
      }
    })
  }

});