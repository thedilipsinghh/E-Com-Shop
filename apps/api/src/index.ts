import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env, PRODUCTION } from "./config/env";

// Routes
import apiRoutes from "./routes/index";

// Security
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";

// Compression
import compression from "compression";

const app = express();

// Security headers
app.use(helmet());

// Compression
app.use(compression());

// Rate limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use("/api", limiter);

// Prevent parameter pollution
app.use(hpp());

// Body parser
app.use(express.json({ limit: "10kb" }));

app.use(cookieParser());

app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true,
}));

// Routes
app.use("/api", apiRoutes);

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "API running successfully" });
});

// 404
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

if (env.NODE_ENV !== PRODUCTION) {
    app.listen(env.PORT, () => {
        console.log(`Server running on port ${env.PORT}`);
    });
}

export default app;