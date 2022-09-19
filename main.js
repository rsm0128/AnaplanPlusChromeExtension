var gPrevValue = '';
var gConfigData = {};

//Initialize on opening
applyToaster(gConfigData);
applyPalette(gConfigData);
applyFix();
injectJs(chrome.runtime.getURL('injected.js'));

function injectJs(link) {
  var scr = document.createElement('script');
  scr.type = "text/javascript";
  scr.src = link;
  // document.getElementsByTagName('head')[0].appendChild(scr)
  document.getElementsByTagName('body')[0].appendChild(scr);
}


//Initialize elements once loaded
function timeoutFunction() {
  if ($('.ap-gn__logo').length == 0) {
    setTimeout(timeoutFunction, 100);
    console.log("Waiting for page to fully load...");
  } else {
    applyDisableLink(gConfigData.bpxLink);
    applyHideModelmap(gConfigData.bpxMap);
    applySnippet(gConfigData);
    applyToaster(gConfigData);
    applyPalette(gConfigData);
    applyFix(gConfigData);
  }
}

$(function () { setTimeout(timeoutFunction, 100) });

//Initialize click-dependent elements
$(document).ready(function () {
  $('body').click(function (e) {
    if ($(e.target).closest('.formulaWindow .dijitDialogTitleBar .dijitButton, .formulaWindow .formulaEditorButtonsCell .dijitButton').length) {
      afterModalHidden(e);
    } else {
      setTimeout(function () {
        handleHighlighter(e);
        applyGrid(gConfigData.bpxGrid);
        applyTooltip(gConfigData.bpxTooltip);
      }, 50);
      setTimeout(function () {
        applyTooltip(gConfigData.bpxTooltip);
      }, 2000);
    }
  });

  $('body').click();
});

$(document).keydown(function (e) {
  if ($(newTextarea).length == 0) return;
  var lrud_keys = [37, 38, 39, 40];
  if (lrud_keys.indexOf(event.which) >= 0 && $(oldTextarea).length) {
    if ($(e.target).closest('table.formulaEditorExpressionTable').length) return;
    setTimeout(function () {
      updateFormatting($(oldTextarea).val());
      $(oldTextarea).attr('prev_value', $(oldTextarea).val());
    }, 100);
  }
});


function afterModalHidden(e) {
  setTimeout(function () {
    if ($('.formulaWindow').length) {
      afterModalHidden(e); // wait until the formlar window is removed
    } else {
      e.target = null;
      handleHighlighter(e);
      caretPositionOldToNew();
    }
  }, 100);
}

var prevIsModal = 0;
var curIsModal = 0;

function handleHighlighter(e) {

  if ($('.formulaWindow').length > 0) {
    curIsModal = 1;
  } else {
    curIsModal = 0;
  }
  if (!gConfigData.bpxColor &&
    !gConfigData.bpxIndent &&
    !gConfigData.bpxAutoComplete &&
    !gConfigData.bpxModuleAC &&
    !gConfigData.bpxPropAC
  ) return;
  if ($(e.target).closest('.dijitTabInner.qa-tab').length) {
    setTimeout(function () {
      if ($('.formulaEditorText').length) {
        $('.formulaEditorText').on('keydown', function (e) {
          if (e.key === "Escape" || e.which == 13) {
            afterModalHidden(e);
          }
        });
      }

    }, 1000);
  }
  if ($(oldTextarea).length == 0) return;
  // emulate label click
  if ($(e.target).closest('.formulaEditorRowLabelCell').length) {
    caretPositionOldToNew()
    return;
  }
  // dismiss click on edit panel
  if ($(e.target).closest('table.formulaEditorExpressionTable').length) return;
  let curValue = $(oldTextarea).val();
  if (initHighLighter() || curValue != gPrevValue) updateFormatting(curValue);

  toggleHighlighter(gConfigData.bpxColor || gConfigData.bpxIndent || gConfigData.bpxAutoComplete || gConfigData.bpxModuleAC || gConfigData.bpxPropAC);
  applyColor(gConfigData.bpxColor);
  applyIndent(gConfigData.bpxIndent);
  applyAutocomplete(gConfigData.bpxAutoComplete);
  // refreshHighlighter();

  // // if clicked tab
  if ($(e.target).closest('.dijitTabInner.qa-tab').length) {
    if (prevIsModal != curIsModal) {
      caretPositionOldToNew();
    }
  }

  if (($('.formulaWindow').length == 0) && ($('.formulaEditorLabelTable .formulaEditorButtonsCell > span').length > 0 && $('.formulaEditorLabelTable .formulaEditorButtonsCell > span').eq(0).css('visibility') != 'hidden')) {
    // in edit mode or modal
    caretPositionOldToNew();
  }

  $(oldTextarea).attr('prev_value', curValue);
  gPrevValue = curValue;
  prevIsModal = curIsModal;

}

