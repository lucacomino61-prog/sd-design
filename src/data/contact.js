// Contact details for SD Design. The values are in owner.json (under "contact"): see owner.js. The site never invents
// them: while one is null, nothing is shown in its place.
//   whatsapp      international format without + or spaces, e.g. '3556XXXXXXXX'
//   phone         as it should be read, e.g. '+355 6X XXX XXXX'
//   instagram     the account name, without @
//   email
//   formEndpoint  where the form sends a message, if there is an inbox service (Formspree, Web3Forms, your own
//                 endpoint): it receives JSON with name, phone, message, page and lang. While this is null the form
//                 opens WhatsApp with the message written, so it works with nothing but the WhatsApp number.
//   formFields    extra fields some services ask for, e.g. { "access_key": "..." } for Web3Forms
import { owner } from './owner.js';

export const CONTACT = { whatsapp: null, phone: null, instagram: null, email: null, formEndpoint: null, formFields: {}, ...owner.contact };
