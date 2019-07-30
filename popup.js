function save_options() {
  var color = document.getElementById('apply-color').checked;
  var indent = document.getElementById('apply-indent').checked;
  var autocomplete = document.getElementById('apply-autocomplete').checked;
  var moduleac = document.getElementById('apply-moduleac').checked;
  var grid = document.getElementById('apply-grid').checked;
  var tooltip = document.getElementById('apply-tooltip').checked;
  var snippet = document.getElementById('apply-snippet').checked;
  var decimal_txt = document.getElementById('decimal-txt').value;
  var thousands_txt = document.getElementById('thousands-txt').value;
  var negative_txt = document.getElementById('negative-txt').value;
  var zero_txt = document.getElementById('zero-txt').value;

  var map = document.getElementById('hide-map').checked;
  var link = document.getElementById('disable-link').checked;
  var toaster = document.getElementById('apply-toaster').checked;
  var palette = document.getElementById('apply-palette').checked;

  var nav_back_color = document.getElementById('nav-back-color').value;
  var nav_button_color = document.getElementById('nav-button-color').value;
  var nav_btntxt_color = document.getElementById('nav-btntxt-color').value;
  var slider_back_color = document.getElementById('slider-back-color').value;
  var slider_txt_color = document.getElementById('slider-txt-color').value;
  var settings_selected_color = document.getElementById('settings-selected-color').value;
  var settings_hover_color = document.getElementById('settings-hover-color').value;
  var label_txt_color = document.getElementById('label-txt-color').value;
  var h1_txt_color = document.getElementById('h1-txt-color').value;
  var h1_bg_color = document.getElementById('h1-bg-color').value;
  var h1_txt_align = document.getElementById('h1-txt-align').value;
  var h2_txt_color = document.getElementById('h2-txt-color').value;
  var h2_bg_color = document.getElementById('h2-bg-color').value;
  var h2_txt_align = document.getElementById('h2-txt-align').value;
  var info_bg_color = document.getElementById('info-bg-color').value;
  var editable_cells_color = document.getElementById('editable-cells-color').value;
  var editable_txt_color = document.getElementById('editable-txt-color').value;
  var sum1_cells_color = document.getElementById('sum1-cells-color').value;
  var sum2_cells_color = document.getElementById('sum2-cells-color').value;
  var sum3_cells_color = document.getElementById('sum3-cells-color').value;
  var tbl_font_family = document.getElementById('tbl-font-family').value;
  var tbl_font_size = document.getElementById('tbl-font-size').value;
  var th_back_color = document.getElementById('th-back-color').value;
  var th_txt_color = document.getElementById('th-txt-color').value;

  var configData = {
    bpxColor: color,
    bpxIndent: indent,
    bpxAutoComplete: autocomplete,
    bpxModuleAC: moduleac,
    bpxGrid: grid,
    bpxTooltip: tooltip,
    bpxSnippet: snippet,
    bpxLink: link,
    bpxMap: map,
    bpxToaster: toaster,
    bpxPalette: palette,
    decimal_txt : decimal_txt,
    thousands_txt : thousands_txt,
    negative_txt : negative_txt,
    zero_txt : zero_txt,
    nav_back_color : nav_back_color,
    nav_button_color : nav_button_color,
    nav_btntxt_color : nav_btntxt_color,
    slider_back_color : slider_back_color,
    slider_txt_color : slider_txt_color,
    settings_selected_color : settings_selected_color,
    settings_hover_color : settings_hover_color,
    label_txt_color : label_txt_color,
    h1_txt_color : h1_txt_color,
    h1_bg_color : h1_bg_color,
    h1_txt_align : h1_txt_align,
    h2_txt_color : h2_txt_color,
    h2_txt_align : h2_txt_align,
    h2_bg_color : h2_bg_color,
    info_bg_color : info_bg_color,
    editable_cells_color : editable_cells_color,
    editable_txt_color : editable_txt_color,
    sum1_cells_color : sum1_cells_color,
    sum2_cells_color : sum2_cells_color,
    sum3_cells_color : sum3_cells_color,
    tbl_font_family : tbl_font_family,
    tbl_font_size : tbl_font_size,
    th_back_color : th_back_color,
    th_txt_color : th_txt_color
  };

  chrome.storage.local.set(configData, function() {
    //
  });


  return configData;
}

