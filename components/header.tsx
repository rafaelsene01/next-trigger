"use client";

import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import Link from "next/link";
import { getOnlineUsers, heartbeat } from "@/app/actions/userCount";
import { useEffect, useState } from "react";
import { getFingerprintJS } from "@/hooks/useFingerprint";

export default function Header() {
  const [online, setOnline] = useState<number>(0);
  const [userId, setUserId] = useState<string>("");
  const [visitorId, setVisitorId] = useState("");

  useEffect(() => {
    const updateUserId = async () => {
      const { visitorId } = await getFingerprintJS();
      setUserId(visitorId);
    };

    const updateCount = async () => {
      await heartbeat(userId);
      const count = await getOnlineUsers();
      setOnline(count);
    };

    updateUserId();
    updateCount();
    const interval = setInterval(updateCount, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    (async () => {
      const { visitorId } = await getFingerprintJS();
      setVisitorId(visitorId);
    })();
  }, []);

  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{
        backgroundColor: "#f9f9f9",
        color: "#333",
      }}
    >
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Link
            href="/"
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <Typography variant="subtitle1" fontWeight="medium">
              TikTok Audio
            </Typography>
          </Link>
        </Box>

        <Typography
          variant="body2"
          sx={{
            display: { xs: "none", sm: "block" },
            mr: 2,
            fontSize: "0.85rem",
            color: "#777",
          }}
        >
          ID: {visitorId} | Usuários online: {online}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
