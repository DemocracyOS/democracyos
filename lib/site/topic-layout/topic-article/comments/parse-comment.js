import marked from 'marked'

const renderer = new marked.Renderer()

renderer.heading = function (text, level) {
  return `<h${level}>${text}</h${level}>`
}

export default function parseComment (comment) {
  return new Promise((resolve, reject) => {
    marked(comment.text, {
      sanitize: true,
      smartypants: true,
      renderer
    }, function (err, textHtml) {
      if (err) return reject(err)
      comment.textHtml = textHtml
      resolve(comment)
    })
  })
}
