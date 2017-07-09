const html = require('es6-string-html-template').html
const raw = require('es6-string-html-template').raw

const styles = raw(`
  <style>
    p { margin: 0; }
  </style>
`)

module.exports = ({
  userName,
  validateUrl
}) => html`
  ${styles}
  <p>Hola, ${userName}</p>
  <p>Hemos recibido tu solicitud para sumarte al portal de participación de la Municipalidad de Rosario.</p>
  <p>Para completar tu registro hacé <a href="${raw(validateUrl)}">click acá</a>.</p>
  <br />
  <p>Secretaría General - Municipalidad de Rosario</p>
  <br />
  <p>PD: si este registro no es tuyo, por favor, ignorá este correo electrónico.</p>
`.toString()
