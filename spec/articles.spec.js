
const expect = require('chai').expect
const fetch = require('isomorphic-fetch')

const url = path => `http://localhost:3000${path}`

describe('Test Cases', () => {

	it('register', (done) => {
		let options =  {
			method: 'POST',
        	headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "username":"qwe",
                "password":"Abcd@1234",
                "email":"abcd@gmail.com",
                "dob":"01-01-1990",
                "zipcode":"99999"	 
        	})
    	}
		fetch(url("/register"),options)
		.then(res => {
			expect(res.status).to.eql(200)	
			return res.json();
		})
		.then(body => {
			expect(body.result).to.eql("Succeed!");
		})
		.then(done)
		.catch(done)
 	}, 200)

     it('login', (done) => {
		let options =  {
			method: 'POST',
        	headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "username":"qqq",
                "password":"Abcd@1234"
        	})
    	}
		fetch(url("/login"),options)
		.then(res => {
			expect(res.status).to.eql(200)	
			return res.json();
		})
		.then(body => {
			expect(body.result).to.eql("success");
		})
		.then(done)
		.catch(done)
 	}, 200)

	it('should return 0 articles', (done) => {
		let options =  {
			method: 'GET',
        	headers: {'Content-Type': 'application/json'}
    	}
		fetch(url("/articles"),options)
		.then(res => {
			expect(res.status).to.eql(200)	
			return res.json();
		})
		.then(body => {
			expect(body.articles.length).to.least(3);
		})
		.then(done)
		.catch(done)
 	}, 200)

	it('should add two articles with successive article ids, and return the article each time', (done) => {
		
		let id1, id2
		const firstArticle = "This is my 1st post article!"
		const secondArticle = "This is my 2rd post article!"
		let options1 =  {
			method: 'POST',
        	headers: {'Content-Type': 'application/json'},
        	body: JSON.stringify({
        		"author": "A1",
				"text": firstArticle
        	})
    	}
		fetch(url("/article"),options1)
		.then(res => {
			expect(res.status).to.eql(200)
			return res.json();
		})
		.then(body => {
			expect(body.id).to.exist;
			id1 = body.id;
			expect(body.text).to.eql(firstArticle);
		}).then( _=>{
			let options2 =  {
				method: 'POST',
        		headers: {'Content-Type': 'application/json'},
        		body: JSON.stringify({
        			"author": "A2",
					"text": secondArticle
        		})
    		}
		 	return fetch(url("/article"),options2)
		})
		.then(res => {
			expect(res.status).to.eql(200)
			return res.json();
		})
		.then(body => {
			expect(body.id).to.exist;
			id2 = body.id;
			expect(id2).to.eql(id1+1);
			expect(body.text).to.eql(secondArticle);
		})
		.then(done)
		.catch(done)
 	}, 200)

	it('should return an article with a specified id', (done) => {
		let options =  {
			method: 'GET',
        	headers: {'Content-Type': 'application/json'}
    	}
		fetch(url("/articles"),options)
		.then(res => {
			expect(res.status).to.eql(200)	
			return res.json();
		})
		.then(body => {
			expect(body.articles.length).to.least(3);
			return body.articles[0].id;
		})
		.then( randID =>{
			return fetch(url(`/articles/${randID}`), options)
		})
		.then( res => {
			expect(res.status).to.eql(200)	
			return res.json();
		})
		.then(body => {
			expect(body.articles.length).to.eql(1);
		})
		.then(done)
		.catch(done)
	}, 200)

	it('should return nothing for an invalid id', (done) => {
		let options =  {
			method: 'GET',
        	headers: {'Content-Type': 'application/json'}
    	}
		fetch(url("/articles/0"),options)
		.then(res => {
			expect(res.status).to.eql(200)	
			return res.json();
		})
		.then(body => {
			expect(body.articles.length).to.eql(0);
		})
		.then(done)
		.catch(done)
	}, 200)

});
