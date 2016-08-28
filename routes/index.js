var route = {}
    routes_path = process.cwd() + '/routes'
    fs.readdirSync(routes_path).forEach(function (file) {
        if (file.indexOf('.js') != -1) {
            route[file.split('.')[0]] = require(routes_path + '/' + file)
        }
    })

//USUARIO
router.post('/user/login', route.user.login);
router.post('/user/subjects', auth.authenticateToken, route.user.getSubjects);
router.get('/user/getAll', route.user.getAll);

//PROFILE
//router.get('/profile/information', auth.ensureAuthenticated, route.profile.getInformation);

module.exports = router;
