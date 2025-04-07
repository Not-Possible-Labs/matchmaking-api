import type { OpenAPIPath, OpenAPIDocument } from "../../lib/types.ts";

const TasksGetRoute: OpenAPIPath = {
  "/tasks": {
    get: {
      tags: ["Tasks"],
      summary: "Get paginated list of tasks",
      security: [{ "apiKey": [] }],
      parameters: [
        {
          name: "api-key",
          in: "header",
          description: "API key for authentication",
          required: true,
          schema: {
            type: "string"
          }
        },
        {
          name: "page",
          in: "query",
          description: "Page number (starts from 1)",
          required: false,
          schema: {
            type: "integer",
            format: "int32",
            nullable: true,
          },
        },
        {
          name: "limit",
          in: "query",
          description: "Number of items per page (max 100)",
          required: false,
          schema: {
            type: "integer",
            format: "int32",
            nullable: true,
          },
        },
      ],
      responses: {
        "200": {
          description: "List of tasks with pagination metadata",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string", format: "uuid" },
                        title: { type: "string" },
                        description: { type: "string", nullable: true },
                        status: { type: "string", enum: ["pending", "in_progress", "completed"] },
                        priority: { type: "string", enum: ["low", "medium", "high"], nullable: true },
                        createdAt: { type: "string", format: "date-time" },
                      },
                      required: ["id", "title", "status", "createdAt"],
                    },
                  },
                  pagination: {
                    type: "object",
                    properties: {
                      total_records: { type: "integer" },
                      current_page: { type: "integer" },
                      total_pages: { type: "integer" },
                      next_page: { type: "integer", nullable: true },
                      prev_page: { type: "integer", nullable: true },
                      has_more: { type: "boolean" },
                    },
                    required: ["total_records", "current_page", "total_pages", "next_page", "prev_page", "has_more"],
                  },
                },
                required: ["data", "pagination"],
              },
            },
          },
        },
      },
    },
  },
};

const TasksPostRoute: OpenAPIPath = {
  "/tasks": {
    post: {
      tags: ["Tasks"],
      summary: "Create a new task",
      security: [{ "apiKey": [] }],
      parameters: [
        {
          name: "api-key",
          in: "header",
          description: "API key for authentication",
          required: true,
          schema: {
            type: "string"
          }
        }
      ],
      description: "Creates a new task with the provided details",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                title: {
                  type: "string",
                  description: "The title of the task",
                },
                description: {
                  type: "string",
                  description: "Detailed description of the task",
                },
                status: {
                  type: "string",
                  enum: ["pending", "in_progress", "completed"],
                  description: "Current status of the task",
                },
                priority: {
                  type: "string",
                  enum: ["low", "medium", "high"],
                  description: "Priority level of the task",
                },
              },
              required: ["title", "status"],
            },
            examples: {
              "Simple Task": {
                value: {
                  title: "Complete project documentation",
                  status: "pending",
                },
                summary: "Minimal task with required fields",
              },
              "Full Task": {
                value: {
                  title: "Write API documentation",
                  description: "Create comprehensive documentation for all API endpoints",
                  status: "in_progress",
                  priority: "high",
                },
                summary: "Task with all fields",
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Task created successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  title: { type: "string" },
                  description: { type: "string" },
                  status: { type: "string" },
                  priority: { type: "string" },
                  createdAt: { type: "string", format: "date-time" },
                },
              },
              examples: {
                "Created Task": {
                  value: {
                    id: "task_123",
                    title: "Write API documentation",
                    description: "Create comprehensive documentation for all API endpoints",
                    status: "in_progress",
                    priority: "high",
                    createdAt: "2025-03-29T19:02:14Z",
                  },
                  summary: "Example of created task",
                },
              },
            },
          },
        },
        400: {
          description: "Invalid request body",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string" },
                },
              },
              examples: {
                "Missing Title": {
                  value: {
                    error: "Title is required",
                  },
                  summary: "Error when title is missing",
                },
                "Invalid Status": {
                  value: {
                    error: "Valid status is required",
                  },
                  summary: "Error when status is invalid",
                },
              },
            },
          },
        },
      },
    },
  },
};

// Combine all operations into a single API spec
const securitySchemes = {
  apiKey: {
    type: "apiKey",
    name: "api-key",
    in: "header",
    description: "API key for authentication. Can be provided via 'api-key' header or 'Authorization: APIKey <key>' header"
  }
};

export const tasksApiSpec: OpenAPIDocument = {
  paths: {
    "/tasks": {
      ...TasksGetRoute["/tasks"],
      ...TasksPostRoute["/tasks"]
    }
  },
  components: {
    securitySchemes
  }
};
