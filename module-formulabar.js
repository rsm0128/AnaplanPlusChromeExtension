//////// HIGHLIGHTER FUNCTIONS ///////////////////////////////

function isLetter(str) {
  return str != undefined && str.length === 1 && str.match(/[a-z_]/i);
}

function getIndicesOf(searchStr, str, caseSensitive) {
  var searchStrLen = searchStr.length;
  if (searchStrLen == 0) {
    return [];
  }
  var startIndex = 0, index, indices = [];
  if (!caseSensitive) {
    str = str.toLowerCase();
    searchStr = searchStr.toLowerCase();
  }
  while ((index = str.indexOf(searchStr, startIndex)) > -1) {
    indices.push(index);
    startIndex = index + searchStrLen;
  }
  return indices;
}

function getSelectionCharacterOffsetWithin(element) {
  var start = 0;
  var end = 0;
  var doc = element.ownerDocument || element.document;
  var win = doc.defaultView || doc.parentWindow;
  var sel;
  if (typeof win.getSelection != "undefined") {
    sel = win.getSelection();
    if (sel.rangeCount > 0) {
      var range = win.getSelection().getRangeAt(0);
      var preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.startContainer, range.startOffset);
      start = preCaretRange.toString().length;
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      end = preCaretRange.toString().length;
    }
  } else if ((sel = doc.selection) && sel.type != "Control") {
    var textRange = sel.createRange();
    var preCaretTextRange = doc.body.createTextRange();
    preCaretTextRange.moveToElementText(element);
    preCaretTextRange.setEndPoint("EndToStart", textRange);
    start = preCaretTextRange.text.length;
    preCaretTextRange.setEndPoint("EndToEnd", textRange);
    end = preCaretTextRange.text.length;
  }
  return { start: start, end: end };
}

function getTextNodesIn(node) {
  var textNodes = [];
  if (node.nodeType == 3) {
    textNodes.push(node);
  } else {
    var children = node.childNodes;
    for (var i = 0, len = children.length; i < len; ++i) {
      textNodes.push.apply(textNodes, getTextNodesIn(children[i]));
    }
  }
  return textNodes;
}

function setSelectionRange(el, start, end) {
  if (document.createRange && window.getSelection) {
    var range = document.createRange();
    range.selectNodeContents(el);
    var textNodes = getTextNodesIn(el);
    var foundStart = false;
    var charCount = 0, endCharCount;

    for (var i = 0, textNode; textNode = textNodes[i++];) {
      endCharCount = charCount + textNode.length;
      if (!foundStart && start >= charCount
        && (start < endCharCount ||
          (start == endCharCount && i <= textNodes.length))) {
        range.setStart(textNode, start - charCount);
        foundStart = true;
      }
      if (foundStart && end <= endCharCount) {
        range.setEnd(textNode, end - charCount);
        break;
      }
      charCount = endCharCount;
    }

    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  } else if (document.selection && document.body.createTextRange) {
    var textRange = document.body.createTextRange();
    textRange.moveToElementText(el);
    textRange.collapse(true);
    textRange.moveEnd("character", end);
    textRange.moveStart("character", start);
    textRange.select();
  }
}

