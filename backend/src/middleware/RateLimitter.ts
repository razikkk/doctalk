import { Request, Response } from "express";
import rateLimit from "express-rate-limit";

const limitter = rateLimit({
  windowMs: 60 * 1000, //15min
  max: 10,
  handler: (req: Request, res: Response) => {
    res
      .status(429)
      .json({ success: false, message: "Too many request, please try again" });
  },
});

export default limitter;
