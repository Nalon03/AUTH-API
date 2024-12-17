import express from "express";
import { AppDataSource } from "./config/db";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import { corsConfig } from "./config/cors";
import { env } from "./config/env";
import { initializeRoles } from "./utils/roleInitializer";
import { authenticateToken, authorizeAdmin } from "./middleware/authMiddleware";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(express.json());
app.use(corsConfig);

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/admin", authenticateToken, authorizeAdmin, adminRoutes);

AppDataSource.initialize()
  .then(async () => {
    console.log("Database connected");
    await initializeRoles();
    app.listen(env.PORT, () =>
      console.log(`Server running on port ${env.PORT}`)
    );
  })
  .catch((error) => console.error("Database connection error:", error));
