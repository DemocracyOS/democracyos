import t from 't-component';
import o from 'component-dom';
import page from 'page';
import title from '../title/title.js';
import request from '../request/request.js';
import citizen from '../citizen/citizen.js';
import ForgotView from './forgot-view.js';
import ResetView from './reset-view.js';

page('/forgot', citizen.optional, (ctx, next) => {
  // If citizen is logged in
  // redirect to `/`
  if (ctx.citizen.id) return page('/');

  // Build form view with options
  let form = new ForgotView();

  // Update page's title
  title(t('forgot.question'));

  // Empty container and render form
  form.replace(o('#content'));
});

page('/forgot/reset/:token', (ctx, next) => {
  // Build form view with options
  let token = ctx.params.token;
  let form = ResetView(token);

  // Update page's title
  title(t('forgot.reset'));

  request
    .post('/forgot/verify')
    .send({ token: token })
    .end((err, res) => {
      form.replace(o('#content'));
      if (err || (res.body && res.body.error)) {
        return form.errors([err || res.body.error]);
      }
      if (!res.ok) {
        return form.errors([res.error]);
      }
    });
});
