const faker = require('faker')
const { Types: { ObjectId } } = require('mongoose')

const fakeUser = (role) => {
  let user = {
    username: faker.internet.userName(),
    name: faker.name.findName(),
    bio: faker.lorem.paragraph(),
    email: faker.internet.email(),
    emailToken: faker.internet.ipv6(),
    role: role === 'admin' ? 'admin' : 'user',
    emailVerified: true,
    firstLogin: true,
    facebook: null,
    google: null,
    twitter: null,
    linkedin: null,
    instagram: null
  }
  return user
}

const fakeSetting = (role) => {
  let setting = {
    communityName: faker.address.city(),
    mainColor: faker.internet.color()
    // permissions: role === 'admin' ? 'admin' : 'user'
    // logo: faker.image.avatar(),
  }
  return setting
}

const fakePost = (author) => {
  let post = {
    title: faker.lorem.sentence(),
    description: faker.lorem.sentence(12),
    content: faker.lorem.paragraphs(6),
    author: author.id,
    openingDate: faker.date.recent(),
    closingDate: faker.date.future()
  }
  return post
}

const fakeVote = (author, timesVoted, deleted) => {
  let vote = {
    userId: author.id,
    meta: {
      timesVoted: timesVoted || 0,
      deleted: deleted || false
    }
  }
  return vote
}

const fakeReactionRule = (method, limit, startingDate, closingDate) => {
  let rule = {
    name: faker.lorem.sentence(3),
    limit: limit || 5,
    startingDate: startingDate || faker.date.recent(),
    closingDate: closingDate || null
  }
  switch (method) {
    case 'LIKE':
      rule['method'] = 'LIKE'
      break
    default:
      rule['method'] = 'LIKE'
      break
  }
  return rule
}

const fakeReactionInstance = (rule, voters) => {
  let instance = {
    title: faker.lorem.sentence(6) + '?',
    instruction: faker.lorem.sentence(24),
    reactionId: rule.id,
    resourceType: 'Article',
    resourceId: faker.finance.account().toString() + faker.finance.account().toString() + faker.finance.account().toString(),
    results: voters.map((el) => {
      return el.id
    })
  }
  return instance
}

module.exports = {
  fakeUser,
  fakeSetting,
  fakePost,
  fakeVote,
  fakeReactionRule,
  fakeReactionInstance
}
