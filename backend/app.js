import express from "express";
import errorHandler from "./handlers/error-handler.js";
import cors from "cors";
import photoRoutes from "./routes/photo-routes.js";
import joueurRoutes from "./routes/joueur-route.js";
const app = express();

app.use(cors());
//Parse le code entrant pour ajouter une propriété body sur la request
app.use(express.json());

app.use("/api/photos", photoRoutes);
app.use("/api/joueurs", joueurRoutes);

app.use((req, res, next) => {
  const error = new Error("Route non trouvée");
  error.code = 404;
  next(error);
});

app.use(errorHandler);

app.listen(8000, () => {
  console.log("serveur écoute au", `http://localhost:8000`);
});
