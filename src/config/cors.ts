import cors from "cors";

export const corsConfig = cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ['Access-Control-Allow-Headers',"Content-Type", "Authorization"],
});
