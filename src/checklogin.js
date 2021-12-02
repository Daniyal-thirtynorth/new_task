
function isLoggedIn(req, res, next) {

    let first_login = (req.url == '/login') || (req.url == '/register')
    if (req.method == 'OPTIONS') {
        res.sendStatus(200)
        console.log(req.url)
        return
    }
    else if (!req.cookies && (!first_login)) {
        console.log('cookie missing')
        res.status(401).send('Not authorized! No  cookie!')
        return
    }
    else {
        console.log(req.url)
        console.log(req.cookies)
        let sid = req.cookies[cookieKey]

        if (first_login) {
            req.username = req.body.username
            console.log('login!')
        }
        console.log('sid: ' + sid)
        client.hgetall(sid, function (err, userObject) {
            if (userObject && userObject.username) {
                req.username = userObject.username;
                console.log('username sid:' + req.username)
                next();
            }
            else {
                next()
            }
        })
    }
}