function formatText(srcStr) {
  var srcStrLen = srcStr.length;

  // highest priority find single quote
  var sQuoteIndices = getIndicesOf("'", srcStr, true);
  var dQuoteIndices = getIndicesOf('"', srcStr, true);
  var sQuoteStarted = false;
  var dQuoteStarted = false;

  var i;
  var quotePairArr = [];
  for (i = 0; i < srcStrLen; i++) {
    if (!dQuoteStarted && sQuoteIndices.indexOf(i) >= 0) {
      quotePairArr.push(i);
      sQuoteStarted = !sQuoteStarted;
    } else if (!sQuoteStarted && dQuoteIndices.indexOf(i) >= 0) {
      quotePairArr.push(i);
      dQuoteStarted = !dQuoteStarted;
    }
  }

  // find if position
  var ifIndices = getIndicesOf("if", srcStr, false);
  var thenIndices = getIndicesOf("then", srcStr, false);
  var elseIndices = getIndicesOf("else", srcStr, false);
  var logicMathIndices = {
    'logic': {
      "and": getIndicesOf("and", srcStr, false),
      "or": getIndicesOf("or", srcStr, false),
      "not": getIndicesOf("not", srcStr, false),
    },
    'math': {
      "plus": getIndicesOf("+", srcStr, false),
      "minus": getIndicesOf("-", srcStr, false),
      "multiple": getIndicesOf("*", srcStr, false),
      "divide": getIndicesOf("/", srcStr, false),
      "equal": getIndicesOf("=", srcStr, false),
      "&": getIndicesOf("&", srcStr, false),
      "gt": getIndicesOf(">", srcStr, false),
      "lt": getIndicesOf("<", srcStr, false),
    },
    'syntax': {
      "comma": getIndicesOf(",", srcStr, false),
    }
  };

  var highlights = [];
  var totalParDepth = 0;
  var parFuncDepth = 0;
  var braFuncDepth = 0;
  var curIteDepth = 0;
  var thenStack = [];

  for (i = 0; i < srcStrLen; i++) {
    let quoteOrder = quotePairArr.indexOf(i);
    if (quoteOrder >= 0) {
      if (quoteOrder < quotePairArr.length) {
        // if it's not last quote then skip
        i = quotePairArr[quoteOrder + 1];
        continue;
      } else {
        // if last quote then break
        break;
      }
    } else if (srcStr[i] == '(') {
      if (i > 0 && isLetter(srcStr[i - 1])) {
        // if parenthesis open, but before letter is character then it is function
        parFuncDepth++;

        let subStr = srcStr.slice(0, i);
        let matches = subStr.match(/[a-z_]+/gi);
        let lastMatch = matches[matches.length - 1];
        let pos = subStr.lastIndexOf(lastMatch);

        highlights[pos] = { type: "func", len: lastMatch.length };
      }

      highlights[i] = { depth: totalParDepth, type: "open", len: 1 };
      totalParDepth++;
    } else if (srcStr[i] == ')') {
      if (parFuncDepth > 0) {
        parFuncDepth--;
      }

      totalParDepth--;
      highlights[i] = { depth: totalParDepth, type: "close", len: 1 };
    } else if (srcStr[i] == '[') {
      if (i > 0 && isLetter(srcStr[i + 1])) {
        highlights[i] = { depth: braFuncDepth, type: "braopen", len: 1 };
        highlights[i + 1] = { type: "braContentStart", count: 1 };
        braFuncDepth++;
      }
    } else if (srcStr[i] == ']') {
      highlights[i - 1] = { type: "braContentEnd", count: 1 };
      highlights[i] = { depth: braFuncDepth, type: "braclose", len: 1 };
      braFuncDepth--;
    } else if (ifIndices.indexOf(i) >= 0) {
      let charLen = 2;
      if ((i == 0 || !isLetter(srcStr[i - 1])) && (i == srcStrLen - charLen || !isLetter(srcStr[i + charLen]))) {
        highlights[i] = { type: "ite", len: charLen + 1, depth: curIteDepth };
        highlights[i + charLen - 1] = { type: "indentStart", count: 1 };
      }

      i += charLen; // for perfomance skip next charLen characters
    } else if (thenIndices.indexOf(i) >= 0) {
      let charLen = 4;
      if ((i == 0 || !isLetter(srcStr[i - 1])) && (i == srcStrLen - charLen || !isLetter(srcStr[i + charLen]))) {
        highlights[i - 1] = { type: "indentEnd", count: 1 }; // add indent end tag for if
        highlights[i] = { type: "ite", len: charLen + 1, depth: curIteDepth }; // add highlight for then
        highlights[i + charLen - 1] = { type: "indentStart", count: 1 }; // add indent open tag for then
        curIteDepth++; // curIteDepth increase
        thenStack.push(curIteDepth); // add current depth to thenStack
      }

      i += charLen; // for perfomance skip next charLen characters
    } else if (elseIndices.indexOf(i) >= 0) {
      let charLen = 4;
      if ((i == 0 || !isLetter(srcStr[i - 1])) && (i == srcStrLen - charLen || !isLetter(srcStr[i + charLen]))) {
        if (thenStack.length > 0) { // validation
          let thenDepth = thenStack.pop(); // pop last then from thenStack
          highlights[i - 1] = { type: "indentEnd", count: curIteDepth - thenDepth + 1 }; // add indent end tag as much as indent different
          curIteDepth = thenDepth;

          highlights[i] = { type: "ite", len: charLen + 1, depth: curIteDepth - 1 }; // add highlight for then
          highlights[i + charLen - 1] = { type: "indentStart", count: 1 }; // add indent start tag for else
        }
      }
      i += charLen; // for perfomance skip next charLen characters
    } else {
      let retVal = logicMathHandler(srcStr, i, logicMathIndices);
      if (retVal) {
        highlights[i] = retVal;
        i += retVal["len"] - 1; // for perfomance skip next charLen characters
      }
    }
  }

  // array key reverse
  var keys = new Array();
  for (var k in highlights) {
    keys.unshift(k);
  }

  var destStr = srcStr;
  for (var c = keys.length, n = 0; n < c; n++) {
    var curPos = parseInt(keys[n]);
    var curHighLights = highlights[curPos];
    var curType = curHighLights.type;
    var curLen = curHighLights.len;
    var classStr = 'bpx-highlight';

    if (curType == "open" || curType == "close") {
      var curDepth = curHighLights.depth;
      if (totalParDepth > 0) curDepth -= totalParDepth;
      classStr += ' bpx-bracket bpx-bracket-' + (curDepth < 0 ? 'wrong' : curDepth);
    } else if (curType == "ite") {
      var curDepth = curHighLights.depth;
      classStr += ' bpx-ite bpx-ite-' + (curDepth < 0 ? 'wrong' : curDepth);
    } else {
      classStr += ' bpx-' + curType;
    }

    if (curType == "indentStart") {
      destStr = [destStr.slice(0, curPos + 2), '<span class="' + classStr + '">'.repeat(curHighLights.count), destStr.slice(curPos + 2)].join('');
    } else if (curType == "indentEnd") {
      destStr = [destStr.slice(0, curPos + 1), '</span>'.repeat(curHighLights.count), destStr.slice(curPos + 1)].join('');
    } else if (curType == "braContentStart") {
      destStr = [destStr.slice(0, curPos), '<span class="' + classStr + '">'.repeat(curHighLights.count), destStr.slice(curPos)].join('');
    } else if (curType == "braContentEnd") {
      destStr = [destStr.slice(0, curPos + 1), '</span>'.repeat(curHighLights.count), destStr.slice(curPos + 1)].join('');
    } else {
      destStr = [destStr.slice(0, curPos), '<span class="' + classStr + '">', destStr.slice(curPos, curPos + curLen), '</span>', destStr.slice(curPos + curLen)].join('');
    }
  }

  return destStr;
};

