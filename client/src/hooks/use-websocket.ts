import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { queryClient } from "@/lib/queryClient";

export function useWebSocket() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}`;
    
    const socket = io(wsUrl, {
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("WebSocket connected");
    });

    socket.on("disconnect", () => {
      console.log("WebSocket disconnected");
    });

    // Listen for real-time updates
    socket.on("match:score", () => {
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
    });

    socket.on("match:updated", () => {
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
    });

    socket.on("match:completed", () => {
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
    });

    socket.on("teams:updated", () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
    });

    socket.on("players:updated", () => {
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
    });

    socket.on("event:created", () => {
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
    });

    socket.on("sport:created", () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sports"] });
    });

    socket.on("team:created", () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
    });

    socket.on("player:created", () => {
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
    });

    socket.on("match:created", () => {
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return socketRef.current;
}
