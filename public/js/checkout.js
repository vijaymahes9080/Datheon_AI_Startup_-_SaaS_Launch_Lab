/**
 * DealForge AI - Checkout & Payment Simulation Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const plan = urlParams.get('plan') || 'pro';
  const planTag = document.getElementById('checkout-plan-tag');
  const titleEl = document.getElementById('checkout-title');
  const itemNameEl = document.getElementById('item-name');
  const itemPriceEl = document.getElementById('item-price');
  const totalPriceEl = document.getElementById('total-price');
  const btnComplete = document.getElementById('btn-complete-checkout');
  const statusMsg = document.getElementById('checkout-status-msg');

  if (plan === 'lifetime') {
    planTag.innerText = 'Founder Lifetime License';
    planTag.className = 'plan-badge plan-lifetime';
    titleEl.innerText = 'Claim Founder Lifetime License';
    itemNameEl.innerText = 'DealForge Lifetime License (3 Years Guaranteed Pro)';
    itemPriceEl.innerText = '$499.00 USD';
    totalPriceEl.innerText = '$499.00 USD';
    btnComplete.innerHTML = '<span>Authorize Test Payment ($499.00) →</span>';
  } else {
    planTag.innerText = 'Agency Pro Plan';
    planTag.className = 'plan-badge plan-pro';
    titleEl.innerText = 'Upgrade to Agency Pro';
    itemNameEl.innerText = 'Agency Pro Subscription (Monthly Recurring)';
    itemPriceEl.innerText = '$79.00 USD';
    totalPriceEl.innerText = '$79.00 USD';
    btnComplete.innerHTML = '<span>Authorize Test Payment ($79.00) →</span>';
  }

  btnComplete.addEventListener('click', async () => {
    btnComplete.disabled = true;
    btnComplete.innerHTML = '<span>Processing Stripe Test Authorization...</span>';

    try {
      // 1. Create Checkout Session
      const sessionRes = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan })
      });
      const sessionData = await sessionRes.json();

      // 2. Trigger Mock Webhook to simulate real Stripe event
      const webhookRes = await fetch('/api/webhooks/mock-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sessionData.sessionId, plan })
      });
      const webhookData = await webhookRes.json();

      if (webhookData.success) {
        statusMsg.style.display = 'block';
        statusMsg.style.color = '#10b981';
        statusMsg.innerHTML = `
          🎉 <strong>Payment Verified!</strong> Order ID: <code>${sessionData.orderId}</code><br>
          Your account is now upgraded to <strong>${plan.toUpperCase()}</strong>.
          <br><br>
          <a href="/app.html" class="btn-primary" style="display:inline-block; margin-top:0.5rem; text-decoration:none;">
            Return to Dashboard →
          </a>
        `;
        btnComplete.style.display = 'none';
      } else {
        throw new Error(webhookData.error || 'Payment failed');
      }
    } catch (err) {
      statusMsg.style.display = 'block';
      statusMsg.style.color = '#ef4444';
      statusMsg.innerHTML = `⚠️ Simulation Error: ${err.message}. Retrying fallback.`;
      btnComplete.disabled = false;
      btnComplete.innerHTML = '<span>Retry Test Checkout →</span>';
    }
  });
});
