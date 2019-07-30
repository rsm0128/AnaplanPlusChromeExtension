function getAnaplanList(flag) {
    var arr = [];
    if (Math.floor(flag / 2)) {
        arr = arr.concat(getModuleData());
    }

    if ( flag % 2 ) {
        arr = arr.concat(getLpListData());
    }

    return arr;
}

function getAnaplanProperty(flag, propName) {
    var arr = [];
    if (Math.floor(flag / 2)) {
        var tmpModules = getListByModuleName(propName);
        if (tmpModules) {
            arr = arr.concat(tmpModules);
        }
    }

    if (flag % 2) {
        var tmpModules = getLpPropertyByListName(propName);
        if (tmpModules) {
            arr = arr.concat(tmpModules);
        }
    }

    return arr;
}

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

function getLpListData() {
    var listLabels = anaplan.data.ModelContentCache._customHierarchiesLabelPage.labels[0];
    var listIds = anaplan.data.ModelContentCache._customHierarchiesLabelPage.entityLongIds[0];
    var i;
    var listData = [];
    for (i = 0; i < listIds.length; i++) {
        var tmp = {};
        tmp.name = listLabels[i];
        tmp.type = "lpList";
        tmp.label = listLabels[i];
        tmp.id = listIds[i];
        listData[i] = tmp;
    }
    return listData;
}

function getLpPropertyByListName(listName) {
    var listData = getLpListData();
    var i, j;
    for (i = 0; i < listData.length; i++) {
        if (listData[i].label == listName) {
            var listPropertyData = [];
            var hierachyInfo = anaplan.data.ModelContentCache.getHierarchyInfo(listData[i].id);
            var propertyData = hierachyInfo.propertiesLabelPage;
            for (j = 0; j < propertyData.entityLongIds.length; j++) {
                var format = hierachyInfo.propertiesInfo[j].format.dataType;
                var tmp = {};
                tmp.name = propertyData.labels[j];

                tmp.type = "lpProp";
                tmp.label = propertyData.labels[j] + " (" + format + ")";
                listPropertyData[j] = tmp;
            }
            return listPropertyData;
        }
    }
    return false;
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
