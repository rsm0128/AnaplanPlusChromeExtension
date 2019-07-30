//////// PALETTE FUNCTIONS ///////////////////////////////
function applyPalette(configData) {
  $('#palette-style').remove();
  var cssStr = ""  
    //Scrollbars
    + '.tableOfContentsWrapper::-webkit-scrollbar-thumb {background:' + configData.nav_back_color +';} .tableOfContentsWrapper::-webkit-scrollbar {width: 4px; height: 4px}'
    + '.modelContentsTree::-webkit-scrollbar-thumb {background: #C0C0C0;} .modelContentsTree::-webkit-scrollbar {width: 4px; height: 4px}'
    + '.gridhostScrollBars::-webkit-scrollbar-thumb {background: #C0C0C0; -webkit-border-radius: 0px} .gridhostScrollBars::-webkit-scrollbar {width: 12px; height: 2px}'
    //Fonts
    + 'body{font-size:' + configData.tbl_font_size + 'px;font-family:' + configData.tbl_font_family + ';}.classic td, .classic th{font-size:' + configData.tbl_font_size + 'px;font-family:' + configData.tbl_font_family + ';}'
    + '.aui a{font-size:' + configData.tbl_font_size + 'px;font-family:' + configData.tbl_font_family + ';}'
    + '.original .classic.dashboardWidget .pageSelectorToolbar .toolbarLabel{color:' + configData.simple_txt_color + ';}'
    //Launchpad
    + '.filters a.filter-selected{background-color:' + configData.nav_back_color +'; color:' + configData.nav_btntxt_color + ';}'
    + '.not-iOS body.list .model.ready:hover{background-color:' + configData.settings_hover_color +'!important; color:' + configData.nav_btntxt_color + '!important;}'
    + '.not-iOS .tiles .model.ready:hover{background-color:' + configData.settings_hover_color +'!important; color:' + configData.nav_btntxt_color + '!important;}'
    + '.black a.model-icon{color:' + configData.settings_hover_color+ ';}'
    + '.popup-row-content-list div:hover{background-color:' + configData.settings_hover_color +'!important; color:' + configData.nav_btntxt_color + '!important;}'
    //Model Title Color 
    + 'a{color:' + configData.label_txt_color + ';}'
    + '.original #banner a{color:' + configData.label_txt_color + ';} .claro .dijitSelectLabel{color:' + configData.label_txt_color + ';} .claro .dijitTextBox .dijitInputInner{color:' + configData.label_txt_color + ';}'
    //Toaster
    +'.original .dijitToasterContainer{width: 300px;}'
    +'.original .dijitToasterContent{width: 260px; font-size:10px; background-color:c4ebff; opacity:0.8; color:' + configData.nav_back_color + ';}'    
    //Editable Cells Color
    + '.classic .editable {background-color:' + configData.editable_cells_color + '; color:'+ configData.editable_txt_color +';}'
    + '.original .classic table.grid .bb{background-size: 18%;}'
    + '.thin .editable {background-color:' + configData.editable_cells_color + '; color:'+ configData.editable_txt_color +';}'
    + '.original .thin table.grid .bb{background-size: 18%;}'
    + '.clean .editable {background-color:' + configData.editable_cells_color + '; color:'+ configData.editable_txt_color +';}'
    + '.original .clean table.grid .bb{background-size: 18%;}'
    + '.zebra .editable {background-color:' + configData.editable_cells_color + '; color:'+ configData.editable_txt_color +';}'
    + '.original .zebra table.grid .bb{background-size: 18%;}'
    + '.original .cell .cellValue {background-color:' + configData.editable_cells_color + '; color:'+ configData.editable_txt_color +';}'
    + '.original .cellReadOnly .cellValue {background-color: #FFFFFF ; color: #000000;}' 
    //NavBar Background Color
    + 'nav.ap-gn{background-color:' + configData.nav_back_color + ';}'
    //Slider Background Color
    + '.original #slideout{background:' + configData.slider_back_color + ';}'
    //Slider Text Color
    + '.aui .ap-expanding-panel .ap-header .ap-header-title{color:' + configData.slider_txt_color + ';} .aui .table-of-contents .panels .ap-expanding-panel .ap-tree .ap-tree-item a{color:' + configData.slider_txt_color + ';} .original .dojoxExpandoTitle{color:' + configData.slider_txt_color + ';}'
    + '.ap-gn-icon-btn--circle .ap-gn-icon-btn__icon {background-color:' + configData.nav_button_color + ';fill:' + configData.nav_btntxt_color + ';}'
    + '.aui .table-of-contents .panels .ap-expanding-panel {height: 110%; background: rgba(0, 0, 0, 0.02); margin: 6px; margin-right: 6px; border-radius: 4px;}'
    + '.aui .ap-expanding-panel .ap-header .icon {margin: 0 -2px -4px 2px;}'
    + '.aui .table-of-contents .panels .ap-expanding-panel .ap-tree .ap-tree-item.selected-parent {border-left: 5px solid'+ configData.nav_button_color+';}'
    //Selection Color
    + '.claro .dijitTreeRowSelected{background:' + configData.settings_selected_color + ';} .claro .dijitTreeRowHover{background:' + configData.settings_hover_color + ';} .claro .dijitTreeRowSelected.dijitTreeRowHover{background:' + configData.settings_hover_color + ';}'
    + '.original .sortableList .dojoDndItemSelected{background:' + configData.settings_selected_color + ';} .original .sortableList .dojoDndItemOver{background:' + configData.settings_hover_color + ';}'
    + '.original .masterSelector .dojoDndItemSelected{background:' + configData.settings_selected_color + ';} .original .masterSelector .dojoDndItemOver{background:' + configData.label_txt_color + ';} .original .masterSelector .dojoDndItemSelected .dojoDndItemOver{background:' + configData.label_txt_color + ';} .original .history .previewTable tr.selected td{background:' + configData.label_txt_color + ';}'
    //Other Labels Color (model size, time settings, etc.)
    + '.original .modelContentsHeadline .modelSize{color:' + configData.label_txt_color + ';}'
    + '.original .primary-button .dijitButtonNode{background:' + configData.nav_back_color + ';}'
    + '.original .primary-button.dijitHover .dijitButtonNode{background:' + configData.nav_button_color + '; background-color:' + configData.nav_button_color + ';}'
    + '.original .formulaBar .formulaBarRowLabelCell .dijitButtonText, .original .formulaEditor .formulaEditorRowLabelCell .dijitButtonText {color: ' + configData.label_txt_color + ';}'
    + '.claro.original .pageSelectorToolbar .dijitDropDownButton .dijitButtonText, .claro.original .pageSelectorToolbar .dijitOpened .dijitButtonText{color:' + configData.label_txt_color + ';}'
    + '.original .modelContentsTree .dijitTreeNode .newItemLabel {color: ' + configData.label_txt_color + ';}'
    +'.original .dashboardWidgetMoveHandle{background-color:' + configData.nav_back_color + ';}'
    +'.original .dashboardDesignMode .dashboardWidgetSelected .dashboardWidgetContainerNode{outline-color:' + configData.nav_back_color + ';}'
    //Button Color
    + 'button.actionButton{background:' + configData.nav_back_color + ';}' 
    + '.claro.original .dijitToolbar .dijitDropDownButtonHover .dijitButtonNode{background:' + configData.nav_button_color + '; background-color:' + configData.nav_button_color + ';}'
    + '.claro.original .dijitToolbar .dijitDropDownButtonHoverFocused .dijitButtonNode{background:' + configData.nav_button_color + '; background-color:' + configData.nav_button_color + ';}'
    + '.claro .dojoDndItemAnchor{background:' + configData.nav_button_color + '; background-color:' + configData.nav_button_color + ';}'
    + '.aui .btn-primary{background:' + configData.nav_back_color  + '; background-color:' + configData.nav_back_color + ';}'
    +'.aui .ap-btn-toolbar.btn-primary.dropdown-toggle[disabled], .aui .ap-btn-toolbar.btn-primary[disabled]{background:' + configData.nav_back_color + '; background-color:' + configData.nav_back_color + ';}'
    +'.aui .ap-tab-toolbar .ap-tab-toolbar__inner .ap-toolbar .ap-btn-toolbar.aui-is-selected{background:' + configData.nav_back_color + '; background-color:' + configData.nav_back_color + ';}'
    +'.aui .ap-btn-toolbar.btn-default:hover:not([disabled]){background:' + configData.nav_button_color + '; background-color:' + configData.nav_button_color + ';}'
    + '.claro.original .dijitToolbar .dijitDropDownButtonOpenedHover .dijitButtonNode{background:' + configData.nav_button_color + '; background-color:' + configData.nav_button_color + ';}'
    + '.claro.original .dijitToolbar .dijitButtonHover .dijitButtonNode{background:' + configData.nav_button_color + '; background-color:' + configData.nav_button_color + ';}'
    + '.original .dashboardWidget-BUTTON .primary-button .dijitButtonNode{background:' + configData.nav_back_color + '; background-color:' + configData.nav_back_color + ';}'
    + '.original .dashboardWidget-BUTTON .primary-button .dijitHover .dijitButtonNode{background:' + configData.nav_button_color + '; background-color:' + configData.nav_button_color + ';}'
    + '.original .dashboardWidget-BUTTON .hyperlink .dijitButtonNode, .original .dashboardWidget-BUTTON .hyperlink .dijitHover .dijitButtonNode{color: '+ configData.label_txt_color +';}'
    + '.original .tabContainer .dijitTabChecked .tabLabel{color:'+ configData.label_txt_color +';}'
    //Table Summary Color
    + '.classic .gridrowsummary1, .classic .gridrowsummary1{font-weight:bold; background:' + configData.sum1_cells_color + ';}'
    + '.classic .gridrowsummary2, .classic .gridrowsummary2{font-weight:bold; background:' + configData.sum2_cells_color + ';}'
    + '.classic .gridrowsummary3, .classic .gridrowsummary3{font-weight:bold; background:' + configData.sum3_cells_color + ';}'      
    //Table Summary Color
    + '.classic .gridcolumnheader{color:' + configData.th_txt_color + ';background:' + configData.th_back_color + '} .anaplanTabsView .classic .gridcolumnheader.gridlabelhighlight{color:' + configData.th_txt_color + ';background:' + configData.th_back_color + '} .anaplanTabsSettings .classic .gridcolumnheader.gridlabelhighlight{color:' + configData.th_txt_color + ';background:' + configData.th_back_color + '} .dijitLayoutContainerFocused .classic .gridcolumnheader.gridlabelhighlight{color:' + configData.th_txt_color + ';background:' + configData.th_back_color + '}'
    + '.classic .gridcrosshairs{background: transparent}'
    //Table Selection
    + '.classic .gridselected .selectionborderleft {border-left: 2px solid'+ configData.settings_hover_color+';}'
    + '.classic .gridselected .selectionborderright {border-right: 2px solid'+ configData.settings_hover_color+';}'
    + '.classic .gridselected .selectionbordertop {border-top: 2px solid'+ configData.settings_hover_color+';}'
    + '.classic .gridselected .selectionborderbottom {border-bottom: 2px solid'+ configData.settings_hover_color+';}'
    + '.gridrowheader gridlabelhighlight{border-right: 2px solid'+ configData.settings_hover_color+';}'
    //Text Color
    + '.original .dashboardWidget-STATIC_TEXT .heading1{color:' + configData.h1_txt_color + ';background-color:' + configData.h1_bg_color + '; font-weight: bold; text-align:'+ configData.h1_txt_align +';}'
    + '.original .staticTextMenu .heading1 .dijitMenuItemLabel{color:' + configData.h1_txt_color + '; text-indent: 6px;}'
    + '.original .dashboardWidget-STATIC_TEXT .heading2{color:' + configData.h2_txt_color + ';background-color:' + configData.h2_bg_color + '; font-weight: bold; text-align:'+ configData.h2_txt_align +';}'
    + '.original .staticTextMenu .heading2 .dijitMenuItemLabel{color:' + configData.h2_txt_color+ ';}'
    + '.original .dashboardWidget-STATIC_TEXT .instruction{background-color:' + configData.info_bg_color + ';}'
    + '.original .staticTextMenu .instruction .dijitMenuItemLabel{background-color:' + configData.info_bg_color + '; text-indent: 6px;}'
    //Comment cells
    +'.original .cell .inputContainer .dijitTextBox{border-color:' + configData.settings_hover_color + ';}'
  ;

  $('head').append("<style id='palette-style'>" + cssStr + "</style>");
  document.getElementById("palette-style").disabled = !configData.bpxPalette;
}
