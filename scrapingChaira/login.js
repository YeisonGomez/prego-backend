module.exports.loginChaira = function(params, user, password, callback) {
    params.phantomjs.run('--webdriver=4444').then(function(program) {
        client = params.webdriverio.remote(params.wdOpts);
        client
            .init()
            .url('https://chaira.udla.edu.co/Chaira/Logon.aspx')
            .windowHandleSize({width: 1000, height: 760})
            .setValue('#txt_usuario', user)
            .addValue('#txt_password', password)
            .click("#btn_ingresar").then(function() {
                console.log("Login....");
                validLogin(function(res) {
                    console.log(res);
                    clickSubMenu2("Inicio", "button", function(res1) {
                        if (res1 == "Bien") {
                            client.isExisting('//span[text()="' + 'Docentes' + '"]').then(function(ex) {
                                var rol;
                                if (ex == true) {
                                    rol = "Docente";
                                } else {
                                    rol = "Estudiante";
                                }
                                callback(res, client, program, rol);
                            });
                        } else {
                            callback(res1);
                        }
                    });
                });
            });

        //PROPIAS

        var clickSubMenu2 = function(menu, element, callback) {
            client
                .waitForExist('//' + element + '[text()="' + menu + '"]', 10000).then(function(inicio) {
                    client.click('//' + element + '[text()="' + menu + '"]').then(function() {
                        callback("Bien");
                    });
                }).catch(function(err) {
                    callback("La conexión con el servidor ha superado el tiempo de espera máximo.");
                })
        }

        var time = 0;
        var validLogin = function(callback) {
            time++;
            console.log("Wait....");
            client.pause(2000)
                .getUrl().then(function(url) {
                    if (url == "https://chaira.udla.edu.co/Chaira/Logon.aspx" && time < 10) {
                        client.getAttribute('#txt_password', 'value').then(function(res) { //Usuario invalido
                            if (res == "") {
                                client.isExisting('//div[@class="sa-icon sa-warning pulseWarning"]').then(function(passwordInvalid) { //Contraseña invalida
                                    if (passwordInvalid) {
                                        callback("La contraseña es incorrecta");
                                    } else {
                                        callback("El usuario es incorrecto");
                                    }
                                });
                            } else {
                                client.isExisting('//div[@class="sa-icon sa-warning pulseWarning"]').then(function(passwordInvalid) { //Contraseña invalida
                                    if (passwordInvalid) {
                                        callback("La contraseña es incorrecta");
                                    } else {
                                        return validLogin(callback);
                                    }
                                });
                            }
                        });
                    } else if (time >= 10) {
                        callback("La conexión con el servidor ha superado el tiempo de espera máximo.");
                    } else {
                        callback("user valid");
                    }
                });
        }
    })
};
