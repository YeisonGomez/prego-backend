module.exports.openMenu = function(client, menu, callback) {
    var copyE = "";
    var iElement = 0;
    client.pause(10).then(function() {
        console.log("click " + menu.menu1[0] + "...");
        clickSubMenu(menu.menu1[0], menu.menu1[1], function(res2) {
            if (res2 == "Bien") {
                console.log("click " + menu.menu2[0] + "...");
                clickSubMenu(menu.menu2[0], menu.menu2[1], function(res3) {
                    if (res3 == "Bien") {
                        console.log("click " + menu.menu3[0] + "...");
                        clickSubMenu(menu.menu3[0], menu.menu3[1], function(res4) {
                            if (res4 == "Bien") {
                                client.waitForExist('//iframe[contains(@src,"' + menu.menu3[0] + '.aspx")]', 10000).then(function() {
                                    //Encontro el elemento
                                    client.getAttribute('//iframe[contains(@src,"' + menu.menu3[0] + '.aspx")]', 'src').then(function(att) {
                                        client.newWindow(att, "Iframe")
                                            .pause(2000)
                                            .getAttribute('#form1', 'innerHTML').then(function(html) { //iframe
                                                this.close();
                                                console.log("Open iframe");
                                                callback("Open iframe", html, client);
                                            })
                                    });
                                }).catch(function() {
                                    console.log("time exceeded, wait iframe");
                                    callback("time exceeded, wait iframe");
                                });

                            } else {
                                callback(res4);
                            }
                        });
                    } else {
                        callback(res3);
                    }
                });
            } else {
                callback(res2);
            }
        });

    });

    //PROPIAS
    var clickSubMenu = function(menu, element, callback) {
        if (copyE == menu) {
            iElement++;
        } else {
            iElement = 0;
        }
        client
            .waitForExist('//' + element + '[text()="' + menu + '"]', 10000).then(function(inicio) {
                client.getAttribute('//' + element + '[text()="' + menu + '"]', 'id').then(function(button) {
                    if(iElement > 0){
                        button = button[iElement]; //Si el elemento es un arreglo, escoja el que sigue.
                    }
                    client.click("#" + button).then(function() {
                        client.clearElement("#" + button);
                        copyE = menu;
                        callback("Bien");
                    }).catch(function(err) {
                        console.log(err.message);
                        callback("Lo sentimos hubo un error en el servidor");
                    })
                });
            }).catch(function(err) {
                callback("La conexión con el servidor ha superado el tiempo de espera máximo.");
            })
    }
}
