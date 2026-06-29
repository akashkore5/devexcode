import {
  Workflow, GitPullRequest, Container, Settings, Zap,
  Server, Cpu, Database, Shield, ShieldCheck, HardDrive, Cloud, Activity, Users
} from "lucide-react";
import type { FlowNode, FlowPath } from '../../../../components/flows/FlowCanvas';

export const dnsNodes: FlowNode[] = [
  {
    id: "browser",
    title: "Browser DNS Node",
    subtitle: "Local RAM Cache",
    status: "idle",
    metrics: { label: "Local Memory", value: "Check" },
    x: 80, y: 110,
    description: "The browser checks local cache databases to see if the domain IP address is already memorized.",
    details: [
      "Memory lookup: Queries the browser's high-speed local memory cache first.",
      "TTL expiration evaluation: Validates key TTLs (often set to 60s) before fetching from network resolver.",
      "Network bypass: Avoids slow network resolution entirely if cached locally."
    ],
    interviewQuestions: [
      {
        question: "Why do web browsers maintain independent DNS caches separate from the OS resolver?",
        answer: "By caching DNS records directly in browser memory, the browser bypasses expensive OS system calls (like getaddrinfo), reducing page load latency to near-zero."
      }
    ],
    tradeOffs: [
      {
        choice: "Short browser DNS TTL (60s) vs. Long TTL (24 hours)",
        pros: "Short TTLs allow changes (e.g. failovers) to propagate quickly to clients.",
        cons: "Increases average page load times, as clients must perform network DNS resolutions more frequently."
      }
    ],
    failureModes: [
      {
        scenario: "Stale IP addresses in browser cache cause connection errors after a server migration.",
        mitigation: "Instruct clients to clear browser cache or configure short DNS TTLs prior to migration."
      }
    ],
    cliCommands: [
      {
        command: "chrome://net-internals/#dns",
        why: "To inspect and clear the browser's internal DNS cache tables.",
        what: "Instructs Chromium engines to dump memory-locked DNS cache records and print active tables.",
        output: "➜ Host Resolver Cache:\n  devexcode.com: 76.76.21.21 (TTL: 42s)"
      }
    ],
    icon: Users
  },
  {
    id: "os",
    title: "OS Resolver Node",
    subtitle: "Local hosts check",
    status: "idle",
    metrics: { label: "OS hosts", value: "Miss" },
    x: 260, y: 110,
    description: "If browser cache misses, the OS resolver checks `/etc/hosts` and system networking stack.",
    details: [
      "Hosts mapping evaluation: Checks the local /etc/hosts file for manual domain-to-IP overrides.",
      "Socket call handling: Calls the system socket function getaddrinfo() to run network lookups.",
      "OS system caching: Evaluates local OS network stack memory caches."
    ],
    interviewQuestions: [
      {
        question: "What is the function of the /etc/hosts file in operating systems?",
        answer: "/etc/hosts is a local plain-text file that maps hostnames directly to IP addresses. The OS resolver parses this file before querying remote DNS servers, enabling manual address overrides."
      }
    ],
    tradeOffs: [
      {
        choice: "Local /etc/hosts overrides vs. Centralized private DNS servers",
        pros: "Enables instant local hostname testing and development overrides without network lookups.",
        cons: "Very hard to manage and sync consistently across large fleets of developer machines."
      }
    ],
    failureModes: [
      {
        scenario: "Invalid static IP mappings in /etc/hosts block connections to production services.",
        mitigation: "Clear stale hosts mappings or configure automated configuration tooling (e.g. Ansible)."
      }
    ],
    cliCommands: [
      {
        command: "cat /etc/hosts",
        why: "Displays local static domain-to-IP mappings on the host OS.",
        what: "Reads the file from disk using system calls and prints contents to standard output.",
        output: "➜ 127.0.0.1  localhost\n  127.0.0.1  lb.devexcode.test"
      }
    ],
    icon: Settings
  },
  {
    id: "recursive",
    title: "ISP Recursive",
    subtitle: "Resolver 1.1.1.1",
    status: "idle",
    metrics: { label: "ISP Query", value: "Active" },
    x: 460, y: 110,
    description: "ISP or cloud resolver (Cloudflare 1.1.1.1) coordinates iterative queries across namespaces.",
    details: [
      "Recursive resolution logic: Performs iterative query loops across nameservers on behalf of clients.",
      "Shared caching: Caches popular records to resolve queries locally and avoid root server requests.",
      "DNSSEC validation: Verifies cryptographic signatures to prevent DNS spoofing attacks."
    ],
    interviewQuestions: [
      {
        question: "What is the difference between a Recursive DNS Query and an Iterative DNS Query?",
        answer: "In a Recursive Query, the client requests the resolver to return the final IP address (the resolver does all the work). In an Iterative Query, the resolver queries nameservers sequentially, receiving referrals to downstream hosts until it finds the target."
      }
    ],
    tradeOffs: [
      {
        choice: "Public DNS Resolvers (1.1.1.1) vs. Default ISP Resolvers",
        pros: "Public resolvers offer faster lookup speeds, robust DNSSEC validation, and strict privacy guarantees.",
        cons: "Slightly less optimized for local CDN edge routing compared to geolocated ISP resolvers."
      }
    ],
    failureModes: [
      {
        scenario: "The recursive resolver experiences packet drops, stalling all client domain resolutions.",
        mitigation: "Configure redundant recursive resolver addresses (e.g. 8.8.8.8 and 1.1.1.1) in OS configurations."
      }
    ],
    cliCommands: [
      {
        command: "dig @1.1.1.1 devexcode.com",
        why: "Queries the Cloudflare recursive resolver to verify domain records.",
        what: "Launches a UDP query on port 53 to 1.1.1.1, parses the DNS response, and displays standard headers.",
        output: "➜ ;; ANSWER SECTION:\n  devexcode.com.  300  IN  A  76.76.21.21\n  ;; Query time: 14 msec"
      }
    ],
    icon: Cloud
  },
  {
    id: "root",
    title: "DNS Root Server",
    subtitle: "DNS Root (.)",
    status: "idle",
    metrics: { label: "Referral", value: ".com" },
    x: 460, y: 290,
    description: "The top-level root server (.) receives the query, directing the resolver to the matching TLD server.",
    details: [
      "Namespace hierarchy: Renders root-level mapping referrals (.) for downstream namespaces.",
      "Iterative redirection: Returns Top-Level Domain (TLD) nameserver lists to resolvers.",
      "Global redundancy: Replicated across hundreds of physical nodes globally using Anycast routing."
    ],
    interviewQuestions: [
      {
        question: "What are Root DNS Servers and how many of them exist?",
        answer: "Root DNS servers are the first step in resolving hostnames. There are 13 logical root server addresses (named a.root-servers.net to m.root-servers.net), but they are backed by hundreds of physical locations globally using Anycast routing."
      }
    ],
    tradeOffs: [
      {
        choice: "Anycast routing vs. Unicast routing for DNS core servers",
        pros: "Anycast automatically routes queries to the physically closest server node, minimizing latency and mitigating DDoS attacks.",
        cons: "Makes routing paths harder to debug, as paths can change dynamically based on ISP network health."
      }
    ],
    failureModes: [
      {
        scenario: "A massive DDoS attack attempts to flood root DNS servers.",
        mitigation: "Utilize Anycast routing to distribute the load globally and configure highly cached resolver layers."
      }
    ],
    cliCommands: [
      {
        command: "dig +trace devexcode.com",
        why: "Traces the iterative DNS resolution path from Root down to Authoritative servers.",
        what: "Bypasses local resolver caches to run step-by-step iterative resolutions directly against root nameservers.",
        output: "➜ ;; Received 239 bytes from 192.5.5.241#53(f.root-servers.net)\n  ;; Referral: .com NS servers"
      }
    ],
    icon: Server
  },
  {
    id: "tld",
    title: "TLD Nameserver",
    subtitle: ".com Registry",
    status: "idle",
    metrics: { label: "Referral", value: "Auth NS" },
    x: 660, y: 290,
    description: "The TLD (.com) server maps domain namespaces, directing queries to the authoritative DNS host.",
    details: [
      "Top-Level registries: Manages domain registrations and records for generic extension scopes (e.g. .com).",
      "Authoritative referral: Redirects resolvers to Authoritative DNS servers (e.g., AWS Route53).",
      "High availability: Managed by registry operators (like Verisign for .com) using robust Anycast networks."
    ],
    interviewQuestions: [
      {
        question: "What is a TLD DNS server and what role does it play in hostname resolution?",
        answer: "TLD (Top-Level Domain) servers manage records for specific domain extensions (like .com, .org, .net). They receive queries from recursive resolvers and return NS records pointing to the domain's Authoritative Nameserver."
      }
    ],
    tradeOffs: [
      {
        choice: "Generic TLDs (.com) vs. Country-Code TLDs (.io, .co.uk)",
        pros: ".com is globally trusted and highly cached in recursive systems.",
        cons: "Country-code TLDs are subject to local government regulations and can experience registry outage failures."
      }
    ],
    failureModes: [
      {
        scenario: "A TLD registry outage drops DNS resolutions for all domains under that extension.",
        mitigation: "Registry operators run highly redundant Anycast datacenters; enterprise clients should monitor TLD availability metrics."
      }
    ],
    cliCommands: [
      {
        command: "dig ns devexcode.com @a.gtld-servers.net",
        why: "Queries TLD nameservers directly to fetch authoritative nameserver records.",
        what: "Launches a UDP query to the TLD nameserver IP address, requesting NS records for the target domain.",
        output: "➜ ;; ANSWER SECTION:\n  devexcode.com.  172800  IN  NS  ns-124.awsdns-15.com."
      }
    ],
    icon: Database
  },
  {
    id: "auth",
    title: "Auth Nameserver",
    subtitle: "AWS Route53 Zone",
    status: "idle",
    metrics: { label: "A-Record", value: "Resolved" },
    x: 820, y: 110,
    description: "The definitive domain authority containing actual DNS maps. Returns target IP records.",
    details: [
      "Definitive response: Holds the official DNS records (A, AAAA, CNAME, TXT) mapped by domain owners.",
      "A-Record translation: Translates the hostname to its public ingress IP address (e.g. Vercel: 76.76.21.21).",
      "Dynamic routing checks: Dynamically resolves active targets using database health validations."
    ],
    interviewQuestions: [
      {
        question: "What is an A Record and how does it differ from a CNAME Record?",
        answer: "An A Record maps a domain name directly to an IPv4 address (e.g. 76.76.21.21). A CNAME (Canonical Name) Record maps a domain name to another domain name (an alias), requiring an extra DNS lookup step."
      }
    ],
    tradeOffs: [
      {
        choice: "CNAME records vs. Alias records at the Zone Apex",
        pros: "Alias records allow mapping the root domain (apex) directly to dynamic cloud endpoints without violating DNS specs.",
        cons: "CNAME records cannot be used at the zone apex because they block other record types (like MX) on that domain."
      }
    ],
    failureModes: [
      {
        scenario: "An authoritative nameserver is misconfigured, returning NXDOMAIN errors to all clients.",
        mitigation: "Run DNS validations in CI/CD configurations before applying Zone updates to live clusters."
      }
    ],
    cliCommands: [
      {
        command: "dig A devexcode.com @ns-124.awsdns-15.com",
        why: "Queries the authoritative AWS Route53 nameserver to retrieve the domain IP mapping.",
        what: "Launches UDP query packets directly to the zone's authoritative IP to retrieve IP records.",
        output: "➜ ;; ANSWER SECTION:\n  devexcode.com.  300  IN  A  76.76.21.21\n  ;; AUTHORITATIVE ANSWER"
      }
    ],
    icon: ShieldCheck
  },
  {
    id: "backfill",
    title: "Resolver Cache",
    subtitle: "ISP Backfill",
    status: "idle",
    metrics: { label: "Caching TTL", value: "300s" },
    x: 660, y: 110,
    description: "Caches the resolved A-Record at the recursive resolver level to avoid repeat iterations.",
    details: [
      "Caching resolved entries: Caches the IP record in the recursive resolver's memory to bypass root lookups.",
      "TTL compliance: Automatically decrements and evicts entries when their configured TTL expires.",
      "Performance optimization: Resolves subsequent queries from different clients locally in <1ms."
    ],
    interviewQuestions: [
      {
        question: "What are the advantages and risks of configuring a high TTL (e.g. 86400s) on DNS records?",
        answer: "Advantages: Minimizes lookup latency and shields authoritative servers from continuous traffic. Risks: Prevents rapid IP modifications during migrations or failovers, as stale records linger in resolver caches."
      }
    ],
    tradeOffs: [
      {
        choice: "Short TTL (300s) vs. Long TTL (86400s) for public APIs",
        pros: "Short TTL enables quick server failover switches and zero-downtime migrations.",
        cons: "Increases average client lookup times and raises DNS query traffic billing costs."
      }
    ],
    failureModes: [
      {
        scenario: "The ISP resolver ignores record TTL limits, continuing to serve expired IP mappings.",
        mitigation: "Configure backup DNS providers or use client-side DNS override scripts where possible."
      }
    ],
    cliCommands: [
      {
        command: "dig +nocmd +noquestion +nostats devexcode.com",
        why: "Fetches domain record mappings quickly from local resolver caches.",
        what: "Sends query packets to the OS resolver, checking local network stack caches and printing active TTL mappings.",
        output: "➜ devexcode.com.  258  IN  A  76.76.21.21"
      }
    ],
    icon: HardDrive
  }
];

