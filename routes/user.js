var chaira = require('../scrapingChaira/login.js');
var menu = require('../scrapingChaira/open_menu_student.js');
var parser = require('../scrapingChaira/parser/parser_schedule.js');
var parserGroup = require('../scrapingChaira/parser/parser_groups_teacher.js');
var fbUser = require('../routesFirebase/user.js');
var fbSchedule = require('../routesFirebase/schedule.js');
var util = require('../helper/util.js');

exports.login = function(req, res) {
    var params = {
        phantomjs: require('phantomjs-prebuilt'),
        webdriverio: require('webdriverio'),
        wdOpts: {
            desiredCapabilities: {
                browserName: 'phantomjs',
                'phantomjs.page.settings.loadImages': false
            }
        }
    };
    var credentials = [req.body.user, req.body.password];
    console.log(credentials);

    chaira.loginChaira(params, credentials[0], credentials[1], function(data, client, program, rolUser) {
        if (data == "user valid") {
            if (rolUser == "Estudiante") {
                var menuHorario = {
                    menu1: ["Estudiante", "span"],
                    menu2: ["Información académica", "span"],
                    menu3: ["Horario", "span"]
                };
                menu.openMenu(client, menuHorario, function(resMenu, html, client2) { //Open Iframe
                    program.kill(); //close Phantomjs
                    if (resMenu == "Open iframe") {
                        parser.schedule(html, function(dataParser) { //Parseo

                            var token = util.generateToken({
                                id: dataParser.codeStudent,
                                name: dataParser.nameStudent,
                                user: credentials[0],
                                rol: "Estudiante",
                                program: dataParser.program,
                                date: new Date().getTime()
                            });

                            fbSchedule.isGroup(dataParser); //Verificar, o agrega un miembro, o crea un grupo
                            console.log("finish\n===========================");
                            res.status(200).send(fbUser.saveStudent(dataParser, token, credentials[0]));
                        });
                    } else {
                        program.kill(); //close Phantomjs
                        res.status(400).send(resMenu);
                    }
                });

            } else if (rolUser == "Docente") {
                var menuGrupos = {
                    menu1: ["Docentes", "span"],
                    menu2: ["Horario", "span"],
                    menu3: ["Horario", "span"]
                };
                menu.openMenu(client, menuGrupos, function(resMenu, html, client2) { //Open Iframe
                    if (resMenu == "Open iframe") {
                        html = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" id="ext-gen3" class=" x-theme-blue ext-strict x-viewport" style="height: 100%;"><head> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <link rel="stylesheet" type="text/css" href="./Horario.aspx_files/ext.axd"> <title></title> <script type="text/javascript" src="./Horario.aspx_files/ext(1).axd"></script> <script type="text/javascript" src="./Horario.aspx_files/ext(2).axd"></script> <script type="text/javascript" src="./Horario.aspx_files/ext(3).axd"></script> <style type="text/css" id="Ext.net.Notification"> .x-notification-auto-hide .x-tool-close{display: none !important}</style> <style type="text/css" id="Ext.Net.CSS"> .x-form-radio-group .x-panel-body, .x-form-check-group .x-panel-body{background-color: transparent;}.x-form-cb-label-nowrap{white-space: nowrap;}.x-form-cb-label-nowrap .x-form-item-label{white-space: normal;}.x-label-icon{width: 16px; height: 16px; margin-left: 3px; margin-right: 3px; vertical-align: middle; border: 0px !important;}.x-label-value{vertical-align: middle;}.ext-webkit .x-tree-editor .x-form-text{padding-bottom: 1; padding-top: 1px;}.ext-webkit .x-small-editor .x-form-field-trigger-wrap .x-form-trigger{height: 21px;}.ext-webkit .x-grid3-add-row .x-small-editor .x-form-field-trigger-wrap .x-form-trigger{height: 19px;}.ext-webkit .x-form-invalid.x-form-composite{background-color: transparent !important;}.ext-ie6 .x-form-field-trigger-wrap .x-form-text, .ext-ie7 .x-form-field-trigger-wrap .x-form-text{margin-bottom: -2px;}.ext-ie6 .x-form-item .x-form-field-trigger-wrap .x-form-text, .ext-ie7 .x-form-item .x-form-field-trigger-wrap .x-form-text{margin-bottom: -1px;}.ext-ie8 .x-toolbar-cell .x-form-field-trigger-wrap .x-form-text{top: 0px;}.x-textfield-icon{background-repeat: no-repeat; background-position: 0 50%; width: 16px; height: 16px; margin-left: 1px;}.x-textfield-icon-input{padding-left: 20px;}.x-form-field-wrap .x-textfield-icon{top: 3px; left: 2px;}input.x-tree-node-cb{margin-left: 1px; height: 18px; vertical-align: bottom;}.x-tree-node .x-tree-node-inline-icon{background: transparent; height: 16px !important;}.x-field-note{font-size: 12px; color: gray;}.x-field-multi{float: left; padding-right: 3px; position: relative;}.x-inline-toolbar{padding: 0px !important; border: 0px !important; background: none !important;}.x-grid3 .x-row-expander-control TABLE{table-layout: auto;}.x-grid3 .x-row-expander-control TABLE.x-grid3-row-table{table-layout: fixed;}.x-fieldset.x-form-invalid{border-color: #c30;}.ext-ie6 ul.x-menu-list li.x-menu-sep-li{height: 5px !important;}.x-form-item.x-form-label-top label.x-form-item-label{width: auto; float: none; clear: none; display: inline; margin-bottom: 4px; position: static;}.x-menu-field-icon{top: auto; margin-top: 3px; margin-left: 3px;}.x-toolbar-classic .x-btn-tl{background-position: 0 0}.x-toolbar-classic .x-btn-tr{background-position: -3px 0}.x-toolbar-classic .x-btn-tc{background-position: 0 -6px}.x-toolbar-classic .x-btn-ml{background-position: 0 -24px}.x-toolbar-classic .x-btn-mr{background-position: -3px -24px}.x-toolbar-classic .x-btn-mc{background-position: 0 -1096px}.x-toolbar-classic .x-btn-bl{background-position: 0 -3px}.x-toolbar-classic .x-btn-br{background-position: -3px -3px}.x-toolbar-classic .x-btn-bc{background-position: 0 -15px}.x-table-layout-cell{vertical-align: top;}.x-form-field-wrap.x-top-note .x-form-trigger{top: auto;}.x-btn-no-arrow{padding-right: 0px !important; background: none !important;}.x-form-indicator{height: 18px; position: absolute; left: 0; top: 0; display: block; background-color: transparent; background-repeat: no-repeat; background-position: 0 3px; padding-top: 3px;}.x-column-layout-ct{overflow: hidden; zoom: 1;}.x-column-layout-bg-ct, .x-column-layout-bg-ct .x-column-inner{background-color: #f0f0f0;}.x-theme-blue .x-column-layout-bg-ct, .blue .x-column-layout-bg-ct .x-column-inner{background-color: #dfe8f6;}.x-fieldset.x-column{padding: 10px; padding-top: 0px;}.x-top-note-label{margin-top: 14px;}.x-form-item .x-form-element .x-form-display-field{padding-top: 3px;}.ext-shim{background-color: #cccccc;}</style> <script type="text/javascript" src="./Horario.aspx_files/ext(4).axd"></script> <script type="text/javascript" src="./Horario.aspx_files/ext(5).axd"></script> <script type="text/javascript">//<![CDATA[ Ext.net.ResourceMgr.init({id: "ResourceManager1", BLANK_IMAGE_URL: "/Chaira/extjs/resources/images/default/s-gif/ext.axd", aspForm: "form1", theme: "blue", appName: "Chaira", icons: ["PageWhiteAcrobat"]}); Ext.onReady(function(){Ext.QuickTips.init(); this.StHorario=new Ext.ux.data.PagingStore({proxyId: "StHorario", autoLoad: true, reader: new Ext.data.JsonReader({fields: [{name: "CODIGO"},{name: "MATERIA"},{name: "GRUPO"},{name: "AULA"},{name: "LUNES"},{name: "MARTES"},{name: "MIERCOLES"},{name: "JUEVES"},{name: "VIERNES"},{name: "SABADO"}]}), directEventConfig:{}, proxy: new Ext.data.PagingMemoryProxy([{"CODIGO": "1769553 ", "MATERIA": "LOGICA Y ALGORITMOS I ", "GRUPO": "ING. SISTEMAS GRUP", "AULA": null, "LUNES": null, "MARTES": "06:00-07:59<br/> 7202 <br/>ING. SISTEMAS GRUP", "MIERCOLES": null, "JUEVES": "06:00-07:59<br/>7204 <br/>ING. SISTEMAS GRUP<br/>", "VIERNES": null, "SABADO": null}], false)}); new Ext.net.Viewport({id: "Viewport1", renderTo: "form1", autoScroll: true, split: true, items: [{id: "DisplayField1", xtype: "displayfield", region: "north", value: "</br> <b>Cedula: </b>1234567890 </br><b>Nombre del docente: </b>ELIMINAR ELIMINAR ELIMINAR "},{id: "documento", xtype: "hidden", value: "1234567890"},{id: "nombre", xtype: "hidden", value: "ELIMINAR ELIMINAR ELIMINAR "},{id: "Panel2", autoScroll: true, autoHeight: true, autoWidth: true, margins: "5 5 5 5", region: "center", split: true, items:{id: "GridPanel1", xtype: "netgrid", autoScroll: true, autoHeight: true, autoWidth: true, split: true, tbar:{id: "Toolbar1", xtype: "toolbar", items: [{id: "ctl06", xtype: "tbfill"},{id: "descargarPdf", iconCls: "icon-pagewhiteacrobat", text: "Descargar", directEvents:{click:{fn: function(item, e){var params=arguments; Ext.net.DirectEvent.confirmRequest({extraParams:{"doc": documento.getValue(), "nom": nombre.getValue()}, eventMask:{showMask: true, msg: "Cargando información..", target: "customtarget", customTarget: "GridPanel1"}, control: this});}, delay: 20}}}]}, title: "Horario del docente", sm: this.ctl05=new Ext.grid.RowSelectionModel({proxyId: "ctl05", singleSelect: true}), store: StHorario, stripeRows: true, trackMouseOver: true, selectionMemory: false, cm: this.ctl10=new Ext.grid.ColumnModel({proxyId: "ctl10", columns: [new Ext.grid.RowNumberer({}),{dataIndex: "CODIGO", header: "CODIGO", id: "CODIGO", menuDisabled: true, width: 70},{dataIndex: "MATERIA", header: "Asignatura", id: "MATERIA", menuDisabled: true, width: 250},{dataIndex: "LUNES", header: "Lunes", id: "Lunes", menuDisabled: true},{dataIndex: "MARTES", header: "Martes", id: "Martes", menuDisabled: true},{dataIndex: "MIERCOLES", header: "Miercoles", id: "Miercoles", menuDisabled: true},{dataIndex: "JUEVES", header: "Jueves", id: "Jueves", menuDisabled: true},{dataIndex: "VIERNES", header: "Viernes", id: "Viernes", menuDisabled: true},{dataIndex: "SABADO", header: "Sabado", id: "Sabado", menuDisabled: true}]})}, layout: "auto"}], layout: "border"});}); //]]> </script> <style type="text/css" id="extnet-resources"> .icon-pagewhiteacrobat{background-image: url(/Chaira/icons/page_white_acrobat-png/ext.axd) !important;}</style></head><body class=" ext-webkit ext-chrome ext-linux" id="ext-gen4" style="overflow: hidden; margin: 0px; padding: 0px; border: 0px none; height: 100%;"> <form name="form1" method="post" action="https://chaira.udla.edu.co:8443/Chaira/View/Private/Academico/Docente/Horario.aspx?1472347817196" id="form1" style="height: 100%; width: 100%; overflow: auto;" class=" x-border-layout-ct"> <div id="DisplayField1" name="DisplayField1" class=" x-form-display-field x-border-panel" style="left: 0px; top: 0px; width: 980px; height: 54px;"> <br><b>Cedula: </b>1234567890 <br><b>Nombre del docente: </b>ELIMINAR ELIMINAR ELIMINAR </div><input type="hidden" size="20" autocomplete="off" id="documento" name="documento" class=" x-form-hidden x-form-field x-border-panel" value="1234567890"> <input type="hidden" size="20" autocomplete="off" id="nombre" name="nombre" class=" x-form-hidden x-form-field x-border-panel" value="ELIMINAR ELIMINAR ELIMINAR "> <div id="Panel2" class=" x-panel x-border-panel" style="width: auto; left: 5px; top: 61px;"> <div class="x-panel-bwrap" id="ext-gen13"> <div class="x-panel-body x-panel-body-noheader" id="ext-gen14" style="overflow: auto; position: relative; width: auto; height: auto;"> <div id="GridPanel1" class=" x-panel x-grid-panel"> <div class="x-panel-header x-unselectable" id="ext-gen16"><span class="x-panel-header-text" id="ext-gen35">Horario del docente</span></div><div class="x-panel-bwrap" id="ext-gen17"> <div class="x-panel-tbar" id="ext-gen18" style="width: 963px;"> <div id="Toolbar1" class="x-toolbar x-small-editor x-toolbar-layout-ct" style="width: 957px;"> <table cellspacing="0" class="x-toolbar-ct"> <tbody> <tr> <td class="x-toolbar-left" align="left"> <table cellspacing="0"> <tbody> <tr class="x-toolbar-left-row"></tr></tbody> </table> </td><td class="x-toolbar-right" align="right"> <table cellspacing="0" class="x-toolbar-right-ct"> <tbody> <tr> <td> <table cellspacing="0"> <tbody> <tr class="x-toolbar-right-row"> <td class="x-toolbar-cell" id="ext-gen36"> <table id="descargarPdf" cellspacing="0" class="x-btn x-btn-text-icon" style="width: auto;"> <tbody class="x-btn-small x-btn-icon-small-left"> <tr> <td class="x-btn-tl"><i>&nbsp;</i></td><td class="x-btn-tc"></td><td class="x-btn-tr"><i>&nbsp;</i></td></tr><tr> <td class="x-btn-ml"><i>&nbsp;</i></td><td class="x-btn-mc"><em class="" unselectable="on"><button type="button" id="ext-gen37" class=" x-btn-text icon-pagewhiteacrobat">Descargar</button></em></td><td class="x-btn-mr"><i>&nbsp;</i></td></tr><tr> <td class="x-btn-bl"><i>&nbsp;</i></td><td class="x-btn-bc"></td><td class="x-btn-br"><i>&nbsp;</i></td></tr></tbody> </table> </td></tr></tbody> </table> </td><td> <table cellspacing="0"> <tbody> <tr class="x-toolbar-extras-row"></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </div></div><div class="x-panel-body" id="ext-gen19" style="height: auto;"> <div class="x-grid3" hidefocus="true" id="ext-gen22"> <div class="x-grid3-viewport" id="ext-gen23"> <div class="x-grid3-header" id="ext-gen24"> <div class="x-grid3-header-inner" id="ext-gen26"> <div class="x-grid3-header-offset" style="width:960px;"> <table border="0" cellspacing="0" cellpadding="0" style="width: 943px;"> <thead> <tr class="x-grid3-hd-row"> <td class="x-grid3-hd x-grid3-cell x-grid3-td-numberer x-grid3-cell-first " style="width: 23px;"> <div class="x-grid3-hd-inner x-grid3-hd-numberer" unselectable="on" style=""> <a class="x-grid3-hd-btn" href="https://chaira.udla.edu.co:8443/Chaira/View/Private/Academico/Docente/Horario.aspx?1472347817196#"></a><img alt="" class="x-grid3-sort-icon" src="./Horario.aspx_files/ext(6).axd"></div></td><td class="x-grid3-hd x-grid3-cell x-grid3-td-CODIGO " style="width: 70px;"> <div class="x-grid3-hd-inner x-grid3-hd-CODIGO" unselectable="on" style=""> <a class="x-grid3-hd-btn" href="https://chaira.udla.edu.co:8443/Chaira/View/Private/Academico/Docente/Horario.aspx?1472347817196#"></a>CODIGO<img alt="" class="x-grid3-sort-icon" src="./Horario.aspx_files/ext(6).axd"></div></td><td class="x-grid3-hd x-grid3-cell x-grid3-td-MATERIA " style="width: 250px;"> <div class="x-grid3-hd-inner x-grid3-hd-MATERIA" unselectable="on" style=""> <a class="x-grid3-hd-btn" href="https://chaira.udla.edu.co:8443/Chaira/View/Private/Academico/Docente/Horario.aspx?1472347817196#"></a>Asignatura<img alt="" class="x-grid3-sort-icon" src="./Horario.aspx_files/ext(6).axd"></div></td><td class="x-grid3-hd x-grid3-cell x-grid3-td-Lunes" style="width: 100px;"> <div class="x-grid3-hd-inner x-grid3-hd-Lunes" unselectable="on" style=""> <a class="x-grid3-hd-btn" href="https://chaira.udla.edu.co:8443/Chaira/View/Private/Academico/Docente/Horario.aspx?1472347817196#"></a>Lunes<img alt="" class="x-grid3-sort-icon" src="./Horario.aspx_files/ext(6).axd"></div></td><td class="x-grid3-hd x-grid3-cell x-grid3-td-Martes " style="width: 100px;"> <div class="x-grid3-hd-inner x-grid3-hd-Martes" unselectable="on" style=""> <a class="x-grid3-hd-btn" href="https://chaira.udla.edu.co:8443/Chaira/View/Private/Academico/Docente/Horario.aspx?1472347817196#"></a>Martes<img alt="" class="x-grid3-sort-icon" src="./Horario.aspx_files/ext(6).axd"></div></td><td class="x-grid3-hd x-grid3-cell x-grid3-td-Miercoles " style="width: 100px;"> <div class="x-grid3-hd-inner x-grid3-hd-Miercoles" unselectable="on" style=""> <a class="x-grid3-hd-btn" href="https://chaira.udla.edu.co:8443/Chaira/View/Private/Academico/Docente/Horario.aspx?1472347817196#"></a>Miercoles<img alt="" class="x-grid3-sort-icon" src="./Horario.aspx_files/ext(6).axd"></div></td><td class="x-grid3-hd x-grid3-cell x-grid3-td-Jueves" style="width: 100px;"> <div class="x-grid3-hd-inner x-grid3-hd-Jueves" unselectable="on" style=""> <a class="x-grid3-hd-btn" href="https://chaira.udla.edu.co:8443/Chaira/View/Private/Academico/Docente/Horario.aspx?1472347817196#"></a>Jueves<img alt="" class="x-grid3-sort-icon" src="./Horario.aspx_files/ext(6).axd"></div></td><td class="x-grid3-hd x-grid3-cell x-grid3-td-Viernes " style="width: 100px;"> <div class="x-grid3-hd-inner x-grid3-hd-Viernes" unselectable="on" style=""> <a class="x-grid3-hd-btn" href="https://chaira.udla.edu.co:8443/Chaira/View/Private/Academico/Docente/Horario.aspx?1472347817196#"></a>Viernes<img alt="" class="x-grid3-sort-icon" src="./Horario.aspx_files/ext(6).axd"></div></td><td class="x-grid3-hd x-grid3-cell x-grid3-td-Sabado x-grid3-cell-last" style="width: 100px;"> <div class="x-grid3-hd-inner x-grid3-hd-Sabado" unselectable="on" style=""> <a class="x-grid3-hd-btn" href="https://chaira.udla.edu.co:8443/Chaira/View/Private/Academico/Docente/Horario.aspx?1472347817196#"></a>Sabado<img alt="" class="x-grid3-sort-icon" src="./Horario.aspx_files/ext(6).axd"></div></td></tr></thead> </table> </div></div><div class="x-clear"></div></div><div class="x-grid3-scroller" id="ext-gen25" style="overflow: visible; position: static;"> <div class="x-grid3-body" style="width:943px;" id="ext-gen27"> <div class="x-grid3-row x-grid3-row-first x-grid3-row-last" style="width:943px;"> <table class="x-grid3-row-table" border="0" cellspacing="0" cellpadding="0" style="width:943px;"> <tbody> <tr> <td class="x-grid3-col x-grid3-cell x-grid3-td-numberer x-grid3-cell-first " style="width: 23px;" tabindex="0"> <div class="x-grid3-cell-inner x-grid3-col-numberer" unselectable="on">1</div></td><td class="x-grid3-col x-grid3-cell x-grid3-td-CODIGO " style="width: 70px;" tabindex="0"> <div class="x-grid3-cell-inner x-grid3-col-CODIGO" unselectable="on">1769553 </div></td><td class="x-grid3-col x-grid3-cell x-grid3-td-MATERIA " style="width: 250px;" tabindex="0"> <div class="x-grid3-cell-inner x-grid3-col-MATERIA" unselectable="on">LOGICA Y ALGORITMOS I </div></td><td class="x-grid3-col x-grid3-cell x-grid3-td-Lunes " style="width: 100px;" tabindex="0"> <div class="x-grid3-cell-inner x-grid3-col-Lunes" unselectable="on">&nbsp;</div></td><td class="x-grid3-col x-grid3-cell x-grid3-td-Martes " style="width: 100px;" tabindex="0"> <div class="x-grid3-cell-inner x-grid3-col-Martes" unselectable="on">06:00-07:59 <br>7202 <br>ING. SISTEMAS GRUP</div></td><td class="x-grid3-col x-grid3-cell x-grid3-td-Miercoles " style="width: 100px;" tabindex="0"> <div class="x-grid3-cell-inner x-grid3-col-Miercoles" unselectable="on">&nbsp;</div></td><td class="x-grid3-col x-grid3-cell x-grid3-td-Jueves " style="width: 100px;" tabindex="0"> <div class="x-grid3-cell-inner x-grid3-col-Jueves" unselectable="on">06:00-07:59 <br>7204 <br>ING. SISTEMAS GRUP <br></div></td><td class="x-grid3-col x-grid3-cell x-grid3-td-Viernes " style="width: 100px;" tabindex="0"> <div class="x-grid3-cell-inner x-grid3-col-Viernes" unselectable="on">&nbsp;</div></td><td class="x-grid3-col x-grid3-cell x-grid3-td-Sabado x-grid3-cell-last " style="width: 100px;" tabindex="0"> <div class="x-grid3-cell-inner x-grid3-col-Sabado" unselectable="on">&nbsp;</div></td></tr></tbody> </table> </div></div><a href="https://chaira.udla.edu.co:8443/Chaira/View/Private/Academico/Docente/Horario.aspx?1472347817196#" class="x-grid3-focus" tabindex="-1" id="ext-gen28" style="left: 1px; top: 25px;"></a> </div></div><div class="x-grid3-resize-marker" id="ext-gen29">&nbsp;</div><div class="x-grid3-resize-proxy" id="ext-gen30">&nbsp;</div></div></div></div></div><input type="hidden" size="20" autocomplete="off" id="GridPanel1_SM" name="GridPanel1_SM" class=" x-form-hidden x-form-field"> </div></div></div><div> <input type="hidden" name="__EVENTTARGET" id="__EVENTTARGET" value=""> <input type="hidden" name="__EVENTARGUMENT" id="__EVENTARGUMENT" value=""> <input type="hidden" name="__VIEWSTATE" id="__VIEWSTATE" value="/wEPDwUJNDgxMjg2MTc4D2QWAgIDD2QWAgIFD2QWCGYPFCoSU3lzdGVtLldlYi5VSS5QYWlyAQ8FBGJhc2UPFgIeBFRleHQFWzwvYnI+IDxiPkNlZHVsYTogPC9iPjEyMzQ1Njc4OTAgPC9icj48Yj5Ob21icmUgZGVsIGRvY2VudGU6IDwvYj5FTElNSU5BUiBFTElNSU5BUiBFTElNSU5BUiBkFgJmDxYCHgVjbGFzcwUIeC1oaWRkZW5kAgEPFCsEAQ8FBGJhc2UPFgIeBVZhbHVlBQoxMjM0NTY3ODkwZBYCZg8WAh8BBQh4LWhpZGRlbmQCAg8UKwQBDwUEYmFzZQ8WAh8CBRtFTElNSU5BUiBFTElNSU5BUiBFTElNSU5BUiBkFgJmDxYCHwEFCHgtaGlkZGVuZAIDDxQrBAEPBQRiYXNlDxYCHgZMYXlvdXQFBGF1dG9kFgRmD2QWBAIBD2QWBmYPZBYCZg8WAh8BBQh4LWhpZGRlbmQCAQ9kFgJmDxYCHwEFCHgtaGlkZGVuZAICDxYCHwEFCHgtaGlkZGVuZAIDDxYCHwEFCHgtaGlkZGVuZAIBDxYCHwEFCHgtaGlkZGVuZBgBBR5fX0NvbnRyb2xzUmVxdWlyZVBvc3RCYWNrS2V5X18WBwUQUmVzb3VyY2VNYW5hZ2VyMQUNRGlzcGxheUZpZWxkMQUJZG9jdW1lbnRvBQZub21icmUFBlBhbmVsMgUKR3JpZFBhbmVsMQUMZGVzY2FyZ2FyUGRm2rQhEyUJMZva+0WlGRKbFimnlnMX91g43e8l2DjkF2c="> </div><script type="text/javascript">//<![CDATA[ var theForm=document.forms["form1"]; if (!theForm){theForm=document.form1;}function __doPostBack(eventTarget, eventArgument){if (!theForm.onsubmit || (theForm.onsubmit() !=false)){theForm.__EVENTTARGET.value=eventTarget; theForm.__EVENTARGUMENT.value=eventArgument; theForm.submit();}}//]]> </script> <div> <input type="hidden" name="__EVENTVALIDATION" id="__EVENTVALIDATION" value="/wEdAALQg7zJBv8bzKzpvd+JTFFzBUdYWMLkI/tXuqI0HQ389B598VHPJK0QFMh19965C5ne5TH0mi7Jm1pZZ5hqS6Mo"> </div><div> </div></form> <div id="ext-comp-1001" class="x-tip" style="position: absolute; z-index: 20002; visibility: hidden; display: none;"> <div class="x-tip-tl"> <div class="x-tip-tr"> <div class="x-tip-tc"> <div class="x-tip-header x-unselectable" id="ext-gen5"><span class="x-tip-header-text"></span></div></div></div></div><div class="x-tip-bwrap" id="ext-gen6"> <div class="x-tip-ml"> <div class="x-tip-mr"> <div class="x-tip-mc" id="ext-gen9"> <div class="x-tip-body" id="ext-gen7" style="height: auto;"></div></div></div></div><div class="x-tip-bl x-panel-nofooter" id="ext-gen8"> <div class="x-tip-br"> <div class="x-tip-bc"></div></div></div></div><div class="x-tip-anchor x-tip-anchor-top" id="ext-gen10" style="z-index: 20003;"></div></div><div id="ext-gen31" class="x-dd-drag-proxy x-dd-drop-nodrop x-grid3-col-dd" style="position: absolute; z-index: 15000; visibility: hidden; left: -10000px; top: -10000px;"> <div class="x-dd-drop-icon"></div><div class="x-dd-drag-ghost" id="ext-gen32"></div></div><div class="col-move-top" id="ext-gen33">&nbsp;</div><div class="col-move-bottom" id="ext-gen34">&nbsp;</div></body></html>' + "";
                        parser.scheduleDocente(html, function(horaryParser) {
                            var menuGrupos = {
                                menu1: ["Docentes", "span"],
                                menu2: ["Grupos", "span"],
                                menu3: ["Grupos", "span"]
                            };
                            client2.newWindow("https://chaira.udla.edu.co/Chaira/View/Private/Desktop.aspx");
                            client2.click('//button[text()="Inicio"]');
                            menu.openMenu(client2, menuGrupos, function(resGrupos, html, client2) {
                                program.kill(); //close Phantomjs
                                if (resGrupos == "Open iframe") {
                                    parserGroup.listGroup(html, function(dataList) {
                                        //Guardar en firebase los grupos del docente
                                        var token = util.generateToken({
                                            id: horaryParser.id,
                                            name: horaryParser.name,
                                            user: credentials[0],
                                            rol: "Docente",
                                            program: "Sin Programa", //Traerlo del grupo
                                            date: new Date().getTime()
                                        });
                                        fbSchedule.saveGroupTeacher(dataList, horaryParser);
                                        console.log("finish\n===========================");
                                        res.status(200).send(fbUser.saveDocent(horaryParser, token, credentials[0], dataList)); //Guardar el docente
                                    });
                                } else {
                                    res.status(400).send(resMenu);
                                }
                            });
                        });
                    } else {
                        program.kill();
                        res.status(400).send(resMenu);
                    }
                });
            } else {
                program.kill();
                res.status(400).send("Lo sentimos Prego aun no esta disponible en tu rango.");
            }
        } else {
            program.kill();
            res.status(400).send(data);
        }
    });
};

exports.getAll = function(req, res) {
    var codeSubject = req.body.codeSubject,
        group = req.body.nameSubject;
    //Retornar codigo de estudiante, nombre y carrera
};

exports.getSubjects = function(req, res) {
    fbUser.getSubjects(req.id, function(data) {
        res.status(200).send(data);
    });
}
