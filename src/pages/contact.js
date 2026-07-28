// ============================================================
// CONTACT PAGE — Email Us form
// ============================================================

import { createFormField, validateForm } from '../components/form-field.js';

export function renderContact(container) {
  const page = document.createElement('div');
  page.className = 'page-contact';

  // ── Hero Section ──
  const hero = document.createElement('section');
  hero.className = 'contact-hero';
  hero.innerHTML = `
    <div class="container">
      <h1 class="contact-hero__title">EMAIL US</h1>
      <p class="contact-hero__desc">We invite you to write to us with any question you may have. Our client advisors would be delighted to assist you with your enquiry.</p>
    </div>
  `;
  page.appendChild(hero);

  // ── Note Bar ──
  const note = document.createElement('div');
  note.className = 'contact-note';
  note.innerHTML = `
    <div class="container">
      <p>Kindly note, our client advisors are also at your disposal <a href="#" id="by-phone-link">by phone</a></p>
    </div>
  `;
  page.appendChild(note);

  // ── Form Section ──
  const formSection = document.createElement('section');
  formSection.className = 'contact-form-section';

  const formContainer = document.createElement('div');
  formContainer.className = 'contact-form container';

  const formHeading = document.createElement('h2');
  formHeading.className = 'contact-form__heading';
  formHeading.textContent = 'SEND A MESSAGE';
  formContainer.appendChild(formHeading);

  // Form element
  const form = document.createElement('form');
  form.id = 'contact-form';
  form.setAttribute('novalidate', '');

  // Subject field
  form.appendChild(createFormField({
    type: 'select',
    name: 'subject',
    label: 'Subject',
    placeholder: 'Select a subject',
    required: true,
    errorMessage: 'This field is mandatory',
    options: [
      { value: 'general', label: 'General enquiry' },
      { value: 'product', label: 'Product information' },
      { value: 'order', label: 'Order enquiry' },
      { value: 'boutique', label: 'Boutique information' },
      { value: 'other', label: 'Other' },
    ],
  }));

  // Title (radio)
  form.appendChild(createFormField({
    type: 'radio',
    name: 'title',
    label: 'Title',
    required: true,
    options: [
      { value: 'mr', label: 'Mr.' },
      { value: 'mrs', label: 'Mrs.' },
      { value: 'ms', label: 'Ms.' },
    ],
  }));

  // First name
  form.appendChild(createFormField({
    type: 'text',
    name: 'firstName',
    label: 'First name',
    placeholder: 'Your first name',
    required: true,
    errorMessage: 'Please enter your first name.',
  }));

  // Last name
  form.appendChild(createFormField({
    type: 'text',
    name: 'lastName',
    label: 'Last name',
    placeholder: 'Your last name',
    required: true,
    errorMessage: 'Please enter your last name.',
  }));

  // Email
  form.appendChild(createFormField({
    type: 'email',
    name: 'email',
    label: 'Email',
    placeholder: 'Your email address',
    required: true,
    errorMessage: 'Please enter a valid email address.',
  }));

  // Phone
  form.appendChild(createFormField({
    type: 'tel',
    name: 'phone',
    label: 'Contact phone',
    placeholder: '',
    required: false,
  }));

  // Message
  form.appendChild(createFormField({
    type: 'textarea',
    name: 'message',
    label: 'Your message',
    placeholder: 'Enter your message here',
    required: true,
    errorMessage: 'Please enter your message.',
  }));

  // Newsletter checkbox
  const checkboxWrapper = document.createElement('div');
  checkboxWrapper.innerHTML = `
    <label class="form-checkbox">
      <input type="checkbox" name="newsletter" id="newsletter-checkbox">
      <span>I would like to receive the newsletter and agree to be contacted using any of the contact details I have provided. I may ask to unsubscribe at any time. Further information is available in the Maison Privacy Policy.</span>
    </label>
  `;
  form.appendChild(checkboxWrapper);

  // Submit button
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'btn btn--full';
  submitBtn.textContent = 'SEND A MESSAGE';
  submitBtn.id = 'submit-contact-form';
  form.appendChild(submitBtn);

  // Legal text
  const legal = document.createElement('div');
  legal.className = 'contact-form__legal';
  legal.innerHTML = `
    <p>By clicking on « Send a Message », I acknowledge that I have read and accepted the <a href="#">Phat Dat Jewelry Privacy Policy</a>.</p>
  `;
  form.appendChild(legal);

  // Mandatory note
  const mandatory = document.createElement('p');
  mandatory.className = 'contact-form__mandatory';
  mandatory.textContent = '* Mandatory Fields';
  form.appendChild(mandatory);

  // Form submit handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const isValid = validateForm(form);
    if (isValid) {
      // Show success feedback
      submitBtn.textContent = 'MESSAGE SENT ✓';
      submitBtn.style.backgroundColor = '#2B2B2B';
      submitBtn.style.color = '#FFFFFF';
      submitBtn.disabled = true;
      setTimeout(() => {
        submitBtn.textContent = 'SEND A MESSAGE';
        submitBtn.style.backgroundColor = '';
        submitBtn.style.color = '';
        submitBtn.disabled = false;
        form.reset();
      }, 3000);
    }
  });

  formContainer.appendChild(form);
  formSection.appendChild(formContainer);
  page.appendChild(formSection);

  container.appendChild(page);

  // By phone link opens contact drawer
  const byPhoneLink = page.querySelector('#by-phone-link');
  if (byPhoneLink) {
    byPhoneLink.addEventListener('click', (e) => {
      e.preventDefault();
      document.dispatchEvent(new CustomEvent('toggle-contact-drawer'));
    });
  }
}
