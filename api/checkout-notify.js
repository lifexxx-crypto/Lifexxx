const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = async (request, response) => {
  response.setHeader('Cache-Control', 'no-store');

  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const allowedOrigin = process.env.SITE_ORIGIN || 'https://lifexxx.vercel.app';
  const origin = request.headers.origin;
  if (origin && origin !== allowedOrigin) {
    response.status(403).json({ error: 'Origin not allowed' });
    return;
  }

  const body = typeof request.body === 'string' ? JSON.parse(request.body || '{}') : request.body || {};
  const email = String(body.email || '').trim().toLowerCase();
  const product = String(body.product || '').trim().slice(0, 80);
  const price = String(body.price || '').trim().slice(0, 24);

  if (!EMAIL_PATTERN.test(email) || !product || !price) {
    response.status(400).json({ error: 'Invalid checkout details' });
    return;
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    response.status(503).json({ error: 'Notifications are not configured' });
    return;
  }

  const telegram = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: `New LIFEXXX checkout\\nPlan: ${product}\\nAmount: $${price} USD\\nEmail: ${email}`
    })
  });

  if (!telegram.ok) {
    response.status(502).json({ error: 'Notification delivery failed' });
    return;
  }

  response.status(204).end();
};
