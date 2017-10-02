const express = require('express')
const middlewares = require('lib/api-v2/middlewares')
const Forum = require('lib/models').Forum
const debug = require('debug')

const log = debug('democracyos:ext:api:change-stage')

const app = module.exports = express()

app.post('/',
middlewares.users.restrict,
function changeStage (req, res, err) {
	log('POST/api/change-stage')
	const possibleStages = ['Votación abierta', 'Votación cerrada', 'Seguimiento']
	let forumId = req.body.forumId
	let futureStage = req.body.stage
	if (possibleStages.includes(futureStage)) {
		Forum.findOneAndUpdate(
			{'_id': forumId},
			{$set:
				{extra: 
					{stage: futureStage}
				}
			})
		.then((forum)=> {
			log('Forum stage changed successfully.')
			res.json({
				status: 200,
				message: forum.extra.stage
			})
    		res.end()
		}) 
	} else {
		log('Error: Wrong forum stage value.')
		res.status(400)
		res.end()
	}
})


