import { Request, Response } from "../../deps.ts";
import { Router } from "npm:express@4";
import { z } from "../../deps.ts";
import type { PaginatedResponse, PaginationParams } from "../../lib/types.ts";
import { checkApiKey } from "../../lib/check-api-key.ts";

const router = Router();

const createTaskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(["pending", "in_progress", "completed"]),
  priority: z.enum(["low", "medium", "high"]).optional(),
});

router.post("/tasks", checkApiKey, (req: Request, res: Response) => {
  try {
    const result = createTaskSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "Invalid request body",
        details: result.error.errors,
      });
    }

    // For now, just echo back the task
    return res.status(201).json({
      id: crypto.randomUUID(),
      ...result.data,
      createdAt: new Date().toISOString(),
    });
  } catch (_error) {
    return res.status(400).json({
      error: "Invalid JSON",
    });
  }
});

// Zod schema for task
const taskSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(["pending", "in_progress", "completed"]),
  priority: z.enum(["low", "medium", "high"]).optional(),
  createdAt: z.string().datetime(),
});

type Task = z.infer<typeof taskSchema>;

// Mock data for demonstration
const mockTasks: Task[] = Array.from({ length: 50 }, (_, i) => ({
  id: crypto.randomUUID(),
  title: `Task ${i + 1}`,
  description: `Description for task ${i + 1}`,
  status: ["pending", "in_progress", "completed"][Math.floor(Math.random() * 3)] as Task["status"],
  priority: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as Task["priority"],
  createdAt: new Date().toISOString(),
}));

router.get("/tasks", checkApiKey, (req: Request<{}, {}, {}, PaginationParams>, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const totalRecords = mockTasks.length;
  const totalPages = Math.ceil(totalRecords / limit);

  const paginatedTasks = mockTasks.slice(startIndex, endIndex);

  const response: PaginatedResponse<Task> = {
    data: paginatedTasks,
    pagination: {
      total_records: totalRecords,
      current_page: page,
      total_pages: totalPages,
      next_page: page < totalPages ? page + 1 : null,
      prev_page: page > 1 ? page - 1 : null,
      has_more: page < totalPages,
    },
  };

  res.json(response);
});

export const tasksRouter = router;
