---
title: "Design a System like Uber"
id: "12"
difficulty: "Hard"
tags: ["Geolocation", "Real-time Matching", "Scalability", "System Design"]
---

# Design a System like Uber (Ride-Sharing System)

Uber is a ride-sharing platform that connects riders with drivers. The system needs to handle real-time location tracking, efficient matching, dynamic pricing, and seamless payments.

## 1. Requirements

### Functional Requirements
- **Riders:** Search for nearby drivers, request a ride, track driver location, pay for the ride.
- **Drivers:** Accept/decline requests, navigate to rider/destination, update status (online/offline).
- **Ride Matching:** Match a rider with the nearest available driver.
- **Pricing:** Dynamic pricing (surge) based on demand and supply.
- **Notifications:** Real-time updates for both riders and drivers.

### Non-Functional Requirements
- **High Availability:** The system must be available 24/7.
- **Scalability:** Handle millions of riders and drivers simultaneously.
- **Latency:** Low latency for matching and location updates (real-time).
- **Consistency:** Eventual consistency for history, but high consistency for matching and payments.

## 2. High-Level Architecture

The system follows a microservices architecture to ensure scalability and independent deployment of components.

### Key Components

- **Rider App / Driver App:** Mobile clients communicating via APIs.
- **API Gateway:** Entry point for all requests, handling authentication and rate limiting.
- **Location Service:** Tracks and stores the real-time location of drivers.
- **Matcher Service:** Matches riders with drivers based on proximity.
- **Trip Service:** Manages the lifecycle of a trip.
- **Pricing Service:** Calculates the fare (surge pricing).
- **Notification Service:** Sends push notifications.
- **Payment Service:** Handles transactions.

## 3. Data Model

### Core Entities
- **User (Rider/Driver):** ID, Name, Role, Rating.
- **Driver Location:** DriverID, Latitude, Longitude, Status.
- **Trip:** TripID, RiderID, DriverID, PickupLoc, DropoffLoc, Status, Fare.

### Storage Choices
- **RDBMS (PostgreSQL):** For user profiles, trip history, and payments (strong ACID).
- **NoSQL (Redis/Cassandra):** For real-time location tracking. Redis is excellent for fast updates and Geo-spatial queries.
- **Elasticsearch:** For searching trip logs and analytics.

## 4. Real-time Location Tracking

Uber uses **Geofencing** and **Quadtrees** (or S2/H3 libraries) to efficiently search for nearby drivers.

### How it works:
1. Drivers update their location every few seconds.
2. The Location Service updates a spatial index (e.g., Redis `GEOADD`).
3. When a rider requests a ride, the Matcher Service performs a `GEORADIUS` query to find drivers within X miles.

## 5. Ride Matching Algorithm

1. **Filtering:** Find all online drivers within a radius.
2. **Ranking:** Rank drivers by ETA, distance, and rating.
3. **Dispatch:** Send the request to the top driver. If they decline, move to the next.

## 6. Surge Pricing

Surge pricing is triggered when "Demand > Supply".
- **Demand:** Calculated by the number of active ride requests in a cell.
- **Supply:** Number of active online drivers in the same cell.
- **Algorithm:** Use a multiplier based on the ratio.

## 7. Scalability & Scalable Components

- **Load Balancers:** Distribute traffic across services.
- **Kafka:** For asynchronous processing (e.g., logging, payment processing).
- **Zookeeper:** For service discovery and coordination.

---

*This is a simplified design of Uber. In reality, it involves complex distributed systems handling petabytes of data.*
