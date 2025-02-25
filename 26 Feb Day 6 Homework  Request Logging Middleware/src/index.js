import express from "express";
import morgan from "morgan";

const app = express();
const apiRouter = express.Router();

morgan.token("timestamp", () => new Date().toISOString());
morgan.token("response-time-ms", (req, res) => {
   return `${(Date.now() - req._startTime).toFixed(2)}ms`;
});

app.use((req, res, next) => {
   req._startTime = Date.now();
   next();
});

app.use(morgan("[:timestamp] :method :url - Completed in :response-time-ms"));

apiRouter.get("/users", (req, res) => {
   const users = [
      {
         id: 1,
         name: "Joe Dane",
      },
      {
         id: 2,
         name: "Jane Ramsey",
      },
      {
         id: 3,
         name: "Sean Mathews",
      },
   ];

   res.status(200).json({
      message: "Users api",
      users,
   });
});

apiRouter.get("/users-with-delay", (req, res) => {
   const users = [
      {
         id: 1,
         name: "Joe Dane",
      },
      {
         id: 2,
         name: "Jane Ramsey",
      },
      {
         id: 3,
         name: "Sean Mathews",
      },
   ];

   setTimeout(() => {
      res.status(200).json({
         message: "Users api",
         users,
      });
   }, 1800);
});

app.use("/api", apiRouter);

app.listen(5000, () => {
   console.log("Server running on PORT: 5000");
});
