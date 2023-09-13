import express from "express";
import morgan from "morgan";

import { logger } from "./middleware/logger.js";
import { router as courses } from "./routes/courses.js";

const app = express();

app.use(express.json());

console.log("NODE_ENV: ", process.env.NODE_ENV);
console.log("app env: ", app.get("env"));

if (app.get("env") === "development") {
    app.use(morgan("dev"));
    app.use(logger);
}

app.use("/api/courses", courses);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
