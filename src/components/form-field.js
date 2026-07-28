// ============================================================
// FORM FIELD COMPONENT — Reusable form inputs with validation
// ============================================================

export function createFormField(config) {
  const {
    type = 'text',
    name,
    label,
    placeholder = '',
    required = false,
    errorMessage = '',
    options = [],    // for select or radio
    value = '',
  } = config;

  const field = document.createElement('div');
  field.className = 'form-field';
  field.dataset.fieldName = name;

  const requiredMark = required ? ' <span class="required">*</span>' : '';
  const labelHtml = `<label class="form-field__label" for="field-${name}">${label}${requiredMark}</label>`;

  let inputHtml = '';

  switch (type) {
    case 'text':
    case 'email':
      inputHtml = `
        ${labelHtml}
        <input type="${type}" id="field-${name}" name="${name}" class="form-field__input"
               placeholder="${placeholder}" ${required ? 'required' : ''} value="${value}">
        <span class="form-field__error">${errorMessage || `Please enter your ${label.toLowerCase().replace(' *', '')}.`}</span>
      `;
      break;

    case 'tel':
      inputHtml = `
        ${labelHtml}
        <div class="phone-input-group">
          <div class="country-code">
            <span style="font-size: 12px;">▼</span>
            <span>+84</span>
          </div>
          <input type="tel" id="field-${name}" name="${name}" class="form-field__input"
                 placeholder="${placeholder}" ${required ? 'required' : ''}>
        </div>
        <span class="form-field__error">${errorMessage || 'Please enter a valid phone number.'}</span>
      `;
      break;

    case 'select':
      const optionsHtml = options.map(opt =>
        `<option value="${opt.value || opt}">${opt.label || opt}</option>`
      ).join('');
      inputHtml = `
        ${labelHtml}
        <select id="field-${name}" name="${name}" class="form-field__select" ${required ? 'required' : ''}>
          <option value="">${placeholder || 'Select an option'}</option>
          ${optionsHtml}
        </select>
        <span class="form-field__error">${errorMessage || 'This field is mandatory'}</span>
      `;
      break;

    case 'radio':
      const radiosHtml = options.map((opt, idx) => `
        <label class="radio-option">
          <input type="radio" name="${name}" value="${opt.value || opt}" ${idx === 0 ? 'checked' : ''}>
          <span>${opt.label || opt}</span>
        </label>
      `).join('');
      inputHtml = `
        ${labelHtml}
        <div class="form-field__radios">
          ${radiosHtml}
        </div>
      `;
      break;

    case 'textarea':
      inputHtml = `
        ${labelHtml}
        <textarea id="field-${name}" name="${name}" class="form-field__textarea"
                  placeholder="${placeholder}" ${required ? 'required' : ''}></textarea>
        <span class="form-field__error">${errorMessage || `Please enter your ${label.toLowerCase().replace(' *', '')}.`}</span>
      `;
      break;
  }

  field.innerHTML = inputHtml;

  // Validation on blur
  const input = field.querySelector('input, select, textarea');
  if (input && required) {
    input.addEventListener('blur', () => {
      validateField(field);
    });

    input.addEventListener('input', () => {
      if (field.classList.contains('form-field--error')) {
        validateField(field);
      }
    });
  }

  return field;
}

export function validateField(field) {
  const input = field.querySelector('input, select, textarea');
  if (!input) return true;

  const isRequired = input.hasAttribute('required');
  if (!isRequired) return true;

  const value = input.value.trim();
  let isValid = value.length > 0;

  // Email validation
  if (input.type === 'email' && value.length > 0) {
    isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  if (isValid) {
    field.classList.remove('form-field--error');
  } else {
    field.classList.add('form-field--error');
  }

  return isValid;
}

export function validateForm(formContainer) {
  const fields = formContainer.querySelectorAll('.form-field');
  let allValid = true;

  fields.forEach(field => {
    const input = field.querySelector('input, select, textarea');
    if (input && input.hasAttribute('required')) {
      if (!validateField(field)) {
        allValid = false;
      }
    }
  });

  return allValid;
}
