"use client";

import { getOnlineUsers, heartbeat } from "@/hooks/useUserCount";
import { useEffect, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export default function UserCount() {
  const [online, setOnline] = useState<number>(0);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const updateUserId = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setUserId(result.visitorId);
    };

    const updateCount = async () => {
      await heartbeat(userId);
      const count = await getOnlineUsers();
      setOnline(count);
    };

    updateUserId();
    updateCount();
    const interval = setInterval(updateCount, 5000); // a cada 5s

    return () => clearInterval(interval);
  }, []);

  return <div>Usuários online: {online}</div>;
}
