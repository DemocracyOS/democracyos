const chai = require('chai')
const chaiHttp = require('chai-http')
const {
  OK,
  CREATED,
  FORBIDDEN,
  NO_CONTENT
} = require('http-status')

const ObjectID = require('mongodb').ObjectID

const ReactionInstance = require('../../reactions/models/reaction-instance')
const ReactionRule = require('../../reactions/models/reaction-rule')
const ReactionVote = require('../../reactions/models/reaction-vote')
const User = require('../../users/models/user')
const { fakeUser, fakeVote, fakeReactionRule, fakeReactionInstance } = require('../utils')

const expect = chai.expect
chai.use(chaiHttp)

const sampleUser = fakeUser('user')
const sampleAdmin = fakeUser('admin')
const sampleVoter1 = fakeUser('user')
const sampleVoter2 = fakeUser('user')
const sampleVoter3 = fakeUser('user')
const sampleRule1 = fakeReactionRule('LIKE', 5)
const sampleRule2 = fakeReactionRule('LIKE', 1, new Date('2018-01-10'), new Date('2018-02-10'))
let sampleVote1User1Instance1 = null
let sampleVote2User2Instance1 = null
let sampleVote3User3Instance1 = null
let sampleVote4User1Instance2 = null
let sampleVote5User2Instance2 = null
let sampleVote6User3Instance2 = null
let sampleVote7User1Instance3 = null
let sampleVote8User2Instance3 = null
let sampleInstance1 = null
let sampleInstance2 = null
let sampleInstance3 = null

// Util global variables
let newUser = null
let newAdmin = null
let newVoter1 = null
let newVoter2 = null
let newVoter3 = null
let newRule1 = null
let newRule2 = null
let newVote1User1Instance1 = null
let newVote2User2Instance1 = null
let newVote3User3Instance1 = null
let newVote4User1Instance2 = null
let newVote5User2Instance2 = null
let newVote6User3Instance2 = null
let newVote7User1Instance3 = null
let newVote8User2Instance3 = null
let newInstance1 = null
let newInstance2 = null
let newInstance3 = null
let idPost1 = '5a94628a1398324327b5df6e'
let idPost2 = '5a94628a1398324327b5df6d'

let agent = null
let csrfToken = null
let response = null