function logicMathHandler(srcStr, i, indiceArr) {
  let logicMathOperators = {
    'logic': {
      'and': 3,
      'or': 2,
      'not': 3,
    },
    'math': {
      'plus': 1,
      'minus': 1,
      'multiple': 1,
      'divide': 1,
      'equal': 1,
      '&': 1,
      'gt': 1,
      'lt': 1,
    },
    'syntax': {
      'comma': 1,
    }
  }

  srcStrLen = srcStr.length;

  for (var type_key in logicMathOperators) {
    for (var op_key in logicMathOperators[type_key]) {
      if (indiceArr[type_key][op_key].indexOf(i) >= 0) {
        let charLen = logicMathOperators[type_key][op_key];
        if ((i == 0 || !isLetter(srcStr[i - 1])) && (i == srcStrLen - charLen || !isLetter(srcStr[i + charLen]))) {
          return { type: type_key, len: charLen };
        }
      }
    }
  }

  return false;
}

function updateFormatting(srcStr) {
  if (!/ $/.test(srcStr)) {
    srcStr += ' ';
  }
  let destStr = formatText(srcStr);

  $(newTextarea).html(destStr);
  $(oldTextarea).val($(newTextarea).text().trim());
}

/* function getCaretPosition(element) {
  var caretOffset = 0;
  var range = window.getSelection().getRangeAt(0);
  var preCaretRange = range.cloneRange();
  preCaretRange.selectNodeContents(element);
  preCaretRange.setEnd(range.endContainer, range.endOffset);
  caretOffset = preCaretRange.toString().length;
  return caretOffset;
} */

// node_walk: walk the element tree, stop when func(node) returns false
function node_walk(node, func) {
  var result = func(node);
  for (node = node.firstChild; result !== false && node; node = node.nextSibling)
    result = node_walk(node, func);
  return result;
};

