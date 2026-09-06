import app from "./app";
import { PORT } from "./config/env";

app.listen(PORT, () => {
  console.log(`BookLoop API running on port ${PORT}`);
});