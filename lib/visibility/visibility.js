import citizen from '../citizen/citizen.js';
import config from '../config/config.js';
import page from 'page';

let hidden = config.visibility == 'hidden';

export default function (ctx, next) {
  if (!hidden) return next();
  if (citizen.logged()) return next();

  page('/signin');
}
