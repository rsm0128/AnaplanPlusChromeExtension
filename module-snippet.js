function applySnippet(configData) {
    if (configData.bpxSnippet && (window.location.href.indexOf("core") > -1) && $('#bpx-snippet-block').length == 0) {
        var html = '<div id="bpx-snippet-block" style="display:flex; margin-right:40px">' +
            '<div class="bpx-number-snippet">' +
            '<button data-value=\'{"minimumSignificantDigits":-1,"decimalPlaces":0,"decimalSeparator":"'+ configData.decimal_txt + '","groupingSeparator":"'+ configData.thousands_txt + '","negativeNumberNotation":"'+ configData.negative_txt + '","unitsType":"NONE","unitsDisplayType":"NONE","currencyCode":null,"customUnits":null,"zeroFormat":"'+ configData.zero_txt + '","comparisonIncrease":"GOOD","dataType":"NUMBER"}\'>0</button>' +
            '<button data-value=\'{"minimumSignificantDigits":-1,"decimalPlaces":1,"decimalSeparator":"'+ configData.decimal_txt + '","groupingSeparator":"'+ configData.thousands_txt + '","negativeNumberNotation":"'+ configData.negative_txt + '","unitsType":"NONE","unitsDisplayType":"NONE","currencyCode":null,"customUnits":null,"zeroFormat":"'+ configData.zero_txt + '","comparisonIncrease":"GOOD","dataType":"NUMBER"}\'>0.0</button>' +
            '<button data-value=\'{"minimumSignificantDigits":-1,"decimalPlaces":2,"decimalSeparator":"'+ configData.decimal_txt + '","groupingSeparator":"'+ configData.thousands_txt + '","negativeNumberNotation":"'+ configData.negative_txt + '","unitsType":"NONE","unitsDisplayType":"NONE","currencyCode":null,"customUnits":null,"zeroFormat":"'+ configData.zero_txt + '","comparisonIncrease":"GOOD","dataType":"NUMBER"}\'>0.00</button>' +
            '<button data-value=\'{"minimumSignificantDigits":-1,"decimalPlaces":0,"decimalSeparator":"'+ configData.decimal_txt + '","groupingSeparator":"'+ configData.thousands_txt + '","negativeNumberNotation":"'+ configData.negative_txt + '","unitsType":"PERCENTAGE","unitsDisplayType":"PERCENTAGE_SUFFIX","currencyCode":null,"customUnits":null,"zeroFormat":"'+ configData.zero_txt + '","comparisonIncrease":"GOOD","dataType":"NUMBER"}\'>0%</button>' +
            '<button data-value=\'{"minimumSignificantDigits":-1,"decimalPlaces":1,"decimalSeparator":"'+ configData.decimal_txt + '","groupingSeparator":"'+ configData.thousands_txt + '","negativeNumberNotation":"'+ configData.negative_txt + '","unitsType":"PERCENTAGE","unitsDisplayType":"PERCENTAGE_SUFFIX","currencyCode":null,"customUnits":null,"zeroFormat":"'+ configData.zero_txt + '","comparisonIncrease":"GOOD","dataType":"NUMBER"}\'>0.0%</button>' +
            '<button data-value=\'{"minimumSignificantDigits":-1,"decimalPlaces":2,"decimalSeparator":"'+ configData.decimal_txt + '","groupingSeparator":"'+ configData.thousands_txt + '","negativeNumberNotation":"'+ configData.negative_txt + '","unitsType":"PERCENTAGE","unitsDisplayType":"PERCENTAGE_SUFFIX","currencyCode":null,"customUnits":null,"zeroFormat":"'+ configData.zero_txt + '","comparisonIncrease":"GOOD","dataType":"NUMBER"}\'>0.00%</button>' +
            '</div>' +
            '<div class="bpx-data-snippet">' +
            '<button data-value=\'{"textType":"GENERAL","dataType":"TEXT"}\'>ABC</button>' +
            '<button data-value=\'{"dataType":"BOOLEAN"}\'>T/F</button>' +
            '<button data-value=\'{"dataType":"DATE"}\'>01/01/99</button>' +
            '<button data-value=\'{"periodType":{"entityId":"MONTH","entityLabel":"Month","entityIndex":3,"entityGuid":null},"dataType":"TIME_ENTITY"}\'>Jan 99</button>' +
            '<button data-value=\'{"periodType":{"entityIndex":5,"entityId":"YEAR","entityLabel":"Year","entityGuid":null},"dataType":"TIME_ENTITY"}\'>FY99</button>' +
            '<button data-value=\'{"dataType":"NONE"}\'>No data</button>' +
            '</div>' +
            '<div class="bpx-snippet-note" style="color:white;font-size:12px;">click and paste<br> with ctrl+v</div>' + 
            '<style>#bpx-snippet-block button {cursor: pointer; margin-right:5px; min-width:30px; height:25px; font-size:11px;} #bpx-snippet-block button:focus {cursor: pointer; background-color:grey;} .bpx-number-snippet{margin-right:10px;} .ap-gn__area--last{display:contents;}</style>' +
            '</div>';
            
        addSnipetBox(html);
    } else {
        $('#bpx-snippet-block').remove();
    }
}

function addSnipetBox(html) {
    if (!$('.ap-gn__logo').length) {
        setTimeout(function () { addSnipetBox(html); }, 1000);
    } else {
        $('.ap-gn__logo').after(html);
    }
}

function insertAtCursor(myField, myValue, cropText) {
    var prevValue;
    var newValue;

    if (navigator.appVersion.indexOf('Mac') != -1 && cropText) {
        prevValue = myField.value.substring(0, myField.value.length - 1);
    } else {
        prevValue = myField.value;
    }

    if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        newValue = prevValue.substring(0, startPos) + myValue + prevValue.substring(endPos, prevValue.length);
    } else {
        newValue = prevValue + myValue;
    }

    myField.value = newValue;
}

$(document).on('click', '#bpx-snippet-block button', function () {
    var $tempInput = document.createElement('INPUT');
    var $body = document.getElementsByTagName('body')[0];
    $body.appendChild($tempInput);
    $tempInput.setAttribute('value', JSON.stringify($(this).data('value')));
    $tempInput.select();
    document.execCommand('copy');
    $body.removeChild($tempInput);
});