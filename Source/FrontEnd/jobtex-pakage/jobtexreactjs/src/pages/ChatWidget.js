import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Input,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  keyframes
} from "@mui/material";
import { Send, Close } from "@mui/icons-material";

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages((prev) => [...prev, { sender: "user", text: input, time: timestamp }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5259/api/JobOfferCandidancy/chat", {
        message: input,
      });
      setMessages((prev) => [...prev, { sender: "bot", text: res.data.reply, time: timestamp }]);
    } catch {
      setMessages((prev) => [...prev, { sender: "bot", text: "Désolé, une erreur est survenue", time: timestamp }]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: `📎 Fichier envoyé : ${file.name}`, time: timestamp }
    ]);
    setIsLoading(true);
  
    try {
      const formData = new FormData();
      formData.append("file", file);
  
      const res = await axios.post("http://localhost:5259/api/JobOfferCandidancy/improve", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: res.data.improvedCv || "Fichier reçu avec succès.", time: timestamp }
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Erreur lors de l'envoi du fichier.", time: timestamp }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  

  // Scroll automatique vers le bas à chaque changement de message ou chargement
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="contained"
        color="primary"
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          borderRadius: "50%",
          minWidth: 60,
          height: 60,
          boxShadow: 6,
          animation: !isOpen ? `${pulse} 2s infinite` : "none",
          transition: "all 0.3s",
          "&:hover": {
            transform: "rotate(15deg) scale(1.1)",
            boxShadow: 8,
          },
        }}
      >
        💬
      </Button>

      {isOpen && (
        <Box
          sx={{
            position: "fixed",
            bottom: 90,
            right: 20,
            width: "100%",
            maxWidth: 400,
            backgroundColor: "background.paper",
            boxShadow: 6,
            borderRadius: "16px",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: "#123841",
              color: "white",
              padding: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: 2,
            }}
          >
            <Typography variant="h6" fontWeight="600" style={{color:"white"}}>
              AxiaJob_Bot
            </Typography>
            <IconButton onClick={() => setIsOpen(false)} color="inherit">
              <Close sx={{ fontSize: 24 }} />
            </IconButton>
          </Box>

          {/* Message List */}
          <Box
            sx={{
              padding: 2,
              height: 400,
              overflowY: "auto",
              background: "radial-gradient(circle at top left, #f7f9fc 0%, #f0f4f9 100%)",
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
            }}
          >
            {messages.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  flexDirection: msg.sender === "user" ? "row-reverse" : "row",
                  alignItems: "flex-end",
                  gap: 1.5,
                }}
              >
                <img
                  src={
                    msg.sender === "user"
                      ? "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
                      : "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                  }
                  alt="avatar"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "2px solid white",
                    boxShadow: 2,
                  }}
                />
                <Box sx={{ maxWidth: "75%" }}>
                  <Box
                    sx={{
                      backgroundColor: msg.sender === "user" ? "#123841" : "white",
                      color: msg.sender === "user" ? "white" : "text.primary",
                      padding: 1.5,
                      borderRadius:
                        msg.sender === "user" ? "12px 12px 0 12px" : "12px 12px 12px 0",
                      boxShadow: 1,
                    }}
                  >
                    <Typography variant="body2">{msg.text}</Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{
                      display: "block",
                      mt: 0.5,
                      textAlign: msg.sender === "user" ? "right" : "left",
                    }}
                  >
                    {msg.time}
                  </Typography>
                </Box>
              </Box>
            ))}

            {/* Animation pendant chargement */}
            {isLoading && (
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                  alt="bot avatar"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "2px solid white",
                    boxShadow: 2,
                  }}
                />
                <Box
                  sx={{
                    backgroundColor: "white",
                    padding: 1.5,
                    borderRadius: "12px 12px 12px 0",
                    boxShadow: 1,
                    display: "flex",
                    gap: 0.5,
                  }}
                >
                  {[...Array(3)].map((_, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 8,
                        height: 8,
                        bgcolor: "text.secondary",
                        borderRadius: "50%",
                        animation: `${pulse} 1.2s infinite ${i * 0.2}s`,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Référence pour le scroll automatique */}
            <Box ref={messagesEndRef} />
          </Box>

          {/* Zone de saisie */}
          <Box
            sx={{
              padding: 2,
              backgroundColor: "background.default",
              borderTop: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >



            <Input
              fullWidth
              placeholder="Tapez votre message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              disableUnderline
              sx={{
                borderRadius: "8px",
                backgroundColor: "background.paper",
                padding: "8px 16px",
                fontSize: "0.875rem",
                transition: "all 0.3s",
                boxShadow: 1,
                "&:focus-within": {
                  boxShadow: 3,
                },
              }}
            />
            <Input
  type="file"
  id="file-upload"
  hidden
  onChange={handleFileUpload}
/>
<label htmlFor="file-upload">
  <Button
    component="span"
    variant="contained"
    sx={{
      backgroundColor: "#123841",
      color: "white",
      borderRadius: "50%",
      minWidth: 48,
      height: 48,
      boxShadow: 3,
      "&:hover": {
        backgroundColor: "#0e7abf",
      },
    }}
    disabled={isLoading}
  >
    📎
  </Button>
</label>
            <Button
              onClick={sendMessage}
              variant="contained"
              sx={{
                backgroundColor: "#123841",
                color: "white",
                borderRadius: "50%",
                minWidth: 48,
                height: 48,
                boxShadow: 3,
                transition: "all 0.3s",
                "&:hover": {
                  transform: "rotate(-15deg) scale(1.1)",
                  boxShadow: 6,
                },
                fontSize: "1rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              disabled={isLoading}
            >
              <Send fontSize="small" />
            </Button>

           

          </Box>
        </Box>
      )}
    </>
  );
}

export default ChatWidget;
