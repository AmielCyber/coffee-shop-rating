import express, { Express, Request, Response, NextFunction } from "express"; // THE node.js Framework
import * as dotenv from "dotenv"; // Loads environment variables from a .env file onto process.env
// My imports.
import HttpError from "./models/http-error.js";

// Configurations.
// Config node to use env variables in the .env.local file.
dotenv.config({ path: "./.env.local" });
// Server port.
const PORT = 5050;
// Create an express application
const app: Express = express();
// Add middleware to parse JSON data.
app.use(express.json());

// Register middleware to have access to our backend calls from our frontend.
// Request, Response, Next

app.use((req: Request, res: Response, next: NextFunction) => {
  // Add headers to respond.
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allows which domains have access.
  // Specified which headers are allowed
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,, X-Requested-With, Content-Type, Accept, Authorization"
  ); // Controls which headers which incoming request are handle.

  // Control which HTTP methods may be used by the application using our APIs.
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  // Continue to next middleware.
  next();
});

// Register route middleware.
app.use("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("HELLO");
});

// Register middleware that does not get response such as unsupported routes.
app.use(() => {
  throw new HttpError("Could not find this route.", 404);
});

// Register middleware that catches any errors thrown.
app.use(
  (
    error: Error | HttpError,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (res.headersSent) {
      // Forward the error if we have already sent an error.
      return next(error);
    }
    // Error or something went wrong status code
    let errorCode;
    if ("code" in error) {
      errorCode = error.code;
    } else {
      errorCode = 500;
    }
    res
      .status(errorCode)
      .json({ message: error.message || "An unknown error occurred!" });
  }
);

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});

// Establish connection with MongoDB.
//mongoose
//.set("strictQuery", false)
//.connect(
//`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}.mongodb.net/${process.env.DB_NAME}?${process.env.DB_OPTIONS}`
//)
//.then(() => {
//// If DB connection is successful then start our server.
//app.listen(PORT);
//})
//.catch((err) => {
//// Display error in starting up our server.
//console.error(err);
//});
