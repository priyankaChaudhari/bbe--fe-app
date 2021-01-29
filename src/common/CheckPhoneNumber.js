/* eslint-disable no-plusplus */
import $ from 'jquery';

export default function CheckPhoneNumber({ name }) {
  $(`#${name}`).on('keypress', (e) => {
    if (e.code.includes('Key')) {
      e.preventDefault();
    }
    if (
      (e.shiftKey && e.code.includes('Digit')) ||
      (e.shiftKey && e.code === 'Minus') ||
      (!e.shiftKey && e.code === 'Equal') ||
      e.code.includes('Bracket') ||
      e.code.includes('Back') ||
      e.code.includes('Slash') ||
      e.code.includes('Comma') ||
      e.code.includes('Semicolon') ||
      e.code.includes('Period') ||
      e.code.includes('Quote')
    ) {
      e.preventDefault();
    }
  });
  return '';
}
