"use client";

import { tiktokFormTranscript } from "@/app/actions/tiktopTranscript";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useState, useTransition } from "react";

export interface TiktokCardProps {
  id: string;
  url: string;
  urlMusic: string;
}

export function TiktokCard({ urlMusic, url, id }: TiktokCardProps) {
  const [text, setText] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const response = await tiktokFormTranscript({ url: urlMusic, id });
        setText(response.text);
      } catch (error) {
        console.log(error);
      }
    });
  };

  return (
    <Paper elevation={2} sx={{ mt: 4, p: 3 }}>
      <form onSubmit={handleSubmit}>
        <Stack
          direction="row"
          spacing={2}
          border={1}
          borderRadius={2}
          borderColor="darkcyan"
          padding={1}
        >
          <Box display="flex" alignItems="center">
            <Typography variant="body2">{url}</Typography>
          </Box>

          <Box width="100%">
            <audio controls style={{ width: "100%" }}>
              <source src={urlMusic} type="audio/ogg" />
              Seu navegador não suporta áudio.
            </audio>
          </Box>

          <Box display="flex" alignItems="center">
            <Button
              variant="contained"
              type="submit"
              sx={{
                borderRadius: 6,
                backgroundColor: "#388e3c",
                color: "white",
                px: 4,
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#2e7d32",
                },
              }}
              loading={isPending}
            >
              Transcrever
            </Button>
          </Box>
        </Stack>
        {text}
      </form>
    </Paper>
  );
}
