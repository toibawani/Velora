export const trackEvent = (eventName, data = {}) => {
  const event = {
    name: eventName,
    timestamp: new Date().toISOString(),
    ...data,
  };

  try {
    const events = JSON.parse(localStorage.getItem('velora_events') || '[]');
    events.push(event);
    // keep last 100 events to avoid storage bloat
    localStorage.setItem('velora_events', JSON.stringify(events.slice(-100)));
  } catch {
    console.error('Failed to track event');
  }
};

export const getAnalytics = () => {
  try {
    return JSON.parse(localStorage.getItem('velora_events') || '[]');
  } catch {
    return [];
  }
};

export const clearAnalytics = () => {
  try {
    localStorage.removeItem('velora_events');
  } catch {
    console.error('Failed to clear analytics');
  }
};
