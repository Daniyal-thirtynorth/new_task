// const expect = require('chai').expect
// const fetch = require('isomorphic-fetch')

// const url = path => `http://localhost:3000${path}`

// describe('Validate Profile functionality', () => {

// 	it('PUT headline updates the headline message,', (done) => {
// 		var oldheadline;
// 		var newheadline = "new headline"
// 		var username;
// 		fetch(url("/headlines"), {
// 			"method" : 'GET',
// 			"headers": {'Content-Type' : 'application/json' }
// 		})
// 		.then(res => {
// 			expect(res.status).to.eql(200)	
// 			return res.json()
// 		})
// 		.then(res => {
// 			oldheadline = res.headlines[0].headline
// 			username = res.headlines[0].username
// 		})

// 		.then(_=>{

//             return fetch(url("/headline"), {
//                 "headers": {'Content-Type': 'application/json'},
//                 "method": 'PUT',
//                 "body": JSON.stringify({"headline": newheadline + oldheadline})
//             })            
//         })
// 		.then(res=>{
//             expect(res.status).to.equal(200)
//             return res.json()
//         })
//         .then((res)=>{
//             expect(res.headline).to.equal(newheadline + oldheadline)
//         })

//         .then(_=>{
//             return fetch(url("/headlines/" + username), {
//                 "method": 'GET',
//                 "headers": {'Content-Type': 'application/json'}
//             })
//         })
//         .then(res => {
//             expect(res.status).to.equal(200)
//             return res.json()
//         })
//         .then(res => {
//             expect(res.headlines[0].headline).to.equal(newheadline + oldheadline)
//             expect(newheadline + oldheadline).to.not.equal(oldheadline)
//         })

// 		.then(done)
// 		.catch(done)
 	
//  	}, 200)

	

// });