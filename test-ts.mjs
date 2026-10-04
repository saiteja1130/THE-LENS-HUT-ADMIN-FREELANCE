try {
  const res = await fetch('https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.26.9/babel.min.js');
  console.log('Fetch status:', res.status, 'length:', (await res.text()).length);
} catch (e) {
  console.error('Fetch error:', e.message);
}
