import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuthStore } from "../store/useAuthStore";

export const useSocket = () => {
  const { isAuthenticated } = useAuthStore();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Build backend base URL from API URL (remove trailing "/api")
    const backendUrl =
      import.meta.env.VITE_API_URL?.replace(/\/api$/, "") ||
      "http://localhost:5000";
    socketRef.current = io(backendUrl, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      console.log("Socket.IO connected");
    });

    socketRef.current.on("disconnect", () => {
      console.log("Socket.IO disconnected");
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [isAuthenticated]);

  return socketRef.current;
};
