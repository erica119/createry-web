const menu = document.querySelector('.menu-toggle');
const links = document.querySelector('.nav-links');
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  links.classList.toggle('open', open);
});

const number = new Intl.NumberFormat('en-US');
const money = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0});
const followers = document.querySelector('#followers');
const followersRange = document.querySelector('#followers-range');
const conversion = document.querySelector('#conversion');
const conversionRange = document.querySelector('#conversion-range');

function calculate() {
  if (!followers || !conversion) return;
  const audience = Math.max(0, Math.min(100000000, Number(followers.value) || 0));
  const rate = Math.max(0, Math.min(100, Number(conversion.value) || 0));
  const subscribers = Math.round(audience * rate / 100);
  const gross = subscribers * 9;
  const share = gross * .8;
  const afterFee = share - 199;
  document.querySelector('#subscribers').textContent = number.format(subscribers);
  document.querySelector('#gross').textContent = money.format(gross);
  document.querySelector('#share').textContent = money.format(share);
  document.querySelector('#net').textContent = money.format(afterFee);
  document.querySelector('#equation').textContent = `${number.format(audience)} × ${number.format(rate)}% × $9 × 80% = ${money.format(share)}`;
  followersRange.value = Math.min(audience, Number(followersRange.max));
  conversionRange.value = Math.min(rate, Number(conversionRange.max));
}

for (const [field, slider] of [[followers, followersRange], [conversion, conversionRange]]) {
  field?.addEventListener('input', calculate);
  slider?.addEventListener('input', () => {field.value = slider.value; calculate();});
}
calculate();

const contact = document.querySelector('#contact-form');
const topic = new URLSearchParams(window.location.search).get('topic');
const topicSelect = document.querySelector('#topic');
if (topicSelect && topic === 'creator') topicSelect.value = 'Founding creator partnership';
if (topicSelect && topic === 'lead') topicSelect.value = 'Founding Creator Partnerships Lead role';
contact?.addEventListener('submit', async event => {
  event.preventDefault();
  if (!contact.reportValidity()) return;
  const button = contact.querySelector('button[type=submit]');
  const status = document.querySelector('#form-status');
  button.disabled = true;
  status.textContent = 'Sending…';
  try {
    const response = await fetch('https://formspree.io/f/maqlgzyn', {
      method: 'POST',
      headers: {'Accept': 'application/json'},
      body: new FormData(contact),
    });
    if (!response.ok) throw new Error(`Form service returned ${response.status}`);
    contact.reset();
    status.textContent = 'Thanks. Your message has been sent.';
  } catch (error) {
    status.textContent = 'The message could not be sent. Please try again.';
  } finally {
    button.disabled = false;
  }
});
