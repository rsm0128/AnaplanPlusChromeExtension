//////// ANAPLAN LOGO FUNCTION ///////////////////////
function applyDisableLink(flag) {
  if ( $('.ap-gn__logo').length == 0 ) return;
  var attr = $('.ap-gn__logo').attr('data-href');
  if(attr == undefined || attr == false || attr == '') {
    $('.ap-gn__logo').attr('data-href', $('.ap-gn__logo').attr('href'));
  }

  if (flag) {
    $('.ap-gn__logo').attr('href', '#');
  } else {
    $('.ap-gn__logo').attr('href', $('.ap-gn__logo').data('href'));
  }
}
