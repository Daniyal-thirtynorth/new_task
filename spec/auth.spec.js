// const expect = require('chai').expect
// const fetch = require('isomorphic-fetch')

// const url = path => `http://localhost:3000${path}`

// describe('authentication', () => {

// 	it('register', (done) => {
// 		let options =  {
// 			method: 'POST',
//         	headers: {'Content-Type': 'application/json'},
//             body: JSON.stringify({
//                 "username":"ppp",
//                 "password":"Abcd@1234",
//                 "email":"abcd@gmail.com",
//                 "dob":"01-01-1990",
//                 "zipcode":"99999"	 
//         	})
//     	}
// 		fetch(url("/register"),options)
// 		.then(res => {
// 			expect(res.status).to.eql(200)	
// 			return res.json();
// 		})
// 		.then(body => {
// 			expect(body.result).to.eql("Succeed!");
// 		})
// 		.then(done)
// 		.catch(done)
//  	}, 200)

//      it('login', (done) => {
// 		let options =  {
// 			method: 'POST',
//         	headers: {'Content-Type': 'application/json'},
//             body: JSON.stringify({
//                 "username":"abc",
//                 "password":"Abcd@1234"
//         	})
//     	}
// 		fetch(url("/login"),options)
// 		.then(res => {
// 			expect(res.status).to.eql(200)	
// 			return res.json();
// 		})
// 		.then(body => {
// 			expect(body.result).to.eql("success");
// 		})
// 		.then(done)
// 		.catch(done)
//  	}, 200)

// });
