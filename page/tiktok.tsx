"use client";

import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import DownloadIcon from "@mui/icons-material/Download";
import { useEffect, useState, useTransition } from "react";
import { tiktokForm } from "@/app/actions/tiktop";
import { getFingerprintJS } from "@/hooks/useFingerprint";
import { TiktokCard, TiktokCardProps } from "@/components/tiktokCard";

const GradientBox = styled(Box)({
  background: "linear-gradient(to right, #43cea2, #185a9d)",
  padding: "80px 20px",
  textAlign: "center",
  minHeight: "60vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
});

const isValidUrl = (url: string) => {
  const pattern = new RegExp("https?://.+");
  return pattern.test(url);
};

type ItemProps = TiktokCardProps & { key: number };

export default function DownloaderForm() {
  const [url, setUrl] = useState("");
  const [items, setItems] = useState<ItemProps[]>([]);
  const [visitorId, setVisitorId] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const response = await tiktokForm({ url });
        if (response?.status === "success")
          setItems([
            ...items,
            {
              url: response.url,
              urlMusic: response.urlMusic,
              id: visitorId,
              key: Date.now(),
            },
          ]);
      } catch (error) {
        //
      }
    });
  };

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    setUrl(text);
  };

  useEffect(() => {
    (async () => {
      const { visitorId } = await getFingerprintJS();
      setVisitorId(visitorId);
    })();
  }, []);

  return (
    <GradientBox>
      <Typography variant="h4" fontWeight="bold" color="white" mb={4}>
        Baixar vídeo TikTok
      </Typography>

      <Container maxWidth="md">
        <form onSubmit={handleSubmit}>
          <Stack
            direction="row"
            spacing={0}
            sx={{
              background: "#dff5ec",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0px 8px 20px rgba(0,0,0,0.2)",
            }}
          >
            <TextField
              placeholder="Cole o link"
              variant="outlined"
              name="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              fullWidth
              InputProps={{
                style: {
                  backgroundColor: "#dff5ec",
                  borderRadius: 0,
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "none",
                  },
                  "& input": {
                    color: "#1b5e20",
                    padding: "14px",
                    fontSize: "1rem",
                  },
                },
              }}
            />

            <Button
              onClick={handlePaste}
              sx={{
                borderRadius: 0,
                backgroundColor: "white",
                color: "#2e7d32",
                px: 2,
                borderLeft: "1px solid #c8e6c9",
                "&:hover": {
                  backgroundColor: "#f1f8e9",
                },
              }}
            >
              <ContentPasteIcon />
              &nbsp;Colar
            </Button>

            <Button
              variant="contained"
              endIcon={<DownloadIcon />}
              type="submit"
              sx={{
                borderRadius: 0,
                backgroundColor: "#388e3c",
                color: "white",
                px: 4,
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#2e7d32",
                },
              }}
              loading={isPending}
              disabled={!url || !isValidUrl(url)}
            >
              Baixar
            </Button>
          </Stack>
        </form>
      </Container>

      {items?.map((item: ItemProps) => (
        <TiktokCard
          id={visitorId}
          url={item.url}
          urlMusic={item.urlMusic}
          key={item.key}
        />
      ))}
    </GradientBox>
  );
}
