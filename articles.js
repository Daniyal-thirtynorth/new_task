const bodyParser = require('body-parser')
let articleModel = require('./model.js').Article
const uploadImage = require('./src/uploadCloudinary')
let id = 5;
const addArticle = async (req, res) => {
    // console.log('Payload received', req.body)
    // var newarticle = { id: articles.length + 1, author: req.body.author, date: req.body.date, text: req.body.text, comments: [] }
    // articles = [...articles,
    //     newarticle]
    try {
        const {
            text,
            title
        } = req.body
        const author = req.username
        const allArticles = await articleModel.countDocuments({})
        const newarticle = new articleModel({
            id: allArticles + 1,
            date: Date.now(),
            author,
            text,
            title
        })
        await newarticle.save()
        res.status(200).send(newarticle)
    } catch (err) {
        return res.status(400).json({ result: err.message })
    }
}


const getArticle = async (req, res) => {
    // if (req.params.id) {
    //     console.log(articles)
    //     let target = articles.filter((item) => { return item.id == req.params.id })
    //     console.log(articles.filter((item) => { return item.id == req.params.id }))
    //     console.log(target)
    //     console.log(req.params.id)
    //     if (target.length !== 0) {
    //         res.send({ articles: target });
    //     }
    //     else {
    //         res.send({ articles: [] })
    //     }
    // }
    // else {
    //     res.send({ articles: articles });
    // }
    try {
        const id = req.params.id
        let filter = {}
        if (id) {
            filter = { id }
        }
        const articles = await articleModel.find(filter)
        return res.status(200).json({ articles })
    } catch (err) {
        return res.status(400).json({
            result: err.message
        })
    }
}
const putArticle = async (req, res) => {
    let p_id = req.params.id;

    // let newarticles = articles.filter((item) => { return item.id != p_id })
    // let selectedarticles = articles.filter((item) => { return item.id == p_id })[0]

    // if (req.body.commentId && req.body.commentId > -1) {

    //     let unselectedcomment = selectedarticles.comments.filter((item) => { return item.commentId != req.body.commentId })
    //     res.send({
    //         articles:
    //             [...newarticles,
    //             {
    //                 selectedarticles, comments:
    //                     [...unselectedarticles.comments,
    //                     { commentId: req.body.commentId, text: req.body.text, author: 'guest' }
    //                     ]
    //             }
    //             ]
    //     }
    //     )
    // }
    // if (req.body.commentId && req.body.commentId == -1) {


    //     res.send({
    //         articles:
    //             [...newarticles,
    //             {
    //                 selectedarticles, comments:
    //                     [...unselectedarticles.comments,
    //                     { commentId: 1000, text: req.body.text, author: 'guest' }
    //                     ]
    //             }
    //             ]
    //     }
    //     )
    // }
    // else {
    //     res.send({
    //         articles:
    //             [...newarticles, { selectedarticles, text: req.body.text }]
    //     })
    // }
    try {
        const id = req.params.id
        const { text, title } = req.body
        const updated = await articleModel.findOneAndUpdate({ id: id }, {
            text: text,
            title
        }, {
            new: true
        })
        return res.status(200).json({ articles: updated })
    } catch (err) {
        return res.status(400).json({
            result: err.message
        })
    }
}
const defaultmsg = async (req, res) => {
    res.send("Hello pg39!")
}
const addImage = async (req, res) => {

    try {
        const articleId = req.params.id
        const avatar = req.fileurl
        console.log(req.fileurl)
        await articleModel.findOneAndUpdate({ id: articleId }, {
            img: avatar
        })
        return res.status(200).json({ result: "Image added", img: avatar })
    } catch (err) {
        return res.status(400).json({
            result: err.message
        })
    }
}

module.exports = app => {
    app.use(bodyParser.json())
    app.get('/test3', defaultmsg)
    app.post('/article', addArticle)
    app.get('/articles/:id?', getArticle)
    app.put('/articles/:id?', putArticle)
    app.post('/article/addPhoto/:id', uploadImage('avatar'), addImage)
}

// Get the port from the environment, i.e., Heroku sets it



var articles = [{
    id: 1,
    author: "pg39",
    text: "This is my first article",
    comments: [{ author: 'pg39test', commendId: 1212, date: '2015-10-27T19:52:25.960Z', text: 'The quick, brown fox jumps over a lazy dog. DJs flock by when MTV ax quiz prog. Junk MTV quiz graced by fox whelps. Bawds jog, flick quartz, vex nymphs. Waltz, bad nymph, for quick jigs vex!' }],
    date: '2017-04-04T15:09:04Z',
    img: 'http://az616578.vo.msecnd.net/files/2017/02/10/636223537065395516-1597768472_snow%204.jpg'
},
{
    id: 2,
    author: "pg39",
    text: "This is Karl's article",
    comments: [{ author: 'pg39test2', commendId: 1213, date: '2015-10-17T19:52:25.960Z', text: 'The quick, brown fox jumps over a lazy dog. DJs flock by when MTV ax quiz prog. Junk MTV quiz graced by fox whelps. Bawds jog, flick quartz, vex nymphs. Waltz, bad nymph, for quick jigs vex!' }],
    date: '2011-04-04T15:07:04Z'
},
{
    id: 3,
    author: "pg39",
    text: "This is Robert's article",
    comments: [{ author: 'pg39', commendId: 1214, date: '2016-10-27T19:52:25.960Z', text: 'The quick, brown fox jumps over a lazy dog. DJs flock by when MTV ax quiz prog. Junk MTV quiz graced by fox whelps. Bawds jog, flick quartz, vex nymphs. Waltz, bad nymph, for quick jigs vex!' }],
    date: '2016-04-04T15:07:04Z',
    img: 'https://s-media-cache-ak0.pinimg.com/originals/20/0b/95/200b95dfb2efa80d37479764a324b462.jpg'
},
{
    id: 4,
    author: "pg39",
    text: "Test article 4",
    comments: [],
    date: '2017-04-03T15:07:04Z',
    img: 'http://hpcsonline.org/wp-content/uploads/2016/01/Snow-row.jpg'
},
{
    id: 5,
    author: "pg39",
    text: "Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin urna dolor sagittis lacus. Donec elit libero, sodales nec, volutpat a, suscipit non, turpis. Nullam sagittis. Suspendisse pulvinar, augue ac venenatis condimentum, sem libero volutpat nibh, nec pellentesque velit pede quis nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce id purus. Ut varius tincidunt libero. Phasellus dolor. Maecenas vestibulum mollis diam. Pellentesque ut neque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
    comments: [{ author: 'pg39test3', commendId: 1215, date: '2015-11-27T19:52:25.960Z', text: 'test comment' },
    { author: 'pg39', commendId: 1216, date: '2015-11-28T19:52:25.960Z', text: 'test comment more' }],
    date: '2017-04-04T15:07:04Z',
    img: 'http://www.telegraph.co.uk/content/dam/Travel/ski/CourchevelTourisme-DomaineSkiable-36_header-large.jpg'
}
]