// getCaretPosition: return [start, end] as offsets to elem.textContent that
//   correspond to the selected portion of text
//   (if start == end, caret is at given position and no text is selected)
function getCaretPosition(elem) {
  var sel = window.getSelection();
  var cum_length = [0, 0];

  if (sel.anchorNode == elem)
    cum_length = [sel.anchorOffset, sel.extentOffset];
  else {
    var nodes_to_find = [sel.anchorNode, sel.extentNode];
    if (!elem.contains(sel.anchorNode) || !elem.contains(sel.extentNode))
      return undefined;
    else {
      var found = [0, 0];
      var i;
      node_walk(elem, function (node) {
        for (i = 0; i < 2; i++) {
          if (node == nodes_to_find[i]) {
            found[i] = true;
            if (found[i == 0 ? 1 : 0])
              return false; // all done
          }
        }

        if (node.textContent && !node.firstChild) {
          for (i = 0; i < 2; i++) {
            if (!found[i])
              cum_length[i] += node.textContent.length;
          }
        }
      });
      cum_length[0] += sel.anchorOffset;
      cum_length[1] += sel.extentOffset;
    }
  }
  if (cum_length[0] <= cum_length[1])
    return cum_length;
  return [cum_length[1], cum_length[0]];
}

function toggleHighlighter(flag) {
  if (flag) {
    $(newTextarea).show();
    $(oldTextarea).hide();
  } else {
    $(oldTextarea).show();
    $(newTextarea).hide();
  }
}

function applyColor(flag) {
  document.getElementById("bpx-color-style").disabled = !flag;
}

//////// INDENTATION FUNCTIONS ////////////////////////
function applyIndent(flag) {
  document.getElementById("bpx-indentation-style").disabled = !flag;
}

function applyAutocomplete(flag) {
  if (!flag && $('.autocomplete-items').length) {
    $('.autocomplete-items').remove();
  }
}

function caretPositionNewToOld() {
  var el = $(newTextarea).get(0);
  if (el == undefined) return;
  var position = getCaretPosition(el);
  if (position == undefined) return;
  if ($(oldTextarea).length > 0 && position.length > 0) {
    $(oldTextarea)[0].setSelectionRange(position[0], position[1]);
    gCarretPosition = position;
  }
}

function caretPositionOldToNew() {
  var el = $(oldTextarea).get(0);

  if ($(newTextarea).length) {
    setSelectionRange($(newTextarea).get(0), el.selectionStart, el.selectionEnd);
  }
}

