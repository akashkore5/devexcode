self.addEventListener("push", async (event) => {
  try {
    const data = event.data.json();
    const { title, body, data: { url } } = data; // Destructure data.url

    const options = {
      body,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      data: { url },
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (error) {
    console.error("Push event error:", error);
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      const url = event.notification.data.url;
      for (const client of clientList) {
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});