export const dnsPaths: FlowPath[] = [
  { from: "browser", to: "os", type: "normal" },
  { from: "os", to: "recursive", type: "normal" },
  { from: "recursive", to: "root", type: "database" },
  { from: "root", to: "tld", type: "normal" },
  { from: "tld", to: "auth", type: "normal" },
  { from: "auth", to: "backfill", type: "cache" },
  { from: "backfill", to: "browser", type: "normal" }
];

export const dnsLogs = [
  "[INFO] Browser: Query initiated for 'devexcode.com'. Checking local browser memory...",
  "[WARN] Browser: Domain not found in local memory cache. Checking OS resolver hosts...",
  "[WARN] OS Resolver: Hosts file check missed. Forwarding query to ISP recursive resolver...",
  "[INFO] ISP Resolver: Querying Root Nameserver group A.ROOT-SERVERS.NET for '.com'...",
  "[INFO] Root Server: Redirecting recursive resolver to .com TLD Nameserver (Verisign)...",
  "[INFO] TLD Server: Redirecting recursive resolver to Authoritative Nameserver (Amazon Route53)...",
  "[INFO] Auth Server: Querying DNS zone maps. A-Record mapping matched successfully.",
  "[SUCCESS] Auth Server: Resolved devexcode.com ➔ 76.76.21.21 (Vercel Ingress gateway).",
  "[INFO] ISP Cache: Backfilling resolved A-Record to recursive resolver memory. TTL: 300s.",
  "[SUCCESS] Browser: Cached IP address resolved in 12ms. Launching HTTP connection. Success!"
];
