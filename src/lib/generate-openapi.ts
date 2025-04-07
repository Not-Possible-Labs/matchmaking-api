import type { Route, OpenAPIPath } from "./types.ts";

export function generateOpenAPI(config: {
  info: {
    title: string;
    version: string;
    description?: string;
  };
  servers?: Array<{
    url: string;
    description?: string;
  }>;
  tags?: Array<{
    name: string;
    description?: string;
  }>;
  routes: Route[];
}): {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  servers?: Array<{
    url: string;
    description?: string;
  }>;
  tags?: Array<{
    name: string;
    description?: string;
  }>;
  paths: OpenAPIPath;
} {
  const { info, servers, tags, routes } = config;

  const paths: OpenAPIPath = {};

  routes.forEach((route) => {
    const { method, path } = route;

    if (!paths[path]) {
      paths[path] = {};
    }

    paths[path][method] = {
      tags: ["Default"],
      summary: "Default operation",
      responses: {
        200: {
          description: "Success",
        },
      },
    };
  });

  return {
    openapi: "3.0.0",
    info,
    servers,
    tags,
    paths,
  };
}
