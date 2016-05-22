// TODO: Make a separate module
// Based on https://github.com/segmentio/submit-form
export default function submit(form) {
  const button = document.createElement('button');
  button.style.display = 'none';

  let e = document.createEvent('MouseEvent');
  e.initMouseEvent('click', true, true, window,
    1, 0, 0, 0, 0, false, false, false, false, 0, null);

  form.appendChild(button);
  if (button.dispatchEvent) {
    button.dispatchEvent(e);
  } else {
    button.fireEvent('onclick', e);
  }

  form.removeChild(button);
}