describe('/api/v1.0/services/reactions', () => {
  // Post 1 has two reaction instance. (instance1, instance2)
  // Post 2 has one reaction instance. (instance3)
  // Instance 1 has 3 participants, 3 votes, by voter one two and three. (Result: 3)
  // Instance 2 has 3 participants, but 2 votes (voter three deleted the vote) (Result: 2)
  // Instance 3 has 2 participants (voter one and two) but both deleted the vote (Result: 0)

  before(async () => {
    await require('../../main')
    await User.remove({})
    await ReactionRule.remove({})
    await ReactionVote.remove({})
    await ReactionInstance.remove({})
    newUser = await (new User(sampleUser)).save()
    newAdmin = await (new User(sampleAdmin)).save()
    newVoter1 = await (new User(sampleVoter1)).save()
    newVoter2 = await (new User(sampleVoter2)).save()
    newVoter3 = await (new User(sampleVoter3)).save()
    newRule1 = await (new ReactionRule(sampleRule1)).save()
    newRule2 = await (new ReactionRule(sampleRule2)).save()
    sampleVote1User1Instance1 = fakeVote(newVoter1, 1)
    sampleVote2User2Instance1 = fakeVote(newVoter2, 1)
    sampleVote3User3Instance1 = fakeVote(newVoter3, 1)
    sampleVote4User1Instance2 = fakeVote(newVoter1, 1)
    sampleVote5User2Instance2 = fakeVote(newVoter2, 1)
    sampleVote6User3Instance2 = fakeVote(newVoter3, 6, true)
    sampleVote7User1Instance3 = fakeVote(newVoter1, 1, true)
    sampleVote8User2Instance3 = fakeVote(newVoter2, 1, true)
    newVote1User1Instance1 = await (new ReactionVote(sampleVote1User1Instance1)).save()
    newVote2User2Instance1 = await (new ReactionVote(sampleVote2User2Instance1)).save()
    newVote3User3Instance1 = await (new ReactionVote(sampleVote3User3Instance1)).save()
    newVote4User1Instance2 = await (new ReactionVote(sampleVote4User1Instance2)).save()
    newVote5User2Instance2 = await (new ReactionVote(sampleVote5User2Instance2)).save()
    newVote6User3Instance2 = await (new ReactionVote(sampleVote6User3Instance2)).save()
    newVote7User1Instance3 = await (new ReactionVote(sampleVote7User1Instance3)).save()
    newVote8User2Instance3 = await (new ReactionVote(sampleVote8User2Instance3)).save()
    sampleInstance1 = fakeReactionInstance(newRule1, [newVote1User1Instance1, newVote2User2Instance1, newVote3User3Instance1], idPost1)
    sampleInstance2 = fakeReactionInstance(newRule1, [newVote4User1Instance2, newVote5User2Instance2, newVote6User3Instance2], idPost1)
    sampleInstance3 = fakeReactionInstance(newRule2, [newVote7User1Instance3, newVote8User2Instance3], idPost2)
    newInstance1 = await (new ReactionInstance(sampleInstance1)).save()
    newInstance2 = await (new ReactionInstance(sampleInstance2)).save()
    newInstance3 = await (new ReactionInstance(sampleInstance3)).save()
  })

  describe('As Anonymous', () => {
    before(async () => {
      // Log In as aser
      agent = await chai.request.agent('http://localhost:3000')
    })
    it('should get csrfToken', async () => {
      await agent.get('/auth/csrf')
        .then((res) => {
          expect(res).to.have.status(OK)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('csrfToken')
          csrfToken = res.body.csrfToken
        })
        .catch((err) => {
          throw err
        })
    })
    it('POST /:idInstance/vote should NOT be able to vote.', async () => {
      await agent.post(`/api/v1.0/services/reactions/${newInstance1.id}/vote`)
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
        })
        .catch((err) => {
          expect(err).to.have.status(FORBIDDEN)
        })
    })
    describe('GET /posts/:id/results should get the results of the reaction instances of a post.', async () => {
      it('should have status OK', async () => {
        await agent.get(`/api/v1.0/services/reactions/posts/${idPost1}/results`)
          .then((res) => {
            expect(res).to.have.status(OK)
            response = res
          })
          .catch((err) => {
            throw err
          })
      })
      it('should have 2 reaction instances', async () => {
        expect(response.body).to.be.a('array')
        expect(response.body.length).to.be.equal(2)
      })
      it('should have all its property', async () => {
        (response.body).forEach((element) => {
          expect(element).to.have.property('title')
          expect(element).to.have.property('instruction')
          expect(element).to.have.property('reactionRule')
          expect(element).to.have.property('participants')
          expect(element).to.have.property('data')
        })
      })
      it('should not have the vote of a user', async () => {
        (response.body).forEach((element) => {
          expect(element).to.have.property('userVote')
          expect(element.userVote).to.be.null
        })
      })
    })
    describe('GET /:id/result should get the result of one reaction instance.', async () => {
      it('should have status OK', async () => {
        await agent.get(`/api/v1.0/services/reactions/${newInstance1.id}/result`)
          .then((res) => {
            expect(res).to.have.status(OK)
            response = res
          })
          .catch((err) => {
            throw err
          })
      })
      it('should have all its property', async () => {
        expect(response.body).to.have.property('title')
        expect(response.body).to.have.property('instruction')
        expect(response.body).to.have.property('reactionRule')
        expect(response.body).to.have.property('participants')
        expect(response.body).to.have.property('data')
      })
      it('should not have the vote of a user', async () => {
        expect(response.body).to.have.property('userVote')
        expect(response.body.userVote).to.be.null
      })
    })
  })

  describe('As Logged user (voter1, one who has already voted) ', async () => {
    before(async () => {
      // Log In as aser
      agent = await chai.request.agent('http://localhost:3000')
    })
    it('should get csrfToken', async () => {
      await agent.get('/auth/csrf')
        .then((res) => {
          expect(res).to.have.status(OK)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('csrfToken')
          csrfToken = res.body.csrfToken
        })
        .catch((err) => {
          throw err
        })
    })
    it('should log in', async () => {
      await agent.post('/auth/signin')
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ email: newVoter1.email })
        .then((res) => {
          expect(res).to.have.status(OK)
          expect(res).to.have.header('content-type', 'application/json; charset=utf-8')
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('success')
          expect(res.body.success).to.be.equal(true)
        })
        .catch((err) => {
          throw err
        })
    })
    it('the session should have a user object', async () => {
      await agent.get('/auth/session')
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .then((res) => {
          expect(res).to.have.status(OK)
          expect(res).to.have.header('content-type', 'application/json; charset=utf-8')
          expect(res.body).to.be.a('object')
          expect(res.body.user).to.be.a('object')
          expect(res.body.user).to.have.property('name')
        })
        .catch((err) => {
          throw err
        })
    })
    describe('GET /posts/:id/results should get the results of the reaction instances of a post.', async () => {
      it('should have status OK', async () => {
        await agent.get(`/api/v1.0/services/reactions/posts/${idPost1}/results`)
          .then((res) => {
            expect(res).to.have.status(OK)
            response = res
          })
          .catch((err) => {
            throw err
          })
      })
      it('should have 2 reaction instances', async () => {
        expect(response.body).to.be.a('array')
        expect(response.body.length).to.be.equal(2)
      })
      it('should have all its property', async () => {
        (response.body).forEach((element) => {
          expect(element).to.have.property('title')
          expect(element).to.have.property('instruction')
          expect(element).to.have.property('reactionRule')
          expect(element).to.have.property('participants')
          expect(element).to.have.property('data')
        })
      })
      it('should have the vote of the user', async () => {
        (response.body).forEach((element) => {
          expect(element).to.have.property('userVote')
          expect(element.userVote).to.not.be.null
          expect(element.userVote.userId.name).to.be.equal(newVoter1.name)
        })
      })
    })
    describe('GET /:id/result should get the result of one reaction instance.', async () => {
      it('should have status OK', async () => {
        await agent.get(`/api/v1.0/services/reactions/${newInstance1.id}/result`)
          .then((res) => {
            expect(res).to.have.status(OK)
            response = res
          })
          .catch((err) => {
            throw err
          })
      })
      it('should have all its property', async () => {
        expect(response.body).to.have.property('title')
        expect(response.body).to.have.property('instruction')
        expect(response.body).to.have.property('reactionRule')
        expect(response.body).to.have.property('participants')
        expect(response.body.participants.length).to.be.equal(3)
        expect(response.body).to.have.property('data')
      })
      it('should have the vote of a user', async () => {
        expect(response.body).to.have.property('userVote')
        expect(response.body.userVote).to.not.be.null
        expect(response.body.userVote.userId.name).to.be.equal(newVoter1.name)
        expect(response.body.userVote.meta.deleted).to.be.false
      })
    })
    describe('POST /:idInstance/vote should be able to DELETE its vote.', async () => {
      it('should have status OK', async () => {
        await agent.post(`/api/v1.0/services/reactions/${newInstance1.id}/vote`)
          .set('X-CSRF-TOKEN', csrfToken)
          .set('X-Requested-With', 'XMLHttpRequest')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .then((res) => {
            expect(res).to.have.status(OK)
            response = res
          })
          .catch((err) => {
            throw err
          })
      })
      it('should have all the properties of a vote', async () => {
        expect(response.body).to.be.a('object')
        expect(response.body).to.have.property('userId')
        expect(response.body).to.have.property('meta')
        expect(response.body.meta).to.have.property('timesVoted')
        expect(response.body.meta).to.have.property('deleted')
        expect(response.body.meta.deleted).to.be.true
        expect(response.body).to.have.property('createdAt')
        expect(response.body).to.have.property('updatedAt')
      })
      it('GET the just voted reaction instannce. Should have status OK', async () => {
        await agent.get(`/api/v1.0/services/reactions/${newInstance1.id}/result`)
          .then((res) => {
            expect(res).to.have.status(OK)
            response = res
          })
          .catch((err) => {
            throw err
          })
      })
      it('should have all its property', async () => {
        expect(response.body).to.have.property('title')
        expect(response.body).to.have.property('instruction')
        expect(response.body).to.have.property('reactionRule')
        expect(response.body).to.have.property('participants')
        expect(response.body).to.have.property('data')
        expect(response.body.data).to.have.property('value')
        expect(response.body.data.value).to.be.equal(2)
      })
      it('should have the vote of a user', async () => {
        expect(response.body).to.have.property('userVote')
        expect(response.body.userVote).to.not.be.null
        expect(response.body.userVote.userId.name).to.be.equal(newVoter1.name)
        expect(response.body.userVote.meta.deleted).to.be.true
      })
    })
  })

  describe('As Logged user (voter3, one who has already voted 5 times..) ', async () => {
    before(async () => {
      // Log In as aser
      agent = await chai.request.agent('http://localhost:3000')
    })
    it('should get csrfToken', async () => {
      await agent.get('/auth/csrf')
        .then((res) => {
          expect(res).to.have.status(OK)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('csrfToken')
          csrfToken = res.body.csrfToken
        })
        .catch((err) => {
          throw err
        })
    })
    it('should log in', async () => {
      await agent.post('/auth/signin')
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ email: newVoter3.email })
        .then((res) => {
          expect(res).to.have.status(OK)
          expect(res).to.have.header('content-type', 'application/json; charset=utf-8')
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('success')
          expect(res.body.success).to.be.equal(true)
        })
        .catch((err) => {
          throw err
        })
    })
    it('the session should have a user object', async () => {
      await agent.get('/auth/session')
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .then((res) => {
          expect(res).to.have.status(OK)
          expect(res).to.have.header('content-type', 'application/json; charset=utf-8')
          expect(res.body).to.be.a('object')
          expect(res.body.user).to.be.a('object')
          expect(res.body.user).to.have.property('name')
        })
        .catch((err) => {
          throw err
        })
    })
    describe('GET /posts/:id/results should get the results of the reaction instances of a post.', async () => {
      it('should have status OK', async () => {
        await agent.get(`/api/v1.0/services/reactions/posts/${idPost1}/results`)
          .then((res) => {
            expect(res).to.have.status(OK)
            response = res
          })
          .catch((err) => {
            throw err
          })
      })
      it('should have 2 reaction instances', async () => {
        expect(response.body).to.be.a('array')
        expect(response.body.length).to.be.equal(2)
      })
      it('should have all its property', async () => {
        (response.body).forEach((element) => {
          expect(element).to.have.property('title')
          expect(element).to.have.property('instruction')
          expect(element).to.have.property('reactionRule')
          expect(element).to.have.property('participants')
          expect(element).to.have.property('data')
        })
      })
      it('should have the vote of the user', async () => {
        (response.body).forEach((element) => {
          expect(element).to.have.property('userVote')
          expect(element.userVote).to.not.be.null
          expect(element.userVote.userId.name).to.be.equal(newVoter3.name)
        })
      })
    })
    describe('GET /:id/result should get the result of one reaction instance.', async () => {
      it('should have status OK', async () => {
        await agent.get(`/api/v1.0/services/reactions/${newInstance2.id}/result`)
          .then((res) => {
            expect(res).to.have.status(OK)
            response = res
          })
          .catch((err) => {
            throw err
          })
      })
      it('should have all its property', async () => {
        expect(response.body).to.have.property('title')
        expect(response.body).to.have.property('instruction')
        expect(response.body).to.have.property('reactionRule')
        expect(response.body).to.have.property('participants')
        expect(response.body.participants.length).to.be.equal(2)
        expect(response.body).to.have.property('data')
      })
      it('should have the vote of a user', async () => {
        expect(response.body).to.have.property('userVote')
        expect(response.body.userVote).to.not.be.null
        expect(response.body.userVote.userId.name).to.be.equal(newVoter3.name)
        expect(response.body.userVote.meta.deleted).to.be.true
      })
    })
    describe('POST /:idInstance/vote should be able to change its vote.', async () => {
      it('should have status FORBIDDEN (Limit of 5 votes reached)', async () => {
        await agent.post(`/api/v1.0/services/reactions/${newInstance2.id}/vote`)
          .set('X-CSRF-TOKEN', csrfToken)
          .set('X-Requested-With', 'XMLHttpRequest')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .then((res) => {
            expect(res).to.be.null
          })
          .catch((err) => {
            expect(err).to.have.status(FORBIDDEN)
          })
      })
      it('GET the just voted reaction instannce. Should have status OK', async () => {
        await agent.get(`/api/v1.0/services/reactions/${newInstance2.id}/result`)
          .then((res) => {
            expect(res).to.have.status(OK)
            response = res
          })
          .catch((err) => {
            throw err
          })
      })
      it('should have all its property', async () => {
        expect(response.body).to.have.property('title')
        expect(response.body).to.have.property('instruction')
        expect(response.body).to.have.property('reactionRule')
        expect(response.body).to.have.property('participants')
        expect(response.body).to.have.property('data')
      })
      it('should have the vote of a user', async () => {
        expect(response.body).to.have.property('userVote')
        expect(response.body.userVote).to.not.be.null
        expect(response.body.userVote.userId.name).to.be.equal(newVoter3.name)
        expect(response.body.userVote.meta.deleted).to.be.true
      })
    })
  })

  describe('As Logged user (voter3, who hasnt voted in instance3..) ', async () => {
    before(async () => {
      // Log In as aser
      agent = await chai.request.agent('http://localhost:3000')
    })
    it('should get csrfToken', async () => {
      await agent.get('/auth/csrf')
        .then((res) => {
          expect(res).to.have.status(OK)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('csrfToken')
          csrfToken = res.body.csrfToken
        })
        .catch((err) => {
          throw err
        })
    })
    it('should log in', async () => {
      await agent.post('/auth/signin')
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ email: newVoter3.email })
        .then((res) => {
          expect(res).to.have.status(OK)
          expect(res).to.have.header('content-type', 'application/json; charset=utf-8')
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('success')
          expect(res.body.success).to.be.equal(true)
        })
        .catch((err) => {
          throw err
        })
    })
    it('the session should have a user object', async () => {
      await agent.get('/auth/session')
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .then((res) => {
          expect(res).to.have.status(OK)
          expect(res).to.have.header('content-type', 'application/json; charset=utf-8')
          expect(res.body).to.be.a('object')
          expect(res.body.user).to.be.a('object')
          expect(res.body.user).to.have.property('name')
        })
        .catch((err) => {
          throw err
        })
    })
    describe('GET /posts/:id/results should get the results of the reaction instances of post two.', async () => {
      it('should have status OK', async () => {
        await agent.get(`/api/v1.0/services/reactions/posts/${idPost2}/results`)
          .then((res) => {
            expect(res).to.have.status(OK)
            response = res
          })
          .catch((err) => {
            throw err
          })
      })
      it('should have 1 reaction instances', async () => {
        expect(response.body).to.be.a('array')
        expect(response.body.length).to.be.equal(1)
      })
      it('should have all its property', async () => {
        (response.body).forEach((element) => {
          expect(element).to.have.property('title')
          expect(element).to.have.property('instruction')
          expect(element).to.have.property('reactionRule')
          expect(element).to.have.property('participants')
          expect(element).to.have.property('data')
        })
      })
      it('should have the vote of the user', async () => {
        (response.body).forEach((element) => {
          expect(element).to.not.have.property('userVote')
        })
      })
    })
    describe('GET /:id/result should get the result of one reaction instance.', async () => {
      it('should have status OK', async () => {
        await agent.get(`/api/v1.0/services/reactions/${newInstance3.id}/result`)
          .then((res) => {
            expect(res).to.have.status(OK)
            response = res
          })
          .catch((err) => {
            throw err
          })
      })
      it('should have all its property', async () => {
        expect(response.body).to.have.property('title')
        expect(response.body).to.have.property('instruction')
        expect(response.body).to.have.property('reactionRule')
        expect(response.body).to.have.property('participants')
        expect(response.body.participants.length).to.be.equal(0)
        expect(response.body).to.have.property('data')
      })
      it('should have the vote of a user', async () => {
        expect(response.body).to.not.have.property('userVote')
      })
    })
    describe('POST /:idInstance/vote shoulnt be able to change its vote.', async () => {
      it('should have status FORBIDDEN (Vote has closed - Closing date very old!)', async () => {
        await agent.post(`/api/v1.0/services/reactions/${newInstance3.id}/vote`)
          .set('X-CSRF-TOKEN', csrfToken)
          .set('X-Requested-With', 'XMLHttpRequest')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .then((res) => {
            expect(res).to.be.null
          })
          .catch((err) => {
            expect(err).to.have.status(FORBIDDEN)
          })
      })
      it('GET the just voted reaction instance. Should have status OK', async () => {
        await agent.get(`/api/v1.0/services/reactions/${newInstance3.id}/result`)
          .then((res) => {
            expect(res).to.have.status(OK)
            response = res
          })
          .catch((err) => {
            throw err
          })
      })
      it('should have all its property', async () => {
        expect(response.body).to.have.property('title')
        expect(response.body).to.have.property('instruction')
        expect(response.body).to.have.property('reactionRule')
        expect(response.body).to.have.property('participants')
        expect(response.body).to.have.property('data')
      })
      it('should have the vote of a user', async () => {
        expect(response.body).to.not.have.property('userVote')
      })
    })
  })

  //   })
  //   describe('As an admin user', () => {
  //     before(async () => {
  //       // Log In as aser
  //       agent = await chai.request.agent('http://localhost:3000')
  //     })
  //     it('should get csrfToken', async () => {
  //       await agent.get('/auth/csrf')
  //         .then((res) => {
  //           expect(res).to.have.status(OK)
  //           expect(res.body).to.be.a('object')
  //           expect(res.body).to.have.property('csrfToken')
  //           csrfToken = res.body.csrfToken
  //         })
  //         .catch((err) => {
  //           throw err
  //         })
  //     })
  //     it('should log in', async () => {
  //       await agent.post('/auth/signin')
  //         .set('X-CSRF-TOKEN', csrfToken)
  //         .set('X-Requested-With', 'XMLHttpRequest')
  //         .set('Content-Type', 'application/x-www-form-urlencoded')
  //         .send({ email: newAdmin.email })
  //         .then((res) => {
  //           expect(res).to.have.status(OK)
  //           expect(res).to.have.header('content-type', 'application/json; charset=utf-8')
  //           expect(res.body).to.be.a('object')
  //           expect(res.body).to.have.property('success')
  //           expect(res.body.success).to.be.equal(true)
  //         })
  //         .catch((err) => {
  //           throw err
  //         })
  //     })
  //     it('the session should have a user object', async () => {
  //       await agent.get('/auth/session')
  //         .set('X-CSRF-TOKEN', csrfToken)
  //         .set('X-Requested-With', 'XMLHttpRequest')
  //         .set('Content-Type', 'application/x-www-form-urlencoded')
  //         .then((res) => {
  //           expect(res).to.have.status(OK)
  //           expect(res).to.have.header('content-type', 'application/json; charset=utf-8')
  //           expect(res.body).to.be.a('object')
  //           expect(res.body.user).to.be.a('object')
  //           expect(res.body.user).to.have.property('name')
  //         })
  //         .catch((err) => {
  //           throw err
  //         })
  //     })

  //   })
})
