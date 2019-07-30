//////// TOASTER FUNCTIONS ///////////////////////////////
function applyFix() {
    $('#fix-style').remove();
    var cssStr = ""  
      //Fix Scrambling Screen
      +'.claro .dijitTooltipDialogPopup{margin-top:-200px !important;}'
    ;

    $('head').append("<style id='fix-style'>" + cssStr + "</style>");
  }
  