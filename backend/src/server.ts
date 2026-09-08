import app from "./app.js";
import { PORT } from "./config/env.js";

app.listen(PORT, () => {
  console.log(`BookLoop API running on port ${PORT}`);
});