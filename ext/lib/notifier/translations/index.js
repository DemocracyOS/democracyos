const translations = require('democracyos-notifier/lib/translations')

const t = translations.t

const overrides = {
  'templates.email.greeting': 'Hola, {userName}',
  'templates.email.signature': 'Secretaría General - Municipalidad de Rosario',

  'templates.forgot-password.subject': 'Reestablecer contraseña',
  'templates.forgot-password.body': 'Por favor <a href="{resetPasswordUrl}">cliquea aquí</a> para reestablecer tu contraseña',
  'templates.forgot-password.ps': 'P.D.: si no solicitaste reestablecer tu contraseña, por favor ignora este correo',

  'templates.comment-reply.subject': 'Alguien respondió a tu comentario',

  'templates.topic-published.subject': 'Nuevo tema publicado',
  'templates.topic-published.body': 'Un nuevo tema fue publicado:',
  'templates.topic-published.body2': 'Por favor <a href="{url}">cliquea aquí</a> para verlo.'
}

Object.assign(t.es, overrides)
Object.assign(t.en, overrides)
