const { Server } = require("socket.io");
const db = require("../config/db");

let io;

// STORE ONLINE USERS
const onlineUsers = new Map();

const initSocket = (server) => {

  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
    }
  });

  io.on("connection", (socket) => {

    console.log("Socket Connected:", socket.id);

    // =====================================================
    // USER ONLINE
    // =====================================================
    socket.on("user-online", async (user_id) => {

      try {

        if (!user_id) return;

        const id = String(user_id);

        onlineUsers.set(id, socket.id);

        socket.user_id = id;

        await db.execute(
          `
          UPDATE users
          SET is_online = 1
          WHERE id = ?
          `,
          [id]
        );

        io.emit(
          "online-users",
          Array.from(onlineUsers.keys())
        );

        console.log("User Online:", id);

      } catch (error) {

        console.log("user-online error:", error);

      }
    });

    // =====================================================
    // JOIN DESIGN ROOM
    // =====================================================
    socket.on("join-design", ({ design_id, user }) => {

      try {

        if (!design_id) return;

        const room = `design-${design_id}`;

        socket.join(room);

        console.log(
          `${user?.name || "User"} joined ${room}`
        );

        socket.to(room).emit("member-joined", {
          user
        });

      } catch (error) {

        console.log("join-design error:", error);

      }
    });

    // =====================================================
    // LEAVE DESIGN ROOM
    // =====================================================
    socket.on("leave-design", ({ design_id, user }) => {

      try {

        if (!design_id) return;

        const room = `design-${design_id}`;

        socket.leave(room);

        socket.to(room).emit("member-left", {
          user
        });

      } catch (error) {

        console.log("leave-design error:", error);

      }
    });

    // =====================================================
    // REALTIME DESIGN UPDATE
    // =====================================================
    socket.on("design-update", (data) => {

      try {

        if (!data?.design_id) return;

        const room = `design-${data.design_id}`;

        socket.to(room).emit(
          "receive-design-update",
          data
        );

      } catch (error) {

        console.log("design-update error:", error);

      }
    });

    // =====================================================
    // CURSOR MOVE
    // =====================================================
    socket.on("cursor-move", (data) => {

      try {

        if (!data?.design_id) return;

        const room = `design-${data.design_id}`;

        socket.to(room).emit(
          "receive-cursor",
          data
        );

      } catch (error) {

        console.log("cursor-move error:", error);

      }
    });

    // =====================================================
    // SAVING DESIGN
    // =====================================================
    socket.on("saving-design", ({ design_id, user_id }) => {

      try {

        if (!design_id) return;

        const room = `design-${design_id}`;

        socket.to(room).emit(
          "saving-design",
          {
            design_id,
            user_id,
            saving: true
          }
        );

        console.log("Saving Design:", design_id);

      } catch (error) {

        console.log("saving-design error:", error);

      }
    });

    // =====================================================
    // DESIGN SAVED
    // =====================================================
    socket.on(
      "design-saved",
      ({
        design_id,
        user_id,
        updated_at
      }) => {

        try {

          if (!design_id) return;

          const room = `design-${design_id}`;

          io.to(room).emit(
            "design-saved",
            {
              design_id,
              user_id,
              updated_at: updated_at || new Date(),
              saving: false
            }
          );

          console.log("Design Saved:", design_id);

        } catch (error) {

          console.log("design-saved error:", error);

        }
      }
    );

    // =====================================================
    // SAVE ERROR
    // =====================================================
    socket.on(
      "design-save-error",
      ({
        design_id,
        user_id,
        message
      }) => {

        try {

          if (!design_id) return;

          const room = `design-${design_id}`;

          io.to(room).emit(
            "design-save-error",
            {
              design_id,
              user_id,
              message:
                message || "Design save failed",
              saving: false
            }
          );

        } catch (error) {

          console.log(
            "design-save-error error:",
            error
          );

        }
      }
    );

    // =====================================================
    // DISCONNECT
    // =====================================================
    socket.on("disconnect", async () => {

      try {

        console.log(
          "Disconnected:",
          socket.id
        );

        if (!socket.user_id) return;

        onlineUsers.delete(
          String(socket.user_id)
        );

        await db.execute(
          `
          UPDATE users
          SET
            is_online = 0,
            last_seen = NOW()
          WHERE id = ?
          `,
          [socket.user_id]
        );

        io.emit(
          "online-users",
          Array.from(
            onlineUsers.keys()
          )
        );

      } catch (error) {

        console.log(
          "disconnect error:",
          error
        );

      }
    });

  });

  return io;
};

const getIO = () => {

  if (!io) {

    throw new Error(
      "Socket.io not initialized"
    );

  }

  return io;
};

module.exports = {
  initSocket,
  getIO
};