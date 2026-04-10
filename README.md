# TaskFlow - Premium Task Manager

A full-stack task management application built with Node.js, Express, and Vanilla JavaScript/CSS. This project follows the "Full Stack Developer Technical Assignment" requirements.

## Features

- **Core Functionality**: Create, View, Update (Complete), and Delete tasks.
- **Filtering**: Filter tasks by status (All, Active, Completed).
- **Premium UI**: Modern dark-themed interface with glassmorphism, responsive design, and smooth animations.
- **API Driven**: Communicates with a RESTful backend.

## Tech Stack

- **Backend**: Node.js, Express
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **API**: RESTful endpoints
- **Data Model**: { id, title, completed, createdAt }

## Getting Started

### Prerequisites

- Node.js installed on your system.

### Installation

1. Clone or extract the project.
2. Open a terminal in the project root.
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

1. Start the server:
   ```bash
   npm start
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## Assumptions & Trade-offs

- **Persistence**: Used in-memory storage for the backend to keep the solution small and focused on API design, as permitted by the technical notes.
- **Styling**: Prioritized a "Premium" feel using modern CSS features like backdrop-filter and CSS variables, while keeping the external dependency count to zero.
- **Structure**: Combined the static file server and API server for deployment simplicity.
