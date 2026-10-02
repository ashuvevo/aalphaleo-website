(function () {
  document.querySelectorAll('.contact-form').forEach(form => {
    const successEl = form.querySelector('.form-success');
    const errorEl = form.querySelector('.form-error');
    const submitErrorEl = form.querySelector('.form-submit-error');
    const endpoint = form.dataset.formEndpoint;

    form.addEventListener('submit', async event => {
      event.preventDefault();
      successEl?.classList.add('hidden');
      errorEl?.classList.add('hidden');
      submitErrorEl?.classList.add('hidden');

      if (form.querySelector('[name="_honeypot"]')?.value) return;

      const nameField = form.querySelector('[name="name"]');
      const emailField = form.querySelector('[name="email"]');
      const messageField = form.querySelector('[name="message"]');
      const phoneField = form.querySelector('[name="phone"]');
      const serviceField = form.querySelector('[name="service"]');

      const requiredFields = [nameField, emailField, messageField];
      const invalidField = requiredFields.find(field =>
        field && (!field.value.trim() || (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value))),
      );

      requiredFields.forEach(field => {
        if (!field) return;
        const invalid = field === invalidField;
        field.classList.toggle('border-red-400', invalid);
        field.setAttribute('aria-invalid', String(invalid));
      });

      if (invalidField) {
        errorEl?.classList.remove('hidden');
        invalidField.focus();
        return;
      }

      if (!endpoint) {
        submitErrorEl?.classList.remove('hidden');
        return;
      }

      const submitBtn = form.querySelector('[type="submit"]');
      const defaultLabel = submitBtn?.textContent || 'Send Message';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      const payload = new FormData();
      payload.append('name', nameField.value.trim());
      payload.append('email', emailField.value.trim());
      payload.append('phone', phoneField?.value.trim() || '');
      payload.append('service', serviceField?.value.trim() || '');
      payload.append('message', messageField.value.trim());
      payload.append('_honeypot', form.querySelector('[name="_honeypot"]')?.value || '');

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          body: payload,
          headers: {
            Accept: 'application/json',
          },
        });

        let result = {};
        try {
          result = await response.json();
        } catch (_) {
          throw new Error('Invalid server response');
        }

        if (!response.ok || !result.success) {
          if (submitErrorEl && result.message) {
            submitErrorEl.textContent = result.message;
          }
          throw new Error(result.message || 'Submission failed');
        }

        form.reset();
        successEl?.classList.remove('hidden');
      } catch (_) {
        submitErrorEl?.classList.remove('hidden');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = defaultLabel;
        }
      }
    });
  });
})();
