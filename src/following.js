//follower stubcs
const profileModel = require("../model").Profile
const getFollowing = async (req, res) => {
	// const user = req.params.user ? req.params.user: 'pg39'
	// res.status(200).send({ 
	// 	username:user,
	//  	following:['sep1','pg39test'] 
	//  })
	try {
		const user = req.params.user ? req.params.user : req.username
		const founded = await profileModel.findOne({ username: user })
		return res.status(200).json({
			username: user,
			following: founded.following
		})
	} catch (err) {
		return res.status(400).json({
			result: err.message
		})
	}
}


const putFollowing = async (req, res) => {
	// const user = req.params.user

	// if(!user){
	// 	res.status(400).send({result:"Invalid input!"});
	// 	return;
	// }

	// res.status(200).send({ 
	// 	username:'pg39',
	//  	following:['sep1','pg39test',user]
	// })
	try {
		const user = req.params.user
		const focusedUser = req.username
		const updated = await profileModel.findOneAndUpdate({ user: focusedUser }, {
			$push: { following: user }

		}, { new: true })
		return res.status(200).json({
			username: user,
			following: updated.following
		})
	} catch (err) {
		return res.status(400).json({
			result: err.message
		})
	}

}


const deleteFollowing = async (req, res) => {
	const user = req.params.user
	try {
		const user = req.params.user
		const focusedUser = req.username
		const updated = await profileModel.findOneAndUpdate({ user: focusedUser }, {
			$pull: { following: user }

		}, { new: true })
		return res.status(200).json({
			username: user,
			following: updated.following
		})
	} catch (err) {
		return res.status(400).json({
			result: err.message
		})
	}

	res.status(200).send({
		username: 'pg39',
		following: []
	})

}


module.exports = app => {
	app.get('/following/:user?', getFollowing)
	app.put('/following/:user', putFollowing)
	app.delete('/following/:user', deleteFollowing)
}