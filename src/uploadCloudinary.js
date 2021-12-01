
const multer = require('multer')
const stream = require('stream')
const cloudinary = require('cloudinary')

if (!process.env.CLOUDINARY_URL) {
     process.env.CLOUDINARY_URL="cloudinary://863665439564258:nDl08K4Dz-nVl13fkk3Qrz_syXc@hmgzratvw"
}

const doUpload = (publicName, req, res, next) => {

	const uploadStream = cloudinary.uploader.upload_stream(result => {    	
         req.fileurl = result.url
         req.fileid = result.public_id
		 console.log(result.url)
         next()
	}, { public_id: req.body[publicName]})
	console.log(publicName)
	console.log(req.headers)

	const s = new stream.PassThrough()
	s.end(req.file.buffer)
	s.pipe(uploadStream)
	s.on('end', uploadStream.end)
	console.log('upload over')
}

const uploadImage = (publicName) => (req, res, next) =>
     multer().single('image')(req, res, () => 
               doUpload(publicName, req, res, next))


module.exports = uploadImage
