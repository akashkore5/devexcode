**Title:** How Does App Deep Linking Work?

**SEO Keywords:** app deep linking, mobile apps, URI scheme, intent filters, Android, iOS

**Intro:**

In the age of mobile apps, it's crucial to provide users with a seamless experience across multiple platforms and apps. One way to achieve this is through app deep linking, which enables users to jump directly into a specific part of an app from another app, website, or even a physical location. In this blog post, we'll dive into the world of app deep linking and explore how it works.

**Main Blog Content:**

App deep linking relies on two primary technologies: URI schemes (Android) and Universal Links (iOS). Let's break down each technology:

### Android (URI Schemes)

On Android, app deep linking is achieved through URI schemes. A URI scheme defines a unique identifier for an app, allowing other apps or external services to launch the app with specific data.

Here's an example of how it works:

1. **Registering the URI Scheme:** In your Android app, you register a custom URI scheme in the `AndroidManifest.xml` file using the `<intent-filter>` tag:
```xml
<intent-filter>
    <data android:scheme="myapp" />
</intent-filter>
```
2. **Launching the App:** When another app or an external service wants to launch your app with specific data, they use the registered URI scheme in a `Uri` object:
```java
Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("myapp://specific/data"));
```
The system then finds the first app that can handle the URI scheme and launches it. Your app will receive an `Intent` with the specific data in its extras.

### iOS (Universal Links)

On iOS, app deep linking is achieved through Universal Links. This technology allows users to jump into a specific part of your app from another app or website.

Here's how it works:

1. **Configuring Universal Links:** In your iOS project, you configure Universal Links by adding an `apple-app-site-association` file to your server or hosting platform. This file specifies the domains and URLs that can trigger the Universal Link.
2. **Launching the App:** When a user taps on a link from another app or website, their device will check if the app is installed and configured for Universal Links. If it is, the system will launch the app with the specific data.

**How Do They Work Together?**

When an Android app wants to deep link into an iOS app, or vice versa, you can use a third-party service like Branch or Firebase Dynamic Links. These services provide a universal way to handle deep linking across multiple platforms and apps.

Here's an ASCII diagram illustrating the flow:
```
          +---------------+
          |  App A (Android) |
          +---------------+
                  |
                  |  URI scheme: myapp://
                  v
          +---------------+
          |  Service X     |
          +---------------+
                  |
                  |  Universal Link
                  v
          +---------------+
          |  App B (iOS)    |
          +---------------+
```
**TL;DR:** App deep linking allows users to jump directly into a specific part of an app from another app, website, or physical location. Android uses URI schemes, while iOS uses Universal Links. Third-party services can help facilitate deep linking across multiple platforms and apps.