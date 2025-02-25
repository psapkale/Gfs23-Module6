import express from "express";

const app = express();
const apiRouter = express.Router();

apiRouter.use((req, res, next) => {
   const start = Date.now();
   const timeStamp = new Date().toISOString();
   const logData = {
      method: req.method,
      url: req.originalUrl,
      timeStamp,
   };

   console.log(
      `[${logData.timeStamp}] method:${logData.method} url:${logData.url} - Req received`
   );

   res.on("finish", () => {
      const duration = Date.now() - start;

      console.log(
         `[${logData.timeStamp}] method:${logData.method} url:${logData.url} - Completed in ${duration}ms`
      );
   });

   next();
});

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
