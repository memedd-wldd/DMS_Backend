require("dotenv").config({ path: `.env` });
const cors = require("cors");
const express = require("express");
const app = express();

const http = require("http").Server(app);

// google login
const { OAuth2Client, UserRefreshClient } = require("google-auth-library");

/***********Socket IO*************** */
const io = require("socket.io")(http, { cors: "*" });

/***********Custom modules*************** */
const config = require("./src/config/config");
const connectDB = require("./src/v1/db/db-connection");
const Errors = require("./src/v1/helpers/error");
const {
  autoCreateDropDown,
  autoCreateRoles,
} = require("./src/v1/lib/autoCreate");
const authRoutes = require("./src/v1/routes/auth-routes");
const feedRoutes = require("./src/v1/routes/feed-routes");
const userRoutes = require("./src/v1/routes/user-routes");
const distributorRoute = require("./src/v1/routes/distributor-routes");
const commercialsRoutes = require("./src/v1/routes/commercials-routes");
const auditRoutes = require("./src/v1/routes/audit-logs");
const campaignRoutes = require("./src/v1/routes/campaign.routes");
const bundleRoutes = require("./src/v1/routes/bundle.routes");
const distributionPlanRoutes = require("./src/v1/routes/distributionPlan.routes");
const {
  PostingTrackerIO,
} = require("./src/v1/controllers/socketIO/PostingTrackerIO");

/**********PARSER SETUP************* */
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

/************Cors setup*************** */
app.use(cors());

/***************************************/

autoCreateRoles();
autoCreateDropDown();

/********************************/
app.use("/api/v1", authRoutes);
app.use("/api/v1", feedRoutes);
app.use("/api/v1", distributorRoute);
app.use("/api/v1", userRoutes);
app.use("/api/v1", commercialsRoutes);
app.use("/api/v1", auditRoutes);
app.use("/api/v1", campaignRoutes);
app.use("/api/v1", bundleRoutes);
app.use("/api/v1", distributionPlanRoutes);
app.use("/api/v1", require("./src/v1/routes/entity.routes"));
app.use("/api/v1", require("./src/v1/routes/posting-tracker.routes"));
app.use("/api/v1", require("./src/v1/routes/masterSheet.routes"));

/************Errors****************/
app.use(Errors);

exports.io = io;

PostingTrackerIO(io);

// google Login

const oAuth2Client = new OAuth2Client(
  "265540582453-i5d3i42uj0mj1m63sq0drg0d8qg6kqfk.apps.googleusercontent.com",
  "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",
  "postmessage"
);

app.post("/api/v1/auth/google", async (req, res) => {
  try {
    const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens
    console.log(tokens);

    res.json(tokens);
  } catch (err) {
    res.status(400).json({
      error: err,
    });
  }
});

app.post("/api/v1/auth/google/refresh-token", async (req, res) => {
  const user = new UserRefreshClient(
    "265540582453-i5d3i42uj0mj1m63sq0drg0d8qg6kqfk.apps.googleusercontent.com",
    "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",
    req.body.refreshToken
  );
  const { credentials } = await user.refreshAccessToken(); // optain new tokens
  res.json(credentials);
});

/****************DB and Server setup**********************/
connectDB()
  .then(() => {
    console.log("Connected to DB");
    http.listen(config.port, () => {
      console.log(
        `Server started on ${config.port} as ${process.env.NODE_ENV}`
      );
    });
    // app.listen(config.port, () => {
    //     console.log(
    //       `Server started on ${config.port} as ${process.env.NODE_ENV}`
    //     );
    //   });
  })
  .catch((err) => {
    console.error(err);
  });
