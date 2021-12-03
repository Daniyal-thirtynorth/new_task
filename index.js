
const express = require('express')
const cors = require("cors")
const bodyParser = require('body-parser')
const app = express()
app.use(cors({
	origin: "*",
	credentials: true,
	exposedHeaders: ["set-cookie"],
}))
app.use(bodyParser.json())
app.use(bodyParser.text())
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", req.headers.origin)
	//res.header("Access-Control-Allow-Origin", "*")
	res.header("Access-Control-Allow-Credentials", true)
	res.header("Access-Control-Allow-Methods", 'GET, DELETE, POST, PUT')
	res.header("Access-Control-Allow-Headers", 'Authorization, Content-Type, Origin, X-Requested-With, X-Session-Id')
	res.header("Access-Control-Expose-Headers", 'Location, X-Session-Id')
	if (req.method === 'OPTIONS') {
		console.log('received options')
		res.sendStatus(200)
		return
	}
	else {

		next()
	}
})


require('./src/auth')(app)
require('./src/following')(app)
require('./src/profile')(app)
require('./dbpost')(app)
require('./articles')(app)
const port = process.env.PORT || 5000
const server = app.listen(port, () => {
	const addr = server.address()
	console.log(`Server listening at http://${addr.address}:${addr.port}`)

})

