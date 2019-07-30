//////// TOASTER FUNCTIONS ///////////////////////////////
function applyToaster(configData) {
    $('#toaster-style').remove();
    var cssStr = ""  
      //Toaster
      +'.original .dijitToasterClip{bottom: 10px !important; right: 10px !important; top: unset !important; left: unset !important}'
    ;

    $('head').append("<style id='toaster-style'>" + cssStr + "</style>");
    document.getElementById("toaster-style").disabled = !configData.bpxToaster;
  }
  