
function getModuleData() {
    var moduleLabels = anaplan.data.ModelContentCache._modelInfo.modulesLabelPage.labels[0];
    var moduleIds = anaplan.data.ModelContentCache._modelInfo.modulesLabelPage.entityLongIds[0];
    var i;
    var moduleData = [];
    for (i = 0; i < moduleIds.length; i++) {
        var tmp = {};
        tmp.name = moduleLabels[i];
        tmp.type = "module";
        tmp.label = moduleLabels[i];
        tmp.id = moduleIds[i];
        moduleData[i] = tmp;
    }
    return moduleData;
}

function getListByModuleName(moduleName) {
    var moduleData = getModuleData();
    var i, j;
    for (i = 0; i < moduleData.length; i++) {
        if (moduleData[i].label == moduleName) {
            var moduleListData = [];
            var listData = anaplan.data.ModelContentCache.getModuleInfo(moduleData[i].id).lineItemsLabelPage;
            for (j = 0; j < listData.entityLongIds[0].length; j++) {
                var tmp = {};
                tmp.name = listData.labels[0][j];
                var format = anaplan.data.ModelContentCache.getLineItemInfo(listData.entityLongIds[0][j]);

                tmp.type = "list";
                tmp.label = listData.labels[0][j] + " (" + format.format.dataType + ")";
                moduleListData[j] = tmp;
            }
            return moduleListData;
        }
    }
    return false
}

if (!document.getElementById("ext-to-page")) {
    var a = document.createElement("DIV");
    a.setAttribute("id", "ext-to-page");
    document.getElementsByTagName('body')[0].appendChild(a);
    a.addEventListener('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var data = eval(this.getAttribute('data-action'));
        document.getElementById('page-to-ext').setAttribute('data-result', JSON.stringify(data));
        document.getElementById('page-to-ext').click();
    });
}
