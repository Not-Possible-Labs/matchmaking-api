import type { OpenAPIPath } from "../../lib/types.ts";

export const healthApiSpec: OpenAPIPath = {
  "/healthcheck": {
    get: {
      tags: ["Health"],
      summary: "Health check endpoint",
      responses: {
        "200": {
          description: "Server is healthy",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string" },
                  timestamp: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
      },
    },
  },
};
