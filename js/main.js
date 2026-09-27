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
function updateContactContext() {
  if (!topicSelect) return;
  const isLead = topicSelect.value === 'Founding Creator Partnerships Lead role';
  document.querySelectorAll('[data-creator-only]').forEach(field => { field.hidden = isLead; });
  const title = document.querySelector('#contact-title');
  const intro = document.querySelector('#contact-intro');
  const messageLabel = document.querySelector('#message-label');
  const sideTitle = document.querySelector('#contact-side-title');
  const sideIntro = document.querySelector('#contact-side-intro');
  if (title) title.textContent = isLead ? 'Help build the creator program.' : "Let's make your recipes part of their week.";
  if (intro) intro.textContent = isLead ? 'Tell us about your creator partnership experience and why the pilot role interests you.' : "Tell us about your content, your audience, and what you want to build. We'll follow up to talk through the fit.";
  if (messageLabel) messageLabel.textContent = isLead ? 'Your relevant experience and interest in the role' : 'What would you like to explore?';
  if (sideTitle) sideTitle.textContent = isLead ? 'Own the first creator relationships.' : 'Bring your audience closer to the table.';
  if (sideIntro) sideIntro.textContent = isLead ? 'Share examples of outreach, onboarding, and turning creator feedback into action.' : 'A recipe library, an engaged community, and a point of view on food are enough to start a conversation.';
}
topicSelect?.addEventListener('change', updateContactContext);
updateContactContext();
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
