import axios from "axios";
import express from "express";

const app = express();
const appRouter = express.Router();

appRouter.get("/image/random", async (req, res) => {
   try {
      const { data } = await axios.get(
         "https://api.unsplash.com/photos/random/?client_id=_DDIVJSgdK-GI1wA3aHOtxC9YTt8tCY6-4jMk7guznY"
      );

      if (!data) {
         throw new Error("Failed to get image");
      }

      res.status(200).json({
         message: "Random image",
         img: data?.urls?.full,
      });
   } catch (err) {
      console.log(err);

      res.status(500).json({
         message: "Failed to generate random image",
         error: err,
      });
   }
});

app.use("/api", appRouter);

app.listen(3000, () => {
   console.log(`Server running on PORT: 3000`);
});
