//////// GRID FUNCTIONS ///////////////////////////////
function applyGrid(flag) {
  if ( $('.dashboardLayout').length == 0 ) return;

  if (!$('#bpx-grid-style').length) {
    $('body').append("<style id='bpx-grid-style'>.dashboardLayout {background: linear-gradient(-90deg, #ccc 1px, transparent 1px), linear-gradient(#ccc 1px, transparent 1px); background-size: 20px 20px, 20px 20px; } .dashboardWidget {background:#fff;}</style>");
  }
  document.getElementById("bpx-grid-style").disabled = !flag;
}
