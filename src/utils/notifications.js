import { v4 as uuidv4 } from "uuid"; // Add uuid package: npm install uuid

// Utility to convert VAPID public key (optional, if not using process.env)
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function subscribeToNotifications(userId) {
  try {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      throw new Error("Push notifications are not supported in this browser");
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      throw new Error("Notification permission denied");
    }

    const registration = await navigator.serviceWorker.ready;
    if (!registration) {
      throw new Error("Service worker not registered");
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      ),
    });

    const response = await fetch("/api/notifications/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subscription,
        userId, // Pass userId or null for anonymous users
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to subscribe to notifications");
    }

    // Store server-returned userId for anonymous users
    if (!userId && data.userId) {
      localStorage.setItem("notificationUserId", data.userId);
    }

    return true;
  } catch (error) {
    console.error("Notification subscription error:", error);
    throw error;
  }
}

export async function checkSubscriptionStatus(userId) {
  try {
    // For anonymous users, retrieve userId from localStorage
    const finalUserId = userId || localStorage.getItem("notificationUserId");
    if (!finalUserId) {
      return false; // No userId available, not subscribed
    }

    const response = await fetch("/api/notifications/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: finalUserId }),
    });

    const data = await response.json();
    return response.ok && data.isSubscribed;
  } catch (error) {
    console.error("Check subscription status error:", error);
    return false;
  }
}

export async function unsubscribeFromNotifications(userId) {
  try {
    // For anonymous users, retrieve userId from localStorage
    const finalUserId = userId || localStorage.getItem("notificationUserId");
    if (!finalUserId) {
      throw new Error("No userId available for unsubscribing");
    }

    // Unsubscribe from push notifications
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
    }

    // Remove subscription from server
    const response = await fetch("/api/notifications/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: finalUserId }),
    });

    if (response.ok && !userId) {
      // Clear anonymous userId from localStorage
      localStorage.removeItem("notificationUserId");
    }

    return response.ok;
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return false;
  }
}