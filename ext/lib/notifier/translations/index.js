const translations = require('democracyos-notifier/lib/translations')

const t = translations.t

const overrides = {
  "templates.email.greeting": "Estimado/a, USER_NAME",
  "templates.email.signature": "Secretaría General - Municipalidad de Rosario",

  "templates.welcome-email.subject": "Bienvenido al portal de participación de la ciudad de Rosario",
  "templates.welcome-email.body": "Para completar su registro haga <a href=\"VALIDATE_MAIL_URL\">click aquí.</a>",
  "templates.welcome-email.ps": "Si no ha sido usted quien se registró, por favor ignore este correo electrónico.",

  "templates.reset-password.subject": "Reestablecer contraseña",
  "templates.reset-password.body": "Por favor <a href=\"RESET_PASSWORD_URL\">cliquea aquí</a> para reestablecer tu contraseña",
  "templates.reset-password.ps": "P.D.: si no solicitaste reestablecer tu contraseña, por favor ignora este correo",

  "templates.comment-reply.subject": "Alguien respondió a tu argumento",
  "templates.comment-reply.body": "Tienes una nueva respuesta a tu argumento.",
  "templates.comment-reply.body2": "Por favor <a href=\"URL\">cliquea aquí</a> para verla.",

  "templates.topic-published.subject": "Nuevo tema publicado",
  "templates.topic-published.body": "Un nuevo tema fue publicado:",
  "templates.topic-published.body2": "Por favor <a href=\"URL\">cliquea aquí</a> para verlo."
}

Object.assign(t.es, overrides)
Object.assign(t.en, overrides)
