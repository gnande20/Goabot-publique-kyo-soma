// handlerWhenListenHasError.js
function handleListenerError(err, { retryFn = null, retries = 3, backoff = 2000 } = {}) {
  console.error('Listener error:', err && err.message ? err.message : err);

  if (typeof retryFn !== 'function' || retries <= 0) return;

  let attempt = 0;
  const tryRetry = async () => {
    attempt++;
    try {
      await retryFn();
      console.log('Retry succeeded on attempt', attempt);
    } catch (e) {
      console.error('Retry failed attempt', attempt, e && e.message);
      if (attempt < retries) setTimeout(tryRetry, backoff * attempt);
      else console.error('All retries failed');
    }
  };
  setTimeout(tryRetry, backoff);
}

module.exports = { handleListenerError };
