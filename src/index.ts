import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import swaggerUi from "swagger-ui-express";

import { connectToDatabase } from "./lib/db";
import router from "./routes";

const app = express();
dotenv.config();
const swaggerDocument = require("../public/swagger.json");

const PORT = process.env.PORT || 3333;

app.use(
  cors({
    origin: "*",
  }),
);
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.json());
app.use(express.static("public"));

app.use("/api/v1", router);
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

connectToDatabase()
  .then(() => {
    app.emit("ready");
  })
  .catch(error => {
    console.log(error);
  });

app.on("ready", () => {
  app.listen(PORT, () => {
    console.log(
      `Server running on port ${PORT}. Access http://localhost:${PORT} to see the documentation.`,
    );
  });
});
