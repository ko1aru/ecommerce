# E-Commerce Application

A full-stack e-commerce web application built to demonstrate real-world backend and frontend engineering concepts, including authentication, authorization, containerization, and secure configuration management.

This project is designed as a **resume-grade personal project**, focusing on correctness, clarity, and practical architecture rather than over-engineering.

---

## Tech Stack

### Backend

* **Java 17**
* **Spring Boot**
* **Spring Security** (JWT + OAuth2)
* **MySQL**
* **JPA / Hibernate**
* **Maven**

### Frontend

* **Next.js (App Router)**
* **TypeScript**
* **React Context API**
* **Tailwind CSS**

### DevOps / Tooling

* **Docker & Docker Compose**
* **Git & GitHub**
* **Postman** (API testing)

---

## Features

### Authentication & Authorization

* User registration and login using **JWT**
* **Google OAuth2 login** integration
* Role-based access control (USER / ADMIN)
* Secure password storage

### E-Commerce Functionality

* Product listing and product details
* Cart management (add, update, remove items)
* Wishlist functionality
* Order placement and order history
* Transaction history

### Backend Architecture

* Layered architecture (Controller → Service → Repository)
* DTO-based request/response handling
* Centralized exception handling
* Clean separation of concerns

### Frontend

* Protected routes based on authentication state
* Admin dashboard pages
* Cart, wishlist, orders, and checkout flows
* OAuth callback handling

### Security & Configuration

* Environment-based configuration (no secrets in source code)
* JWT token handling on client and server
* Docker-friendly setup

---

## Project Structure

```
ECommerce/
│
├── src/main/java/com/local/ECommerce   # Spring Boot backend
├── src/main/resources                 # Config files
│
├── ecommerce-frontend/                # Next.js frontend
│
├── docker-compose.yml                 # Docker orchestration
├── Dockerfile                         # Backend Dockerfile
└── README.md
```

---

## Environment Variables

Create a `.env` file **locally** (do NOT commit this file):

```
SPRING_DATASOURCE_URL=jdbc:mysql://<HOST_IP>:3306/ecommerce
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=root

JWT_SECRET=<jwt_secret>
GOOGLE_CLIENT_ID=<google_client_id>
GOOGLE_CLIENT_SECRET=<google_client_secret>
```

The backend reads these values using `application.properties`.

---

## Running the Application (Docker)

### Prerequisites

* Docker Desktop installed and running
* MySQL running locally (or externally)

### Steps

```bash
# From project root
docker-compose up --build
```

* Backend: [http://localhost:8080](http://localhost:8080)
* Frontend: [http://localhost:3000](http://localhost:3000)

---

## 🛢 Database Setup (Local MySQL)

Ensure MySQL allows external connections:

```ini
bind-address=0.0.0.0
```

Grant access:

```sql
CREATE USER 'root'@'%' IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

---

## Testing

Basic manual testing was performed using Postman.

---

## Future Improvements

* Add unit and integration tests
* CI pipeline (GitHub Actions)

---

## Learning Outcomes

* Implemented real-world authentication flows (JWT + OAuth2)
* Learned Docker networking and environment configuration
* Gained experience debugging SSR/CSR issues in Next.js
* Understood secure secret management and GitHub push protection

---

## License

This project is for learning and demonstration purposes.
