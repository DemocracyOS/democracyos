const express = require('express')
const middlewares = require('lib/api-v2/middlewares')
const Forum = require('lib/models').Forum

const app = module.exports = express()

app.post('/',
middlewares.users.restrict,
function changeStage (req, res) {
	let forumId = req.body.forumId
	Forum.findOne({ _id: forumId })
		.then((forum) => {
			console.log(forum.name)
		})
})
