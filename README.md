
## Let's Chat (A Full-Stack Chat Application)

- This repository contains a full-stack chat application built using modern web technologies, adhering to best software practices and a modular approach.

### Overview

The chat application is designed for real-time messaging, featuring both one-on-one and group chat functionality. It is containerized for ease of deployment and scalability and utilizes a microservices architecture to decouple the frontend, backend, and other services.

### Key Technologies

- Frontend: **Next.js**
- Backend: **Node.js, Express**
- Database: **MongoDB**
- Real-time Communication: **WebSockets**
- Pub/Sub Mechanism: **Redis Pub/Sub**
- Containerization: **Docker**
- Cloud Deployment: **AWS ECR, ECS**
- CI/CD: **GitHub Actions**
- Hosting: **AWS EC2 Instance**

### Features

- **1:1 Messaging:** Users can engage in direct messaging with each other.
- **Group Messaging:** Users can create or join groups and participate in group chats.
- **Real-time Notifications:** Message notification popups are triggered for incoming messages to keep users engaged.
- **Persistent Authentication:** User sessions are stored in localStorage, preventing users from being logged out when they refresh the page.

### System Design and Architecture

**Microservices Architecture**
- The application follows a microservices-based architecture, with each service containerized for independent deployment and scalability. The major microservices include:

1) **Frontend:** Built with Next.js, this service handles all the user-facing components and connects to the backend for chat functionalities.
2) **Backend (Multiple Services):** The backend is composed of two microservices powered by Node.js and Express. Each backend service handles specific functionalities, such as authentication, messaging, and WebSocket handling.
3) **Redis Pub/Sub:** To handle the communication between users connected to different backend services, we use Redis Pub/Sub. This mechanism facilitates the sending and receiving of messages between different instances of the backend.

### Real-time Communication

- The chat functionality is powered by WebSockets, allowing users to communicate in real-time. This is achieved through:

**WebSockets:** WebSocket connections allow for real-time bi-directional communication between the client and the server.
Redis Pub/Sub: In scenarios where users are connected to different backend instances, Redis Pub/Sub ensures that messages are relayed correctly between the distributed nodes, addressing the issue of scaling the application horizontally.

### Scalability

Thanks to the Redis Pub/Sub mechanism, our application is designed to scale effortlessly. This ensures that as user demand increases, more instances of the backend services can be spun up without disrupting the communication between users.

### Deployment and CI/CD Pipeline

**Containerization**

- All services (frontend, backend, Redis) are containerized using Docker. This allows for consistent and portable deployment across different environments. Each microservice is defined with its own Dockerfile, ensuring that dependencies are well-managed and isolated.

### AWS ECR and ECS

- **AWS ECR (Elastic Container Registry):** All Docker images are pushed to AWS ECR for deployment. This ensures that the latest version of each microservice is always available in a secure and scalable container registry.

- **AWS ECS (Elastic Container Service):** The application is deployed and managed using ECS, which helps in scaling and orchestrating the containers. ECS enables us to run containerized services in a highly available manner across multiple EC2 instances.

### EC2 Instance for Container Hosting

- We have deployed the application on an EC2 instance, running all the Docker containers inside the instance. This setup serves as the production environment for the application and allows us to test all services end-to-end.

### CI/CD Pipeline

- **GitHub Actions:** CI/CD has been implemented for one of the microservices (frontend). This pipeline is designed to automate the process of building, testing, and deploying the frontend service. The CI/CD pipeline can easily be extended to the other microservices by replicating the workflow configurations.

### Challenges Solved

- **Handling Communication Between Distributed Backends:** With Redis Pub/Sub, users can connect to different backend instances while still being able to communicate seamlessly. Redis handles the relaying of messages between the nodes.

- **Scalability:** The architecture is highly scalable, with Redis Pub/Sub handling the distribution of messages and ECS managing container orchestration. The application can handle growing user traffic with minimal disruption.

- **Persistent User Sessions:** Storing the logged-in user in localStorage allows for smoother user experience by preventing session drops after page refreshes.
