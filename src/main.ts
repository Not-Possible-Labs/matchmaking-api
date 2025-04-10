// Import Express and Scalar
import { express, serve, setup, morgan } from "./deps.ts";
import healthRouter, { healthApiSpec } from "./routes/health/health.routes.ts";
import { tasksRouter } from "./routes/tasks/tasks.routes.ts";
import { tasksApiSpec } from "./routes/tasks/tasks.api.ts";
import { apiReference } from "@scalar/express-api-reference";
import { initDatabase } from "./lib/check-db-connection.ts";
//import { swaggerDoc } from "https://deno.land/x/deno_swagger_doc@releavev2.0.1/mod.ts";

// Get port from environment variable or default to 8000
const port = Deno.env.get("PORT") ? parseInt(Deno.env.get("PORT")!) : 8000;
const host = Deno.env.get("HOST") || "http://localhost:8000";
const env = Deno.env.get("NODE_ENV") || "dev";

const app = express();

// Configure middleware
app.use(express.json());
app.use(morgan("dev")); // Add request logging

// Root route redirect to API documentation
app.get("/", (_req, res) => {
  res.redirect("/api-docs");
});

// Mount routers
app.use(healthRouter);
app.use(tasksRouter);

// OpenAPI configuration
const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Matchmaking API",
    version: "1.0.0",
    description: "A simple REST API built with Deno and Express",
  },
  servers:
    env === "local"
      ? [
        {
          url: "http://localhost:8000",
          description: "Local Dev Server",
        },
      ]
      : [
        {
          url: host,
          description: "Production Server",
        },
      ],
  tags: [
    {
      name: "Health",
      description: "Health check endpoints",
    },
    {
      name: "Tasks",
      description: "Task management endpoints",
    },
  ],
  components: {
    securitySchemes: {
      apiKey: {
        type: "apiKey",
        name: "api-key",
        in: "header",
        description: "API key for authentication. Can be provided via 'api-key' header or 'Authorization: APIKey <key>' header",
      },
    },
  },
  paths: {
    ...healthApiSpec,
    ...tasksApiSpec.paths,
  },
};

// Serve OpenAPI spec
app.get("/api-docs/json", (_req, res) => {
  res.json(openApiSpec);
});

app.use(
  "/api-docs",
  apiReference({
    spec: {
      url: "/api-docs/json",
    },
    theme: "default",
    layout: "classic",
  })
);

// Serve OpenAPI spec for Swagger
app.get("/swagger.json", (_req, res) => {
  res.json(openApiSpec);
});

// Swagger UI options
const swaggerUIOptions = {
  explorer: true,
  swaggerOptions: {
    tryItOutEnabled: true,
    urls: [
      {
        url: "/swagger.json",
        name: "API Documentation",
      },
    ],
  },
};

// Serve Swagger UI at /swagger-docs
app.use("/swagger-docs", serve, setup(openApiSpec, swaggerUIOptions));

// Start the server
const startServer = async () => {
  try {
    // Initialize database connection
    await initDatabase();

    app.listen(port, () => {
      const baseUrl = env === "local" ? `http://localhost:${port}` : host;
      console.log("\x1b[32m%s\x1b[0m", `✨ Server running at ${baseUrl}`);
      console.log("\x1b[36m%s\x1b[0m", `📚 API Documentation available at ${baseUrl}/api-docs`);
      console.log("\x1b[36m%s\x1b[0m", `📚 Swagger UI available at ${baseUrl}/swagger-docs`);
    });
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", "Failed to start server:", error);
    Deno.exit(1);
  }
};

startServer();
