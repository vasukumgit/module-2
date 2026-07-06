const express = require("express");
const cors = require("cors");
const http = require("http");

const path=require("path");

require("dotenv").config();
require("./config/cloudinary");

// Auth routes
const authRoutes = require("./routes/authRoutes");

// Dashboard routes
const notificationRoutes = require("./routes/dashboard/notificationRoutes");
const designRoutes = require("./routes/dashboard/designRoutes");
const trashRoutes = require("./routes/dashboard/trashRoutes");
const projectsRoutes = require("./routes/dashboard/projectsRoutes");
const templateRoutes = require("./routes/dashboard/templateRoutes");
const searchRoutes = require("./routes/dashboard/searchRoutes");
const profileRoutes = require("./routes/dashboard/profileRoutes");
const dashboardStarredRoutes = require("./routes/dashboard/starredRoutes");


// Account Center routes
const appSettingRoutes = require("./routes/AccountCenter/appSettingRoutes");
const aboutRoutes = require("./routes/AccountCenter/aboutRoutes");
const profileSettingRoutes = require("./routes/AccountCenter/profileSettingRoutes");
const teamRoutes = require("./routes/AccountCenter/teamRoutes");

// Editor routes
const editorRoutes = require("./routes/editor/editorRoutes");
const collaborationRoutes = require("./routes/editor/collaborationRoutes");
// Object routes
const chartTableRoutes = require("./routes/editor/objectpanel/objects/chartTableRoutes");
const objectsRoutes = require("./routes/editor/objectpanel/objects/objectsRoutes");
const recentRoutes = require("./routes/editor/objectpanel/objects/recentRoutes");
const photoRoutes = require("./routes/editor/objectpanel/objects/photoRoutes");
const graphicRoutes = require("./routes/editor/objectpanel/objects/graphicRoutes");
const shapeRoutes = require("./routes/editor/objectpanel/objects/shapeRoutes");

const cloudStatusRoutes = require("./routes/editor/cloudStatusRoutes");
const editortoolsRoutes = require("./routes/editor/editorToolRoutes");
const exportRoutes = require("./routes/editor/exportRoutes");

// object panel routes
const assetRoutes = require("./routes/editor/objectpanel/assets/assetRoutes");
const folderRoutes = require("./routes/editor/objectpanel/assets/folderRoutes");

const editorStarredRoutes = require("./routes/editor/objectpanel/starred/starredRoutes");
const editortemplateRoutes = require("./routes/editor/objectpanel/template/editortemplateRoutes");
const textStyleRoutes = require("./routes/editor/objectpanel/style/textStyleRoutes");

const errorHandler = require("./middleware/errorHandler");

// ✅ MODULE 3 SOCKET
// Use only ONE socket manager file for all realtime work:
// online/offline, design saving status, cursor, design update.
const { initSocket } = require("./sockets/socketManager");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);
 

app.get("/", (req, res) => {
  res.send("Backend is working without MySQL!");
});

// Auth
app.use("/api/auth", authRoutes);

// Dashboard
app.use("/api/notifications", notificationRoutes);
app.use("/api/designs", designRoutes);
app.use("/api/trash", trashRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/profile", profileRoutes);
// app.use("/api/starred", dashboardStarredRoutes);


// Account Center
app.use("/api/appsetting", appSettingRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api", profileSettingRoutes);
app.use("/api/team", teamRoutes);

// Editor
app.use("/api/collaboration", collaborationRoutes);

app.use("/api/editor", editorRoutes);

app.use("/api/objects", objectsRoutes);
app.use("/api/recent", recentRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/graphics", graphicRoutes);
app.use("/api/shapes", shapeRoutes);
app.use("/api/chart-table", chartTableRoutes);

app.use("/api/cloud-status", cloudStatusRoutes);
app.use("/api/editor-tool", editortoolsRoutes);

app.use("/api/export", exportRoutes);

// Object Panel
app.use("/api/assets", assetRoutes);
app.use("/api/folders", folderRoutes);

app.use("/api/starred", editorStarredRoutes);
app.use("/api/editor_templates", editortemplateRoutes);
app.use("/api/text-styles", textStyleRoutes);

// Error handler
app.use(errorHandler);

// ✅ MODULE 3 SOCKET INIT
// Initialize socket only once.
const socketIO = initSocket(server);

// Make io available in controllers using req.app.get("io")
app.set("io", socketIO);

// Start server
const PORT = process.env.PORT || 5050;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});