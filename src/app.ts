import cors from "cors";
import routes from "./routes";
import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import notFoundHandler from "./middlewares/notFoundHandler";
import { envConfig } from "./configs/envConfig";

const app: Application = express();

app.use(
  cors({
    origin: envConfig.BASE_URL.FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("💳 Digital Wallet API is running...");
});

app.use("/api/v1", routes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
