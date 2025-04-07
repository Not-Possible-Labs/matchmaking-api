import { Router } from "npm:express@4";
import { Request, Response } from "../../deps.ts";
import { healthApiSpec } from "./health.api.ts";

const router = Router();

router.get("/healthcheck", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

export { healthApiSpec };
export default router;
