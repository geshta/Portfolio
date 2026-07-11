document.addEventListener('DOMContentLoaded', () => {

  // --- Nav scroll effect & active links ---
  const nav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);

    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  });

  // --- Mobile hamburger ---
  const hamburger = document.getElementById('hamburger');
  const mobileLinks = document.getElementById('nav-links');
  hamburger?.addEventListener('click', () => {
    mobileLinks.classList.toggle('open');
  });
  mobileLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileLinks.classList.remove('open'));
  });

  // --- Intersection Observer fade-up ---
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // --- Typing animation ---
  const typingEl = document.getElementById('typing-text');
  if (typingEl) {
    const phrases = [
      'Full Stack Developer',
      'SaaS Platform Builder',
      'Desktop App Engineer',
      'Computer Vision Dev'
    ];
    let pIdx = 0, cIdx = 0, deleting = false;

    const type = () => {
      const phrase = phrases[pIdx];
      typingEl.textContent = deleting
        ? phrase.substring(0, cIdx - 1)
        : phrase.substring(0, cIdx + 1);
      deleting ? cIdx-- : cIdx++;

      let delay = deleting ? 45 : 95;
      if (!deleting && cIdx === phrase.length) { delay = 2200; deleting = true; }
      else if (deleting && cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; delay = 400; }
      setTimeout(type, delay);
    };
    setTimeout(type, 800);
  }

  // --- Contact form (Web3Forms ready) ---
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const submitBtn = form?.querySelector('.form-submit');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const original = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const formData = new FormData(form);

    // Check if Web3Forms access key is set; if not, simulate
    const hasKey = formData.get('access_key') && formData.get('access_key') !== 'YOUR_ACCESS_KEY_HERE';

    if (hasKey) {
      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST', body: formData
        });
        const data = await res.json();
        if (data.success) {
          status.textContent = '✓ Message sent! I\'ll get back to you within 24 hours.';
          status.className = 'form-status success';
          form.reset();
        } else {
          throw new Error('Failed');
        }
      } catch {
        status.textContent = '✗ Something went wrong. Email me at mgeshta77@gmail.com directly.';
        status.className = 'form-status error';
      }
    } else {
      // Demo mode
      await new Promise(r => setTimeout(r, 1200));
      status.textContent = '✓ Message sent! (Add your Web3Forms key to activate email delivery)';
      status.className = 'form-status success';
      form.reset();
    }

    submitBtn.textContent = original;
    submitBtn.disabled = false;
    setTimeout(() => { status.style.display = 'none'; }, 6000);
  });
});