//////// EXTENSION FUNCTIONS //////////////////////////
chrome.extension.onMessage.addListener(
  function (request, sender, sendResponse) {
    switch (request.action) {
      case 'apply-indent':
        gConfigData.bpxIndent = true;
        refreshHighlighter();
        break;
      case 'disable-indent':
        gConfigData.bpxIndent = false;
        refreshHighlighter();
        break;
      case 'apply-color':
        gConfigData.bpxColor = true;
        refreshHighlighter();
        break;
      case 'disable-color':
        gConfigData.bpxColor = false;
        refreshHighlighter();
        break;
      case 'apply-autocomplete':
        gConfigData.bpxAutoComplete = true;
        refreshHighlighter();
        break;
      case 'disable-autocomplete':
        gConfigData.bpxAutoComplete = false;
        refreshHighlighter();
        break;
      case 'apply-moduleac':
        gConfigData.bpxModuleAC = true;
        refreshHighlighter();
        break;
      case 'disable-moduleac':
        gConfigData.bpxModuleAC = false;
        refreshHighlighter();
        break;
      case 'apply-propac':
        gConfigData.bpxPropAC = true;
        refreshHighlighter();
        break;
      case 'disable-propac':
        gConfigData.bpxPropAC = false;
        refreshHighlighter();
        break;
      case 'apply-grid':
        gConfigData.bpxGrid = true;
        applyGrid(true);
        break;
      case 'disable-grid':
        gConfigData.bpxGrid = false;
        applyGrid(false);
        break;
      case 'apply-tooltip':
        gConfigData.bpxTooltip = true;
        applyTooltip(true);
        break;
      case 'disable-tooltip':
        gConfigData.bpxTooltip = false;
        applyTooltip(false);
        break;
      case 'apply-snippet':
        gConfigData.bpxSnippet = true;
        applySnippet(request.data);
        break;
      case 'disable-snippet':
        gConfigData.bpxSnippet = false;
        applySnippet(request.data);
        break;
      case 'apply-link':
        gConfigData.bpxLink = false;
        applyDisableLink(false);
        break;
      case 'disable-link':
        gConfigData.bpxLink = true;
        applyDisableLink(true);
        break;
      case 'show-map':
        gConfigData.bpxMap = false;
        applyHideModelmap(false);
        break;
      case 'hide-map':
        gConfigData.bpxMap = true;
        applyHideModelmap(true);
        break;
      case 'apply-toaster':
        gConfigData.bpxToaster = true;
        applyToaster(true);
        break;
      case 'disable-toaster':
        gConfigData.bpxToaster = false;
        applyToaster(false);
        break;
      case 'apply-palette':
        gConfigData.bpxPalette = true;
        applyPalette(request.data);
        break;
      case 'disable-palette':
        gConfigData.bpxPalette = false;
        applyPalette(request.data);
        break;
      case 'style_change':
        applyPalette(request.data);
        break;
    }
  }
);

function refreshHighlighter() {
  if ($(oldTextarea).length == 0) return;
  if (initHighLighter() && (gConfigData.bpxColor || gConfigData.bpxIndent || gConfigData.bpxAutoComplete || gConfigData.bpxModuleAC || gConfigData.bpxPropAC)) updateFormatting($(oldTextarea).val());
  toggleHighlighter(gConfigData.bpxColor || gConfigData.bpxIndent || gConfigData.bpxAutoComplete || gConfigData.bpxModuleAC || gConfigData.bpxPropAC);

  applyColor(gConfigData.bpxColor);
  applyIndent(gConfigData.bpxIndent);
  applyAutocomplete(gConfigData.bpxAutoComplete);
}

function readSettings() {
  chrome.storage.local.get(gDefaultSetting, function (items) {
    gConfigData = items;
  });
}

readSettings();
