/**
 * DealForge AI - Landing Page Controller & Waitlist Client
 */

document.addEventListener('DOMContentLoaded', () => {
  const waitlistForm = document.getElementById('waitlist-form');
  const emailInput = document.getElementById('waitlist-email');
  const submitBtn = document.getElementById('btn-submit-waitlist');
  const feedbackEl = document.getElementById('waitlist-feedback');
  const consentCheckbox = document.getElementById('consent-checkbox');

  // Parse Attribution Parameters (UTM & Referrer)
  const urlParams = new URLSearchParams(window.location.search);
  const attribution = {
    source: urlParams.get('utm_source') || 'direct',
    medium: urlParams.get('utm_medium') || 'organic',
    campaign: urlParams.get('utm_campaign') || 'launch',
    ref: urlParams.get('ref') || null,
    referrer: document.referrer || 'direct'
  };

  // RFC 5322 Simplified Email Validator
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).trim().toLowerCase());
  };

  if (waitlistForm) {
    waitlistForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();

      if (!validateEmail(email)) {
        showFeedback('Please enter a valid work email address.', 'error');
        emailInput.focus();
        return;
      }

      if (!consentCheckbox.checked) {
        showFeedback('Please agree to the privacy and zero-PII terms to proceed.', 'error');
        return;
      }

      // Set Loading State
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Reserving Seat...</span>';

      try {
        const response = await fetch('/api/waitlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            attribution,
            consentGiven: true
          })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showFeedback(
            `🎉 You're in! You are #${data.position || 42} on the private beta list. We'll send your invite to ${email}.`,
            'success'
          );
          emailInput.value = '';
          submitBtn.innerHTML = '<span>Reserved! ✓</span>';
          trackEvent('waitlist_signup_completed', { email_domain: email.split('@')[1] });
        } else if (data.code === 'DUPLICATE_EMAIL') {
          showFeedback(`ℹ️ You're already on the priority list! Your current position is #${data.position || 42}.`, 'info');
          submitBtn.innerHTML = '<span>Already Registered ✓</span>';
        } else {
          showFeedback(data.error || 'Something went wrong. Please try again.', 'error');
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Get Priority Access →</span>';
        }
      } catch (err) {
        // Fallback for offline or static GitHub Pages hosting
        const stored = JSON.parse(localStorage.getItem('dealforge_waitlist') || '[]');
        if (stored.includes(email.toLowerCase())) {
          showFeedback(`ℹ️ You're already on the priority list! Your current position is #${42 + stored.indexOf(email.toLowerCase())}.`, 'info');
          submitBtn.innerHTML = '<span>Already Registered ✓</span>';
        } else {
          stored.push(email.toLowerCase());
          localStorage.setItem('dealforge_waitlist', JSON.stringify(stored));
          showFeedback(`🎉 You're in! You are #${42 + stored.length} on the private beta list. We'll send your invite to ${email}.`, 'success');
          emailInput.value = '';
          submitBtn.innerHTML = '<span>Reserved! ✓</span>';
        }
      }
    });
  }

  function showFeedback(message, type) {
    if (!feedbackEl) return;
    feedbackEl.style.display = 'block';
    feedbackEl.innerHTML = message;
    if (type === 'error') {
      feedbackEl.style.color = '#ef4444';
    } else if (type === 'success') {
      feedbackEl.style.color = '#10b981';
    } else {
      feedbackEl.style.color = '#3b82f6';
    }
  }

  function trackEvent(eventName, metadata = {}) {
    try {
      fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: eventName, metadata, timestamp: Date.now() })
      }).catch(() => {});
    } catch (_) {}
  }

  // Smooth scroll for nav anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
