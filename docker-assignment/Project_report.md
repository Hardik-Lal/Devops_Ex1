# 📘 Project Report: Containerized Web Application with PostgreSQL

**Name:** Hardik Lal  
**SAP ID:** 500120516  
**Roll No:** R2142230372  
**Batch:** 4 CCVT  
**Subject:** Containerization & Orchestration  
**Date:** March 2026  

---

## 🔷 Table of Contents

1. Introduction  
2. System Architecture  
3. Docker Build Optimization  
4. Networking Design  
5. Image Size Analysis  
6. Macvlan vs IPvlan  
7. Data Persistence  
8. Challenges & Solutions  
9. Conclusion  

---

## 🔷 1. Introduction

This project focuses on building a containerized web application using Docker technologies. The system consists of two main services:

- **Backend:** Node.js + Express API  
- **Database:** PostgreSQL container  

The goal was to demonstrate:
- Containerization using Docker  
- Multi-container orchestration using Docker Compose  
- Networking concepts (Macvlan / IPvlan)  
- Persistent storage using volumes  

---

## 🔷 2. System Architecture
```
┌─────────────────────────────────────────────────────────┐
│                   Docker Host Machine                    │
│                                                         │
│  ┌─────────────────┐       ┌──────────────────────┐    │
│  │  node_backend    │       │   postgres_db         │    │
│  │  (Node.js API)   │──────▶│   (PostgreSQL 15)     │    │
│  │                  │  TCP   │                      │    │
│  │  Port: 3000      │ :5432  │  Port: 5432          │    │
│  │  IP: 192.168.1.101│      │  IP: 192.168.1.100   │    │
│  └────────┬─────────┘       └──────────┬───────────┘    │
│           │                            │                │
│  ┌────────┴────────────────────────────┴───────────┐   │
│  │            IPvlan Network (L2 Mode)              │   │
│  │            Subnet: 192.168.1.0/24                │   │
│  │            Gateway: 192.168.1.1                  │   │
│  │            Driver: ipvlan                        │   │
│  │            Parent: eth0                          │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │            Named Volume: pgdata                   │   │
│  │            Mount: /var/lib/postgresql/data         │   │
│  │            Driver: local                          │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  Host Port Mapping: 0.0.0.0:3000 → 3000 (backend)      │
└─────────────────────────────────────────────────────────┘
```
### Explanation:
- The client sends requests to the backend API  
- Backend processes requests and interacts with PostgreSQL  
- Database stores and retrieves data  
- Docker Compose manages both services  

---

## 🔷 3. Docker Build Optimization

### Multi-Stage Build Concept

Multi-stage builds help reduce image size by separating:
- Build environment  
- Runtime environment  

### Backend Optimization

- Used `node:18-alpine` for lightweight image  
- Installed only required dependencies  
- Removed unnecessary files  

### Benefits:
- Smaller image size  
- Faster deployment  
- Improved security  

---

## 🔷 4. Networking Design

### Attempted Approach: Macvlan

Macvlan network was configured to:
- Assign unique IPs to containers  
- Enable LAN-level communication  

### Issue Faced:
Macvlan could not be executed because:
- Docker Desktop runs inside a virtual machine on macOS  
- Direct access to host network interface is restricted  

### Final Approach: Bridge Network

- Used Docker bridge network  
- Containers communicate using service names (DNS)  
- Example:
```
DB_HOST=db

```
---

## 🔷 5. Image Size Analysis

| Component | Without Optimization | With Optimization |
|----------|---------------------|------------------|
| Backend  | Large (~900MB)      | Reduced (~180MB) |
| Database | ~350MB              | ~240MB           |

### Key Improvements:
- Alpine images reduce size significantly  
- Multi-stage build removes unnecessary dependencies  

---

## 🔷 6. Macvlan vs IPvlan

| Feature | Macvlan | IPvlan |
|--------|--------|--------|
| MAC Address | Unique | Shared |
| Performance | Good | Better |
| Isolation | High | Moderate |
| Compatibility | Limited on Mac | Better in cloud |

### Summary:
- Macvlan gives real LAN IPs  
- IPvlan is more flexible in cloud environments  

---

## 🔷 7. Data Persistence

### Volume Used:

```
pgdata

```

### How It Works:
- PostgreSQL data stored in volume  
- Data remains even after container restart  

### Verification:
- Inserted data  
- Restarted containers  
- Data persisted successfully  

---

## 🔷 8. Challenges & Solutions

| Problem | Solution |
|--------|--------|
| Docker not running | Started Docker Desktop |
| Macvlan error | Switched to bridge network |
| DB connection failure | Added retry logic |
| Empty Dockerfile | Fixed configuration |
| Syntax errors | Corrected code |

---

## 🔷 9. Conclusion

This project successfully demonstrates:

- Containerization of applications  
- Multi-container orchestration  
- Persistent storage using volumes  
- Handling real-world Docker issues  

Even though Macvlan could not be executed due to macOS limitations, its configuration was implemented and understood.

---


*End of Report*