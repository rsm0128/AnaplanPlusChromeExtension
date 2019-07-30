//////// TOOLTIP FUNCTIONS ////////////////////////////
$.fn.overflown=function(){
  var e=this[0];
  return e.scrollWidth>e.clientWidth;
}

function applyTooltip(flag) {
  if ( $('table.grid.qa-module').length == 0 ) return;
  $('table.grid.qa-module td > div, table.grid.qa-module th > div, table.grid.qa-module th > div > div').each(function(e){
    if ( $(this).overflown() ) {
      if (flag) {
        $(this).attr('title', $(this).text());
      } else {
        $(this).attr('title', '');
      }
    }
  });
}
