import { Hono } from "hono";
import userRoutes from "./routes/userRoutes";
import blogRoutes from "./routes/blogRoutes";
import { EnvBindings } from "./types/env";
import { Variables } from "./types/context";
import { cors } from "hono/cors";

const app = new Hono<{ Bindings: EnvBindings; Variables: Variables }>();
const api = new Hono<{ Bindings: EnvBindings; Variables: Variables }>();

app.use(cors());
api.route("/users", userRoutes);
api.route("/blogs", blogRoutes);

app.route("/api/v1", api);

export default app;
