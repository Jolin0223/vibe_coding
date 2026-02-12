# Jolin's Vibe Coding World

This is a Next.js application for showcasing Vibe Coding projects.

## Setup

1.  Navigate to the directory:
    ```bash
    cd vibecoding
    ```
2.  Install dependencies (if not already done):
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000).

## Admin Access

-   **Login URL:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
-   **Username:** `Jolin0223`
-   **Password:** `fighting2026`

## Deployment

To make this site public at `vibecoding.chenjialing.com`:

1.  **Build the project:**
    ```bash
    npm run build
    ```
2.  **Start the server:**
    ```bash
    npm start
    ```
3.  **Domain Configuration:**
    -   Point your domain `vibecoding.chenjialing.com` to the IP address of the server where this code is running.
    -   Use Nginx or Apache as a reverse proxy to port 3000.

## Features

-   **Homepage:** Displays all projects with view counts.
-   **Admin Dashboard:** Upload project images and HTML files securely.
-   **Data Storage:** Projects are saved in `data/projects.json`. Uploads are in `public/uploads`.
