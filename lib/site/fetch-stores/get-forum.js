import forumStore from 'lib/stores/forum-store/forum-store'

export default function (nextState, replace) {
  forumStore
    .findOneByName(nextState.params.forumName)
    .then(function (forum) {
      if (!forum) console.log('forum 404')
    })
    .catch(function (err) {
      console.log('forum error', err)
    })
}
