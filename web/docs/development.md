# Development Guide

This guide provides instructions for setting up and running the project, as well as an overview of the project structure.

## Getting Started

### Prerequisites

* Node.js (v16 or later)
* npm (v8 or later)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd web
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server, run the following command:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Project Structure

The project is organized into the following directories:

* `docs`: Contains documentation files.
* `public`: Contains static assets that are not processed by the build system.
* `src`: Contains the main source code of the application.
  * `assets`: Contains static assets such as images and fonts.
  * `components`: Contains reusable UI components.
  * `layout`: Contains the main application layout.
  * `pages`: Contains the different pages of the application.
  * `router`: Contains the routing configuration.

## Available Scripts

In the project directory, you can run:

* `npm run dev`: Runs the app in the development mode.
* `npm run build`: Builds the app for production to the `dist` folder.
* `npm run lint`: Lints the code using ESLint.
* `npm run preview`: Serves the production build locally for previewing.