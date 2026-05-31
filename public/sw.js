/**
 * Service Worker for QuantumBlaze ERP OS-Native Push Notifications.
 * Handles background push notifications when the tab or browser is closed.
 */

self.addEventListener("push", (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const options = {
      body: data.body || "You have a new operational update.",
      icon: "/icon-circle.png", // matches standard app icon
      badge: "/icon-circle.png",
      vibrate: [100, 50, 100],
      data: {
        url: data.url || "/dashboard",
      },
    };

    event.waitUntil(
      self.registration.showNotification(data.title || "QuantumBlaze ERP", options)
    );
  } catch (err) {
    console.error("Failed to parse push event payload:", err);
    // Fallback notification
    event.waitUntil(
      self.registration.showNotification("QuantumBlaze ERP Update 🚀", {
        body: "You have a new update. Open the dashboard to view details.",
        icon: "/icon-circle.png",
        data: { url: "/dashboard" },
      })
    );
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/dashboard";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      // If a window is already open, navigate it or focus it
      for (const client of windowClients) {
        if (client.url.includes(targetUrl) && "focus" in client) {
          return client.focus();
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