//////// FORMULA COLOR & EVENT HANDLER FUNCTIONS //////
var acdata;
function initHighLighter() {
  // if already exists dismiss it
  if ($(newTextarea).length) return false;

  // remove all legacy objects
  $('.formated_text').remove();
  $('.formulaEditorText').show();
  $('#bpx-main-style').remove();
  $('#bpx-color-style').remove();
  $('#bpx-indentation-style').remove();
  $('#bpx-autocomplete-style').remove();

  $(oldTextarea).before('<code class="formated_text" id="formated_text" style="font-family:Helvetica" contenteditable="true"></code>');
  $(oldTextarea).before("<style id='bpx-main-style'>" +
    ".original .formulaEditorExpressionTable{table-layout: fixed;} " +
    newTextarea + "{overflow: auto;display:none; font-size: 12px; min-width:40px; min-height:20px; display:block; width:100%; height:100%; box-sizing: border-box;border: 1px solid #ccc!important; padding: 9px; white-space: pre-wrap;}" +
    "</style>");
  $(oldTextarea).before("<style id='bpx-color-style' disabled>.bpx-bracket-wrong {color: " + bpx_bracket_wrong + ";} .bpx-bracket-0 {color: " + bpx_bracket_0 + ";} .bpx-bracket-1 {color: " + bpx_bracket_1 + ";} .bpx-bracket-2 {color: " + bpx_bracket_2 + ";} .bpx-bracket-3 {color: " + bpx_bracket_3 + ";} .bpx-bracket-4 {color: " + bpx_bracket_4 + ";}" +
    " .bpx-ite-0 {color: " + bpx_ite_0 + ";} .bpx-ite-1 {color: " + bpx_ite_1 + ";} .bpx-ite-2 {color: " + bpx_ite_2 + ";} .bpx-ite-3 {color: " + bpx_ite_3 + ";} .bpx-ite-4 {color: " + bpx_ite_4 + ";} .bpx-func {color: " + bpx_func + ";} .bpx-brafunc{color: " + bpx_brafunc + "; font-weight: bold;} .bpx-brafunc, .bpx-bracket, .bpx-ite, .bpx-func, .bpx-braopen, .bpx-braclose{font-weight:bold;} .bpx-braContentStart{color: " + bpx_braContentStart + ";font-weight: bold;} .bpx-logic{font-weight:bold; color:" + bpx_logic + ";} .bpx-math{font-weight:bold; color:" + bpx_math + ";} .bpx-syntax{font-weight:bold; color:" + bpx_syntax + ";}</style>");
  $(oldTextarea).before("<style id='bpx-indentation-style' disabled>.bpx-ite {display: block;} .bpx-indentStart {display:block; margin-left: 30px;}</style>");
  $(oldTextarea).before("<style id='bpx-autocomplete-style'>.formulaEditorExpressionCell{position:relative}.autocomplete-items { position: absolute; max-height: 400px; overflow-y: auto; border: 1px solid #d4d4d4; z-index: 99; top: 0; min-width: 180px; font-size:10px; } .autocomplete-items:empty{border-bottom: none; border-top: none;} .autocomplete-items div:first-child{border-top: 1px solid #d4d4d4;} .autocomplete-items div { padding: 5px 8px; cursor: pointer; background-color: #fff; border-bottom: 1px solid #d4d4d4; } .autocomplete-items div:hover { background-color: #abe3ff; } .autocomplete-active { background-color: #2BB8FF !important; color: #ffffff; } .autocomplete-items .ac-item:before { color: #33f; border: 1px solid #33f; font-size: 12px; padding: 0 3px; margin-right: 6px; text-align: center; width: 8px; display: inline-block; } .autocomplete-items .item-func:before{ content: 'fx'; }.autocomplete-items .item-module:before{ content: 'M'; }.autocomplete-items .item-list:before{ content: 'LI'; }.autocomplete-items .item-lpList:before{ content: 'L'; }.autocomplete-items .item-lpProp:before{ content: 'P'; }</style>");

  document.getElementById("bpx-indentation-style").disabled = true;

  var el = $(newTextarea).get(0);

  acdata = {};

  var arr = [];
  el.addEventListener("input", function (e) {
    let selection = getSelectionCharacterOffsetWithin(el);

    // autocomplete function
    if (gConfigData.bpxAutoComplete || gConfigData.bpxModuleAC || gConfigData.bpxPropAC) {
      var caretPos = getCaretPosition(this);
      var val = returnWord(el.textContent, caretPos[0]);

      /*close any already open lists of autocompleted values*/
      closeAllLists();

      arr = [];
      if (gConfigData.bpxAutoComplete) {
        arr = arr.concat(gAutocompleteList);
      }

      // flag
      var flList = false;
      var listName = '';
      var key = '';
      if (gConfigData.bpxModuleAC || gConfigData.bpxPropAC) {

        // create receiver element if not exists
        if (!document.getElementById("page-to-ext")) {
          var a = document.createElement("DIV");
          a.setAttribute("id", "page-to-ext");
          a.addEventListener('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            var data = document.getElementById('page-to-ext').getAttribute('data-result');
            var target = document.getElementById('ext-to-page').getAttribute('data-target');
            acdata[target] = JSON.parse(data);
          });
          document.getElementsByTagName('body')[0].appendChild(a);
        }

        // init moduel data
        var flag = 0;
        if (gConfigData.bpxModuleAC) flag += 2;
        if (gConfigData.bpxPropAC) flag += 1;
        extGetAnaplanList(flag);

        // if period inputed then init list data
        if (e.data == "." || el.textContent[caretPos[0] - val.length - 1] == ".") {
          listName = returnListName(el.textContent, caretPos[0] - val.length);
          if (listName) {
            arr = [];
            extGetAnaplanProperty(flag, listName);
            flList = true;
          }
        }

        if (flList) {
          key = "l_" + listName;
        } else {
          key = "modelData";
        }
      }
      if (val || flList) {
        var count = 0;
        function waitForAcData() {
          if ((gConfigData.bpxModuleAC || gConfigData.bpxPropAC) && !(key in acdata)) {
            if (count > 4) {
              console.log('timeout');
              return;
            }
            setTimeout(waitForAcData, 250);
            count++;
          } else {
            if (gConfigData.bpxModuleAC || gConfigData.bpxPropAC) {
              arr = acdata[key].concat(arr);
            }

            var a, b, i;
            currentFocus = 0;
            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", el.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            el.parentNode.appendChild(a);

            var coords = getSelectionCoords();
            var viewportOffset = el.parentNode.getBoundingClientRect();
            a.style.top = (coords.y + 18 - viewportOffset.top) + 'px';
            var left = (coords.x - viewportOffset.left);
            if (a.offsetWidth + left > a.parentElement.offsetWidth) {
              a.style.right = "10px";
            } else {
              a.style.left = (coords.x - viewportOffset.left) + 'px';
            }

            /*for each item in the array...*/
            for (i = 0; i < arr.length; i++) {
              /*check if the item starts with the same letters as the text field value:*/
              var searchTxt = arr[i].name;
              var replaceText = arr[i].label;
              if (searchTxt.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                b.classList.add('ac-item');
                b.classList.add('item-' + arr[i].type);
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + replaceText.substr(0, val.length) + "</strong>";
                b.innerHTML += replaceText.substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value=\"" + searchTxt + "\" data-type='" + arr[i].type + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                  /*insert the value for the autocomplete text field:*/
                  // inp.value = this.getElementsByTagName("input")[0].value;
                  e.stopPropagation();
                  var replaceText = this.getElementsByTagName("input")[0].value;
                  var type = this.getElementsByTagName("input")[0].getAttribute("data-type");
                  if (type == "module" || type == "list" || type == "lpList" || type == "lpProp") {
                    replaceText = "'" + replaceText.replace("'", "''") + "'";
                  }
                  replaceWord(el, caretPos[0], replaceText);

                  /*close the list of autocompleted values,
                  (or any other open lists of autocompleted values:*/
                  closeAllLists();
                });
                a.appendChild(b);
              }
            }
            if (a.firstElementChild != null) {
              addActive(a.getElementsByTagName("div"));
            }
            updateFormatting(el.textContent);
            setSelectionRange(el, selection.start, selection.start);
            return;
          }
        }
        waitForAcData();
        return;
      }
    }

    updateFormatting(el.textContent);
    setSelectionRange(el, selection.start, selection.start);
  }, false);

  el.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      $(newTextarea).hide();
      $(oldTextarea).show();
      $(oldTextarea)[0].focus();
      $(oldTextarea).hide();
      $(newTextarea).show();
    }

    if (e.key != "Escape" && e.key != "Enter") {
      $(oldTextarea)[0].dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    }

    // auto complete
    if (gConfigData.bpxAutoComplete || gConfigData.bpxModuleAC || gConfigData.bpxPropAC) {
      var x = document.getElementById(this.id + "autocomplete-list");
      // if (x) x = x.getElementsByTagName("div");
      // if autocomplete is not available then return false;
      if (x) {
        x = x.getElementsByTagName("div");
      } else {
        return;
      }

      if (x.length == 0) return;

      if (e.keyCode == 40) {
        e.preventDefault();
        e.stopPropagation();
        /*If the arrow DOWN key is pressed, increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        e.preventDefault();
        e.stopPropagation();
        /*If the arrow UP key is pressed, decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        e.stopPropagation();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        closeAllLists();
        return;
      }
    }

    propagate(e);
  });

  propagate = function (e) {
    var new_e = new e.constructor(e.type, e);
    $(oldTextarea)[0].dispatchEvent(new_e);
    setTimeout(function () {
      caretPositionNewToOld();
    }, 10);
  }

  el.addEventListener("mousedown", propagate);
  el.addEventListener("mouseup", propagate);
  el.addEventListener("keyup", propagate);
  // el.addEventListener("keydown", propagate);

  // esc key
  $(document).keydown(function (e) {
    if (e.key === "Escape") {
      if ($(oldTextarea).length > 0) {
        $(oldTextarea)[0].dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, keyCode: 27 }));
        updateFormatting($(oldTextarea).val());
        return false;
      }
    }
  });

  // double click
  $(newTextarea).dblclick(function () {
    $(oldTextarea)[0].dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
  });

  //  click on validate or cancel
  $('.formulaEditorButtonsCell .dijitButtonNode').click(function () {
    updateFormatting($(oldTextarea).val());
  });

  // update formating functions
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");

    // scrollTo function
    var wrapper = x[0].parentElement;
    var stageHeight = wrapper.offsetHeight;
    // var scrollHeight = wrapper.scrollHeight;
    var scrollTop = wrapper.scrollTop;
    var activeY = x[currentFocus].offsetTop;
    var activeH = x[currentFocus].offsetHeight;
    if (scrollTop > activeY) {
      wrapper.scrollTop = activeY;
    } else if (scrollTop + stageHeight < activeY + activeH) {
      wrapper.scrollTop = activeY + activeH - stageHeight + 2;
    }
  }

  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != el) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }

  function extGetAnaplanList(flag) {
    // if modelData is already initialized then return
    // if (acdata.modelData != null) return;

    document.getElementById('ext-to-page').setAttribute('data-action', 'getAnaplanList(' + flag + ')');
    document.getElementById('ext-to-page').setAttribute('data-target', 'modelData');
    document.getElementById('ext-to-page').click();
  }

  function extGetAnaplanProperty(flag, listName) {
    // if (('l_' + listName) in acdata) return;
    if (('l_' + listName) in acdata) delete acdata['l_' + listName];
    document.getElementById('ext-to-page').setAttribute('data-action', 'getAnaplanProperty(' + flag + ',"' + listName + '")');
    document.getElementById('ext-to-page').setAttribute('data-target', 'l_' + listName);
    document.getElementById('ext-to-page').click();
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    if (e.target.id != 'page-to-ext' && e.target.id != 'ext-to-page') {
      closeAllLists(e.target);
    }
  });

  return true;
}


function returnListName(text, caretPos) {
  if (text[caretPos - 2] != "'") return false;
  var preText = text.substring(0, caretPos);
  var words = preText.split(/'/);
  if (words.length < 3) return false; // in the case only one single quote in the string
  return words[words.length - 2]; //return last word
}

function returnWord(text, caretPos) {
  if (text.length > caretPos && isLetter(text[caretPos])) return false;
  var preText = text.substring(0, caretPos);
  var words = preText.split(/[^A-Za-z&0-9]/);
  return words[words.length - 1]; //return last word
}

function replaceWord(element, caretPos, replaceText) {
  var text = element.textContent;
  var preText = text.substring(0, caretPos);
  var n = preText.search(/[^A-Za-z&0-9]([A-Za-z&0-9]*$)/);
  element.textContent = text.substring(0, n + 1) + replaceText + text.substring(caretPos);
  caretPos = n + replaceText.length + 1;
  updateFormatting(element.textContent);
  element.focus();
  setSelectionRange(element, caretPos, caretPos);
}

function getSelectionCoords(win) {
  win = win || window;
  var doc = win.document;
  var sel = doc.selection, range, rects, rect;
  var x = 0, y = 0;
  if (sel) {
    if (sel.type != "Control") {
      range = sel.createRange();
      range.collapse(true);
      x = range.boundingLeft;
      y = range.boundingTop;
    }
  } else if (win.getSelection) {
    sel = win.getSelection();
    if (sel.rangeCount) {
      range = sel.getRangeAt(0).cloneRange();
      if (range.getClientRects) {
        range.collapse(true);
        rects = range.getClientRects();
        if (rects.length > 0) {
          rect = rects[0];
          x = rect.left;
          y = rect.top;
        }
      }
      // Fall back to inserting a temporary element
      if (x == 0 && y == 0) {
        var span = doc.createElement("span");
        if (span.getClientRects) {
          // Ensure span has dimensions and position by
          // adding a zero-width space character
          span.appendChild(doc.createTextNode("\u200b"));
          range.insertNode(span);
          rect = span.getClientRects()[0];
          x = rect.left;
          y = rect.top;
          var spanParent = span.parentNode;
          spanParent.removeChild(span);

          // Glue any broken text nodes back together
          spanParent.normalize();
        }
      }
    }
  }
  return { x: x, y: y };
}
