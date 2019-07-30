//////// ANAPLAN MODEL MAP FUNCTION ///////////////////////
function applyHideModelmap(flag) {
  if ( document.querySelector("[widgetid='content_tablist_modelmap_tab']") == null ) return;
  if (flag) {
    document.querySelector("[widgetid='content_tablist_modelmap_tab']").style.display = "none";
  } else {
    document.querySelector("[widgetid='content_tablist_modelmap_tab']").style.display = "inline-flex";
  }
}
