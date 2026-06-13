# Podman Generator

This project is a Next.js application designed to facilitate the generation of Podman-related configurations or artifacts. It provides a user-friendly interface to streamline the process of creating and managing Podman environments.

## Features

*   **Next.js**: A React framework for building performant web applications.
*   **React**: A JavaScript library for building user interfaces.
*   **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
*   **Biome**: A fast formatter and linter for JavaScript, TypeScript, and JSON.
*   **Containerization**: Ready for deployment with Docker/Podman using the provided `Dockerfile`.
*   **LZ-String**: For efficient string compression/decompression, likely used for sharing or storing configurations.

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

Make sure you have the following installed:

*   Node.js (LTS version recommended)
*   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/podman-generator.git
    cd podman-generator
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Development Server

To start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Available Scripts

In the project directory, you can run:

*   `npm run dev`: Starts the development server.
*   `npm run build`: Builds the application for production.
*   `npm run start`: Starts a production-ready server after building.
*   `npm run lint`: Runs Biome linter to check for code quality issues.
*   `npm run format`: Runs Biome formatter to automatically format code.

## Deployment

This application can be easily containerized using Docker or Podman. A `Dockerfile` is provided for building a production-ready image.

To build the Docker/Podman image:

```bash
docker build -t podman-generator .
# or
podman build -t podman-generator .
```

To run the container:

```bash
docker run -p 3000:3000 podman-generator
# or
podman run -p 3000:3000 podman-generator
```