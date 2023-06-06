import express from "express";
import cors from "cors";

import ontologiesAPI from "./routes/ontologies";

const app = express();

(async () => {
  try {
    app.set("PORT", process.env.PORT || 3040);
    app.use(cors());
    app.use(express.json());
    app.use("/api/v1/records", ontologiesAPI);

    app.listen(app.get("PORT"), () =>
      console.log(`Server ready at http://localhost:${app.get("PORT")}`)
    );
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
})();
