**Title:** What is DNS over HTTPS (DoH)?

**SEO Keywords:** DoH, DNS, HTTPS, security, encryption, online privacy

### Intro

When you type a URL into your browser or click on a link, your device needs to resolve the domain name system (DNS) to find the corresponding IP address. This process usually happens over plain text, which can be vulnerable to eavesdropping and manipulation by malicious actors. To improve online security and privacy, DNS over HTTPS (DoH) was introduced. In this post, we'll explore what DoH is, how it works, and its benefits.

### Main Blog Content

DNS over HTTPS (DoH) is a protocol that encrypts Domain Name System (DNS) queries and responses using the same technology used to secure web traffic, namely HTTPS. This allows for the protection of DNS data from being intercepted or modified by attackers, man-in-the-middle attacks, and other types of cyber threats.

Here's how it works:

1. **Client-side DoH**: When a client (e.g., your browser) needs to perform a DNS lookup, it sends an HTTPS request to a DoH-enabled resolver (more on this later). The request includes the domain name or IP address you want to look up.
2. **Resolver processing**: The DoH-enabled resolver receives the HTTPS request and processes the DNS query. It then performs the necessary DNS resolution and returns the result as an HTTPS response.
3. **Encryption and verification**: Both the client and resolver use mutual TLS (Transport Layer Security) encryption to protect the communication channel. This ensures that only the intended parties can read or modify the encrypted data.

DoH offers several benefits:

* **Improved security**: By encrypting DNS queries and responses, DoH protects against man-in-the-middle attacks, eavesdropping, and other types of network-based threats.
* **Increased privacy**: With DoH, DNS queries are no longer sent in plain text. This means that your browsing history and search queries remain private and cannot be easily intercepted or analyzed.
* **Better protection for sensitive information**: As more services move to HTTPS-only, the need for secure DNS resolution becomes even more critical. DoH ensures that these services' domain names are resolved securely.

### TL;DR

In summary, DNS over HTTPS (DoH) is a protocol that encrypts Domain Name System (DNS) queries and responses using HTTPS technology. This improves online security and privacy by protecting against man-in-the-middle attacks, eavesdropping, and other types of cyber threats. DoH-enabled resolvers can be used to perform secure DNS lookups, ensuring that sensitive information remains private and protected.

**Additional Resources:**

* IETF RFC 8484: DNS over HTTPS (DoH)
* Mozilla's DoH documentation
* Cloudflare's DoH implementation

**About the Author:** [Your Name], a technical blogger with expertise in web development, security, and online privacy.