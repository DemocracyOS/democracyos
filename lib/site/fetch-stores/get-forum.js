import forumStore from 'lib/stores/forum-store/forum-store'

export default function (nextState, replace) {
  forumStore
    .findOneByName(nextState.params.forumName)
    .then(function (forum) {
      nextState.forum = forum
    })
}