function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.local.get(gDefaultSetting, function(items) {
    document.getElementById('apply-color').checked = items.bpxColor;
    document.getElementById('apply-indent').checked = items.bpxIndent;
    document.getElementById('apply-autocomplete').checked = items.bpxAutoComplete;
    document.getElementById('apply-moduleac').checked = items.bpxModuleAC;
    document.getElementById('apply-tooltip').checked = items.bpxTooltip;
    document.getElementById('apply-snippet').checked = items.bpxSnippet;
    document.getElementById('decimal-txt').value = items.decimal_txt;
    document.getElementById('thousands-txt').value = items.thousands_txt;
    document.getElementById('negative-txt').value = items.negative_txt;
    document.getElementById('zero-txt').value = items.zero_txt;
    document.getElementById('apply-grid').checked = items.bpxGrid;
    document.getElementById('disable-link').checked = items.bpxLink;
    document.getElementById('hide-map').checked = items.bpxMap;
    document.getElementById('apply-toaster').checked = items.bpxToaster;
    document.getElementById('apply-palette').checked = items.bpxPalette;
    document.getElementById('nav-back-color').value = items.nav_back_color;
    document.getElementById('nav-button-color').value = items.nav_button_color;
    document.getElementById('nav-btntxt-color').value = items.nav_btntxt_color;
    document.getElementById('slider-back-color').value = items.slider_back_color;
    document.getElementById('slider-txt-color').value = items.slider_txt_color;
    document.getElementById('settings-selected-color').value = items.settings_selected_color;
    document.getElementById('settings-hover-color').value = items.settings_hover_color;
    document.getElementById('label-txt-color').value = items.label_txt_color;
    document.getElementById('h1-txt-color').value = items.h1_txt_color;
    document.getElementById('h1-bg-color').value = items.h1_bg_color;
    document.getElementById('h1-txt-align').value = items.h1_txt_align;
    document.getElementById('h2-txt-color').value = items.h2_txt_color;
    document.getElementById('h2-bg-color').value = items.h2_bg_color;
    document.getElementById('h2-txt-align').value = items.h2_txt_align;
    document.getElementById('info-bg-color').value = items.info_bg_color;
    document.getElementById('editable-cells-color').value = items.editable_cells_color;
    document.getElementById('editable-txt-color').value = items.editable_txt_color;
    document.getElementById('sum1-cells-color').value = items.sum1_cells_color;
    document.getElementById('sum2-cells-color').value = items.sum2_cells_color;
    document.getElementById('sum3-cells-color').value = items.sum3_cells_color;
    document.getElementById('tbl-font-family').value = items.tbl_font_family;
    document.getElementById('tbl-font-size').value = items.tbl_font_size;
    document.getElementById('th-back-color').value = items.th_back_color;
    document.getElementById('th-txt-color').value = items.th_txt_color;
  });
}

function handle_action(action) {
  var configData = save_options();

  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: action,
        data: configData
      });
  });
}

function color_change() {
  var elem = document.getElementById("apply-color");
  var action = elem.checked ? 'apply-color':'disable-color';

  handle_action(action);
}

function indent_change() {
  var elem = document.getElementById("apply-indent");
  var action = elem.checked ? 'apply-indent':'disable-indent';

  handle_action(action);
}

function autocomplete_change() {
  var elem = document.getElementById("apply-autocomplete");
  var action = elem.checked ? 'apply-autocomplete':'disable-autocomplete';

  handle_action(action);
}

function moduleac_change() {
  var elem = document.getElementById("apply-moduleac");
  var action = elem.checked ? 'apply-moduleac':'disable-moduleac';

  handle_action(action);
}

function grid_change() {
  var elem = document.getElementById("apply-grid");
  var action = elem.checked ? 'apply-grid':'disable-grid';

  handle_action(action);
}

function tooltip_change() {
  var elem = document.getElementById("apply-tooltip");
  var action = elem.checked ? 'apply-tooltip':'disable-tooltip';

  handle_action(action);
}

