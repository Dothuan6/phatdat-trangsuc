// ============================================================
// CONTACT PAGE — Email Us form
// ============================================================

import { createFormField, validateForm } from '../components/form-field.js';
import { t } from '../i18n.js';

export function renderContact(container) {
  const page = document.createElement('div');
  page.className = 'page-contact';

  // ── Hero Section ──
  const hero = document.createElement('section');
  hero.className = 'contact-hero';
  hero.innerHTML = `
    <div class="container">
      <h1 class="contact-hero__title">${t('contact.emailUs')}</h1>
      <p class="contact-hero__desc">${t('contact.heroDesc')}</p>
    </div>
  `;
  page.appendChild(hero);

  // ── Note Bar ──
  const note = document.createElement('div');
  note.className = 'contact-note';
  note.innerHTML = `
    <div class="container">
      <p>${t('contact.note')}</p>
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
  formHeading.textContent = t('common.contactTitle');
  formContainer.appendChild(formHeading);

  // Form element
  const form = document.createElement('form');
  form.id = 'contact-form';
  form.setAttribute('novalidate', '');

  // Subject field
  form.appendChild(createFormField({
    type: 'select',
    name: 'subject',
    label: t('contact.form.subject'),
    placeholder: t('contact.form.selectSubject'),
    required: true,
    errorMessage: t('contact.form.mandatoryField'),
    options: [
      { value: 'general', label: t('contact.form.generalEnquiry') },
      { value: 'product', label: t('contact.form.productInfo') },
      { value: 'order', label: t('contact.form.orderEnquiry') },
      { value: 'boutique', label: t('contact.form.boutiqueInfo') },
      { value: 'other', label: t('contact.form.other') },
    ],
  }));

  // Title (radio)
  form.appendChild(createFormField({
    type: 'radio',
    name: 'title',
    label: t('contact.form.title'),
    required: true,
    options: [
      { value: 'mr', label: t('contact.form.mr') },
      { value: 'mrs', label: t('contact.form.mrs') },
      { value: 'ms', label: t('contact.form.ms') },
    ],
  }));

  // First name
  form.appendChild(createFormField({
    type: 'text',
    name: 'firstName',
    label: t('contact.form.firstName'),
    placeholder: t('contact.form.firstNamePlace'),
    required: true,
    errorMessage: t('contact.form.firstNameErr'),
  }));

  // Last name
  form.appendChild(createFormField({
    type: 'text',
    name: 'lastName',
    label: t('contact.form.lastName'),
    placeholder: t('contact.form.lastNamePlace'),
    required: true,
    errorMessage: t('contact.form.lastNameErr'),
  }));

  // Email
  form.appendChild(createFormField({
    type: 'email',
    name: 'email',
    label: t('contact.form.email'),
    placeholder: t('contact.form.emailPlace'),
    required: true,
    errorMessage: t('contact.form.emailErr'),
  }));

  // Phone
  form.appendChild(createFormField({
    type: 'tel',
    name: 'phone',
    label: t('contact.form.phone'),
    placeholder: '',
    required: false,
  }));

  // Message
  form.appendChild(createFormField({
    type: 'textarea',
    name: 'message',
    label: t('contact.form.message'),
    placeholder: t('contact.form.messagePlace'),
    required: true,
    errorMessage: t('contact.form.messageErr'),
  }));

  // Newsletter checkbox
  const checkboxWrapper = document.createElement('div');
  checkboxWrapper.innerHTML = `
    <label class="form-checkbox">
      <input type="checkbox" name="newsletter" id="newsletter-checkbox">
      <span>${t('contact.form.newsletter')}</span>
    </label>
  `;
  form.appendChild(checkboxWrapper);

  // Submit button
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'btn btn--full';
  submitBtn.textContent = t('common.contactTitle').toUpperCase();
  submitBtn.id = 'submit-contact-form';
  form.appendChild(submitBtn);

  // Legal text
  const legal = document.createElement('div');
  legal.className = 'contact-form__legal';
  legal.innerHTML = `
    <p>${t('contact.form.legal')}</p>
  `;
  form.appendChild(legal);

  // Mandatory note
  const mandatory = document.createElement('p');
  mandatory.className = 'contact-form__mandatory';
  mandatory.textContent = t('contact.form.mandatoryFields');
  form.appendChild(mandatory);

  // Form submit handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const isValid = validateForm(form);
    if (isValid) {
      // Show success feedback
      submitBtn.textContent = t('contact.form.messageSent');
      submitBtn.style.backgroundColor = '#2B2B2B';
      submitBtn.style.color = '#FFFFFF';
      submitBtn.disabled = true;
      setTimeout(() => {
        submitBtn.textContent = t('common.contactTitle').toUpperCase();
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
