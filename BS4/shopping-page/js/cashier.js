$(document).ready(function() {
  var filter, scroll;
  $('.delete-item').children().css('pointer-events', 'none');
  $('#copy-value').on('click', function(e) {
    
    var name = $('#buyer-name').val(),
        mobile = $('#buyer-mobile').val(),
        email = $('#buyer-email').val(),
        city = $('#buyer-city').val(),
        district = $('#buyer-district').val(),
        zipcode = $('#buyer-zipcode').val(),
        address = $('#buyer-address').val();

    if ($(this).prop('checked')) {
      $('#recipient-name').val(name);
      $('#recipient-mobile').val(mobile);
      $('#recipient-email').val(email);
      $('#recipient-city').val(city);
      $('#recipient-district').val(district);
      $('#recipient-zipcode').val(zipcode);
      $('#recipient-address').val(address);
      if (city) {
        $('#recipient-city').parent().find('.selected-item').text(city);
      }
      $('#recipient-district').parent().find('.selected-item').text(district);
    } else {
      $('#recipient-name').val('');
      $('#recipient-mobile').val('');
      $('#recipient-email').val('');
      $('#recipient-city').val('');
      $('#recipient-district').val('');
      $('#recipient-zipcode').val('');
      $('#recipient-address').val('');
      $('#recipient-city').parent().find('.selected-item').text('請選擇縣市');
      $('#recipient-district').parent().find('.selected-item').text('');
    }
  });



  $.getJSON('vendor/TaiwanAddress/AllData.json')
    .done(function(data) {
      var distObj;
      getCity(data);
      $('.city').next().on('click', function(e) {
        filter = $(e.target).text();
        $(this).parent().find('option[value="' + filter + '"]').prop('selected', true);
        var selectedShow = $(this).parent().find('.selected-item'),
            selectedItem = $(this).parent().find(':selected'),
            distSelect = $('.district').parent().find('.selected-item');
        distSelect.removeClass('invisible');
        distObj = getDist(data);
        selectedShow.text(selectedItem.val());
        $(this).parent().next().find('.selected-item').text('請選擇鄉鎮區');
      });
      $('.district').next().on('click', function(e) {
        filter = $(e.target).text();
        $(this).parent().find('option[value="' + filter + '"]').prop('selected', true);
        var selectedShow = $(this).parent().find('.selected-item'),
            selectedItem = $(this).parent().find(':selected'),
            $zipCodeInput = $(this).parent().next().find('input');
        selectedShow.text(selectedItem.val());
        var dist = distObj.find(function(item) {
          return item.AreaName === filter;
        });
        $zipCodeInput.val(dist.ZipCode);
      });
    });

  $('.city').on('click', function(e) {
    e.stopPropagation();
    var target = $(e.target).next();
    selectDropdown(target);
  });
  $('.district').on('click', function(e) {
    e.stopPropagation();
    var target = $(e.target).next();
    selectDropdown(target);
  });
  $('.custom-select').on('change', function(e) {
    var target = $(e.target).parent().find('.select-option');
    selectDropdown(target);
  });

  function getCity(data) {
    var option = [],
        target = $('.city').next();
    data.forEach(function(cityObj) {
      option.push(cityObj.CityName);
    });
    $(target).each(function() {
      createOption(option, $(this));
    });
  }

  function getDist(data) {
    var option = [],
        target = $('.district').next();
    var dists = data.find(function(item) {
      return item.CityName === filter;
    });
    dists.AreaList.forEach(function(cityObj) {
      option.push(cityObj.AreaName);
    });
    $(target).each(function() {
      createOption(option, $(this));
    });
    return dists.AreaList;
  }


  function createOption(option, target) {
    target.html('');
    var select = target;
    setTimeout(function() {
      option.forEach(function(el) {
        var optionCustom = document.createElement('li'),
            optionNormal = document.createElement('option');
        $(optionCustom).text(el);
        $(optionNormal).text(el);
        $(optionNormal).val(el);
        $(select).append(optionCustom);
        $(target).parent().find('select').append(optionNormal);
      });
      $(target).parent().find('select').prop('selectedIndex', -1);
    }, 400);
  }

  function selectDropdown(target) {
    var selected = filter || target.parent().find('option:selected').val();
    target.children().each(function() {
      $(this).attr('style', '');
      if ($(this).text() === selected) {
        var scroll = $(this)[0].offsetTop;
        $(this).css('background-color', '#eee');
        $(this).parent().scrollTop(scroll);
      }
    });
    // target.parent().find('.selected-item').text(selected);
    $(target).toggleClass('invisible');
    $('body').on('click', function(e) {
      $(target).addClass('invisible');
    });
  }


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
  
  

  $('.price').each(function() {
    var num = $(this).text();
    $(this).text('NT$ ' + num.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
  });


  // detect if mobile device
  window.mobileAndTabletcheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };
});