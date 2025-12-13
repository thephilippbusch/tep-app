# Celebry Web

The web application for the Celebry Event Planner built via React Router (Remix)

## Getting Started

### Installation

Install the dependencies:

```bash
bun install
```

### Development

Start the development server with HMR:

```bash
moon iade-web:dev
```

Your application will be available at `http://localhost:3000`.

## Building for Production

Create a production build:

```bash
moon iade-web:build
```

## Docker

To build and run using Docker:

```bash
moon iade-web:docker/build

# Run the container
docker run -p 3000:3000 my-app
```

## Styling

This application uses [Tailwind CSS](https://tailwindcss.com/).
