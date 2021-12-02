const md5 = require('md5')
var User = require('../model.js').User
var Profile = require('../model.js').Profile
var Article = require('../model.js').Article
var cookieParser = require('cookie-parser')
var redis = require('redis');
const client = redis.createClient({
	host: 'redis-18930.c284.us-east1-2.gce.cloud.redislabs.com',
	port: 18930,
	password: 'XFuRXsnB0c1wH7RkYIwtPKVN3IBp4gq5'
});
client.on("error", function (err) {
	console.log("Error " + err);
});
const saltLength = 20;
const cookieKey = 'sid';

const randomSalt = (len) => {
	const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var randomString = '';
	for (var i = 0; i < len; i++) {
		randomString += charSet.charAt(Math.floor(Math.random() * charSet.length));
	}
	return randomString;
}

const saltedHash = (password, salt) => {
	return md5(password + salt);
}

const findByUsernameInUser = (username, callback) => {
	User.find({ username }).exec(function (err, items) {
		callback(items);
	})
}

const findByUsernameInProfile = (username, callback) => {
	Profile.find({ username }).exec(function (err, items) {
		callback(items);
	})
}

function isLoggedIn(req, res, next) {

	let first_login = (req.url == '/login') || (req.url == '/register') || (req.url == '/googleLogin')
	if (req.method == 'OPTIONS') {
		res.status(200).json()
		console.log(req.url)
		return
	}
	else if (!req.cookies && (!first_login)) {
		console.log('cookie missing')
		res.status(401).send({ result: 'Not authorized! No  cookie!' })
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


const loginAction = (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	console.log('login  fired')
	console.log(req.body)
	if (!username || !password) {
		res.status(400).send({ result: "Invalid input!" });
		return;
	}
	findByUsernameInUser(username, (items) => {
		if (items.length === 0) {
			res.status(401).send({ result: "No such user exist!" })
			return;
		}
		else {
			//validating credentials
			const salt = items[0].salt;
			const hash = items[0].hash;
			if (saltedHash(password, salt) != hash) {
				res.status(401).send({ result: "Wrong password!" })
				return;
			}
			else {
				console.log(hash)
				let sessionKey = saltedHash(hash, salt)
				client.hmset(sessionKey, { username })
				//console.log(username)
				res.cookie(cookieKey, sessionKey, { maxAge: 3600 * 1000, httpOnly: true })
				res.status(200).send({ username: username, result: 'success' });
				return;
			}
		}
	})
}

const logoutAction = (req, res) => {
	client.del(req.cookies[cookieKey])
	res.status(200).send('Logout Succeed!')
}

const registerAction = (req, res) => {
	console.log("register hit")
	const username = req.body.username;
	const password = req.body.password;
	const email = req.body.email;
	const dob = req.body.dob;
	const zipcode = req.body.zipcode;
	const phone = req.body.phone;
	const displayName = req.body.displayName
	console.log(req.body);
	if (!username || !password || !email || !dob || !zipcode) {
		res.status(400).send({ result: "Invalid input!" });
		return;
	}
	findByUsernameInUser(username, function (items) {
		if (items.length !== 0) {
			res.status(400).send({ result: "User already exist!" })
			return;
		}
		else {
			const mySalt = randomSalt(saltLength)
			new User({ username: username, displayName, salt: mySalt, hash: saltedHash(password, mySalt) }).save(async () => {
				// new Profile({
				// 	username: username, email: email, zipcode: zipcode, dob: dob, headline: "New User!",
				// 	avatar: 'https://i.ytimg.com/vi/haoytTpv2NU/maxresdefault.jpg',
				// 	following: []
				// }).save(() => {
				// 	res.status(200).send({ result: "Succeed!" })
				// 	return;
				// });
				const first2 = await Profile.find({}).limit(2)
				const newFollowings = []
				for (let elem of first2) {
					newFollowings.push(elem.username)
				}
				for (let i = 1; i <= 6; i++) {
					await Article.create({
						id: i,
						author: username,
						text: "something in description " + i,
						title: "some title " + i
					})
				}
				const profileCreated = new Profile({
					username: username, email: email, zipcode: zipcode, dob: dob, headline: "New User!",
					avatar: 'https://i.ytimg.com/vi/haoytTpv2NU/maxresdefault.jpg',
					following: newFollowings,
					phone,
					displayName
				})
				await profileCreated.save()
				res.status(200).send({ result: "Succeed!" })
				return;

			});
		}
	});
}

const putPassword = (req, res) => {
	const password = req.body.password;
	const username = req.username;
	if (!password) {
		res.status(400).send({ result: "Invalid input!" });
	}
	const newSalt = randomSalt(saltLength)
	User.findOneAndUpdate({ username }, { salt: newSalt, hash: saltedHash(password, newSalt) }, { new: true }, (error, doc) => {
		if (error) {
			res.status(400).send({ error: error })
		}
		else {
			if (doc) {
				client.del(req.cookies[cookieKey])
				let newCookie = saltedHash(doc.hash, doc.salt)
				client.hmset(newCookie, { username })
				res.cookie(cookieKey, newCookie, { maxAge: 3600 * 1000, httpOnly: true })
				res.status(200).send({ username, status: 'Password changed!' })
			}
			else {
				res.status(404).send({ result: 'No matched items!' })
			}
		}
	})
}
const googleLogin = async (req, res, next) => {
	try {
		const { username, googleId, email, avatar } = req.body

		let newUserName = username + "-" + googleId
		const isAlreadyExist = await User.findOne({
			username: newUserName
		})
		const mySalt = randomSalt(saltLength)
		const hash = saltedHash(googleId, mySalt)

		if (!isAlreadyExist) {

			// new User({ username: username, displayName, salt: mySalt, hash: saltedHash(password, mySalt) }).save(async () => {

			const createdUser = new User({
				username: newUserName,
				googleId,
				displayName: username,
				salt: mySalt,
				hash,
			})
			const createdProfile = new Profile({
				email,
				username: newUserName,
				avatar,
				displayName: username,
				following: ["pg1", "pg2"]
			})
			for (let i = 1; i <= 6; i++) {
				await Article.create({
					id: i,
					author: newUserName,
					text: "something in description " + i,
					title: "some title " + i
				})
			}
			await createdUser.save()
			await createdProfile.save()

		} else {
			const foundedHash = isAlreadyExist.hash;
			const foundedSalt = isAlreadyExist.salt;
			let sessionKeyPrevious = saltedHash(foundedHash, foundedSalt)
			client.hmset(sessionKeyPrevious, { username: isAlreadyExist.username })
			res.cookie(cookieKey, sessionKeyPrevious, { maxAge: 3600 * 1000, httpOnly: true })
			return res.status(200).json({ result: "Succeed!", username: isAlreadyExist.username })
		}
		let sessionKey = saltedHash(hash, mySalt)
		console.log("🎁🎁🎁🎁🎁🎁 username was", username)
		client.hmset(sessionKey, { username: newUserName })
		res.cookie(cookieKey, sessionKey, { maxAge: 3600 * 1000, httpOnly: true })
		return res.status(200).json({ result: "Succeed!", username: username })

	} catch (err) {
		return res.status(400).json({ result: err.message })
	}
}
const updateInfo = async (req, res, next) => {
	try {
		//const username = req.body.username;
		const password = req.body.password;
		const email = req.body.email;
		const dob = req.body.dob;
		const zipcode = req.body.zipcode;
		const displayName = req.body.displayName
		const phone = req.body.phone
		//User.findOneAndUpdate({ username }, { salt: newSalt, hash: saltedHash(password, newSalt) }
		const newSalt = randomSalt(saltLength)
		const newHash = saltedHash(password, newSalt)
		const foundedUser = await User.findOne({
			username: req.username
		})
		if (foundedUser) {
			await Profile.findOneAndUpdate({ username: req.username, dob, zipcode, email, phone, displayName })

			//foundedUser.username = username;
			foundedUser.displayName = displayName
			if (password) {
				foundedUser.salt = newSalt;
				foundedUser.hash = newHash
				let newCookie = saltedHash(newHash, newSalt)
				client.hmset(newCookie, { username: req.username })
				client.del(req.cookies[cookieKey])
				res.cookie(cookieKey, newCookie, { maxAge: 3600 * 1000, httpOnly: true })
			}
			await foundedUser.save()
			return res.status(200).json({
				result: "Info updated successfully"
			})
		} else {
			return res.status(400).json({ result: "No user data found" })
		}
	} catch (err) {
		return res.status(400).json({ result: err.message })
	}
}
const getInfo = async (req, res, next) => {
	try {
		const foundedInfo = await Profile.findOne({ username: req.username })
		return res.status(200).json({ result: foundedInfo })
	} catch (err) {
		return res.status(400).json({ result: err.message })
	}
}
const test = (req, res, next) => {
	return res.status(200).json({ msg: "working" })
}
module.exports = app => {
	app.use(cookieParser())
	app.post('/login', loginAction)
	app.post('/register', registerAction)
	app.post("/googleLogin", googleLogin)
	app.use(isLoggedIn)
	app.put('/logout', logoutAction)
	app.put('/password', putPassword)
	app.put("/updateProfileInfo", updateInfo)
	app.get("/getProfileInfo", getInfo)
}
