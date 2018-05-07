const faker = require('faker')

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
    mainColor: faker.internet.color(),
    // permissions: role === 'admin' ? 'admin' : 'user'
    // logo: faker.image.avatar(),
  }
  return setting
}

module.exports = {
  fakeUser,
  fakeSetting
}