function snippet_change() {
  var elem = document.getElementById("apply-snippet");
  var action = elem.checked ? 'apply-snippet':'disable-snippet';

  handle_action(action);
}

function link_change() {
  var elem = document.getElementById("disable-link");
  var action = elem.checked ? 'disable-link':'apply-link';

  handle_action(action);
}

function map_change() {
  var elem = document.getElementById("hide-map");
  var action = elem.checked ? 'hide-map':'show-map';

  handle_action(action);
}

function palette_change() {
  var elem = document.getElementById("apply-palette");
  var action = elem.checked ? 'apply-palette':'disable-palette';

  handle_action(action);
}

function toaster_change() {
  var elem = document.getElementById("apply-toaster");
  var action = elem.checked ? 'apply-toaster':'disable-toaster';

  handle_action(action);
}

function style_change() {
  handle_action('style_change');
}

function format_change() {
  handle_action('format_change');
}

function toggle_color_panel() {
  var x = document.getElementById("style-panel");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function toggle_format_panel() {
  var x = document.getElementById("format-panel");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

document.addEventListener('DOMContentLoaded', function(){
  restore_options();
  document.getElementById('apply-color').addEventListener('change', color_change);
  document.getElementById('apply-indent').addEventListener('change', indent_change);
  document.getElementById('apply-autocomplete').addEventListener('change', autocomplete_change);
  document.getElementById('apply-moduleac').addEventListener('change', moduleac_change);
  document.getElementById('apply-grid').addEventListener('change', grid_change);
  document.getElementById('apply-tooltip').addEventListener('change', tooltip_change);
  document.getElementById('apply-snippet').addEventListener('change', snippet_change);
  document.getElementById('btn-format-collapsible').addEventListener('click', toggle_format_panel);
  document.getElementById('decimal-txt').addEventListener('change', format_change);
  document.getElementById('thousands-txt').addEventListener('change', format_change);
  document.getElementById('negative-txt').addEventListener('change', format_change);
  document.getElementById('zero-txt').addEventListener('change', format_change);
  document.getElementById('disable-link').addEventListener('change', link_change);
  document.getElementById('hide-map').addEventListener('change', map_change);
  document.getElementById('apply-toaster').addEventListener('change', toaster_change);
  document.getElementById('apply-palette').addEventListener('change', palette_change);
  document.getElementById('btn-style-collapsible').addEventListener('click', toggle_color_panel);
  document.getElementById('nav-back-color').addEventListener('change', style_change);
  document.getElementById('nav-button-color').addEventListener('change', style_change);
  document.getElementById('nav-btntxt-color').addEventListener('change', style_change);
  document.getElementById('slider-back-color').addEventListener('change', style_change);
  document.getElementById('slider-txt-color').addEventListener('change', style_change);
  document.getElementById('settings-selected-color').addEventListener('change', style_change);
  document.getElementById('settings-hover-color').addEventListener('change', style_change);
  document.getElementById('label-txt-color').addEventListener('change', style_change);
  document.getElementById('h1-txt-color').addEventListener('change', style_change);
  document.getElementById('h1-bg-color').addEventListener('change', style_change);
  document.getElementById('h1-txt-align').addEventListener('change', style_change);
  document.getElementById('h2-txt-color').addEventListener('change', style_change);
  document.getElementById('h2-bg-color').addEventListener('change', style_change);
  document.getElementById('h2-txt-align').addEventListener('change', style_change);
  document.getElementById('info-bg-color').addEventListener('change', style_change);
  document.getElementById('editable-cells-color').addEventListener('change', style_change);
  document.getElementById('editable-txt-color').addEventListener('change', style_change);
  document.getElementById('sum1-cells-color').addEventListener('change', style_change);
  document.getElementById('sum2-cells-color').addEventListener('change', style_change);
  document.getElementById('sum3-cells-color').addEventListener('change', style_change);
  document.getElementById('tbl-font-family').addEventListener('change', style_change);
  document.getElementById('tbl-font-size').addEventListener('change', style_change);
  document.getElementById('th-back-color').addEventListener('change', style_change);
  document.getElementById('th-txt-color').addEventListener('change', style_change);
});
