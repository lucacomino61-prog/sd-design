// Contact details for SD Design. Fill these in before launch; the site never invents them.
// whatsapp: international format without + or spaces, e.g. '3556XXXXXXXX'.
export const CONTACT = {
  whatsapp: null,
  phone: null,
  instagram: null,
  email: null,
  // Where the form sends a message, if there is an inbox service (Formspree, Web3Forms, your own endpoint): it
  // receives JSON with name, phone, message, page and lang. While this is null the form opens WhatsApp with the
  // message written, so it works with nothing but the WhatsApp number.
  formEndpoint: null,
  // Extra fields some services ask for, e.g. { access_key: '...' } for Web3Forms.
  formFields: {},
};
