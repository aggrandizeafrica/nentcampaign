(function () {
  var cfg = window.NENT_CONFIG || {};
  var form = document.getElementById('booking-form');
  var errorBox = document.getElementById('form-error');
  var success = document.getElementById('form-success');
  var successTitle = document.getElementById('success-title');
  var successBody = document.getElementById('success-body');
  var submitBtn = form.querySelector('button[type="submit"]');

  document.getElementById('year').textContent = new Date().getFullYear();

  // Don't allow booking dates in the past.
  var dateInput = form.elements.date;
  dateInput.min = new Date().toISOString().slice(0, 10);

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.hidden = false;
  }

  function clearError() {
    errorBox.hidden = true;
    form.elements.name.removeAttribute('aria-invalid');
    form.elements.phone.removeAttribute('aria-invalid');
  }

  form.addEventListener('input', clearError);

  function collect() {
    var f = form.elements;
    return {
      who: f.who.value,
      name: f.name.value.trim(),
      phone: f.phone.value.trim(),
      email: f.email.value.trim(),
      clinic: f.clinic.value,
      concern: f.concern.value,
      date: f.date.value,
      slot: f.slot.value,
      notes: f.notes.value.trim(),
      campaign: 'Holiday Speech Therapy',
      submitted_at: new Date().toISOString()
    };
  }

  function el(tag, text) {
    var n = document.createElement(tag);
    if (text) n.textContent = text;
    return n;
  }

  function showSuccess(data) {
    var first = data.name.split(/\s+/)[0] || 'there';
    successTitle.textContent = 'Request received, ' + first + '.';
    successBody.textContent = 'We will call ' + data.phone + ' to confirm your ' +
      data.slot.toLowerCase() + ' session at ' + data.clinic + '.';

    var old = document.getElementById('wa-link');
    if (old) old.remove();
    if (cfg.whatsappNumber) {
      var msg = 'Hello Nairobi ENT Clinic, I would like to book a holiday speech therapy session.\n' +
        'Name: ' + data.name + '\nPhone: ' + data.phone + '\nFor: ' + data.who +
        '\nConcern: ' + data.concern + '\nClinic: ' + data.clinic +
        (data.date ? '\nDate: ' + data.date : '') + '\nTime: ' + data.slot;
      var a = el('a', 'Send on WhatsApp');
      a.id = 'wa-link';
      a.className = 'btn btn-gold';
      a.target = '_blank';
      a.rel = 'noopener';
      a.href = 'https://wa.me/' + encodeURIComponent(cfg.whatsappNumber) + '?text=' + encodeURIComponent(msg);
      successBody.insertAdjacentElement('afterend', a);
    }

    form.hidden = true;
    success.hidden = false;
    success.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearError();
    var data = collect();

    if (form.elements._gotcha.value) return; // spam bot

    var digits = data.phone.replace(/\D/g, '');
    if (!data.name || digits.length < 9) {
      if (!data.name) form.elements.name.setAttribute('aria-invalid', 'true');
      if (digits.length < 9) form.elements.phone.setAttribute('aria-invalid', 'true');
      showError('Please add your name and a phone number so we can confirm your booking.');
      (data.name ? form.elements.phone : form.elements.name).focus();
      return;
    }

    if (!cfg.bookingEndpoint) {
      // Demo mode: nothing is sent.
      showSuccess(data);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    fetch(cfg.bookingEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      showSuccess(data);
      if (window.gtag) window.gtag('event', 'generate_lead', { campaign: data.campaign, clinic: data.clinic });
    }).catch(function () {
      showError('Sorry, we could not send your request. Please call us on +254 721 391 465.');
    }).finally(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Request my holiday session';
    });
  });

  document.getElementById('book-another').addEventListener('click', function () {
    form.reset();
    success.hidden = true;
    form.hidden = false;
    form.elements.name.focus();
  });
})();
