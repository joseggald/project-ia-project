import React, { useState, useEffect } from "react";
import { CircularProgress, Typography, Box } from "@mui/material";

interface CustomTextAreaProps {
  label: string;
  placeholder?: string;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  sizeVariant?: "small" | "medium" | "large";
  customHeight?: string; 
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const sizeStyles = {
  small: { fontSize: "0.8rem", padding: "8px", height: "80px" },
  medium: { fontSize: "1rem", padding: "10px", height: "120px" },
  large: { fontSize: "1.2rem", padding: "12px", height: "160px" },
};

const CustomTextArea: React.FC<CustomTextAreaProps> = ({
  label,
  placeholder = "Escribe aquí...",
  loading = false,
  loadingText = "Generando respuesta...",
  disabled = false,
  sizeVariant = "medium",
  customHeight,
  value = "",
  onChange,
}) => {
  const [content, setContent] = useState<string>(value);

  useEffect(() => {
    if (value) setContent(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (onChange) onChange(e);
  };

  return (
    <div style={{ width: "100%", marginBottom: "16px" }}>

      <Typography
        variant="subtitle1"
        sx={{
          marginBottom: "6px",
          fontWeight: 600,
          color: disabled ? "#aaa" : "#333",
        }}
      >
        {label}
      </Typography>

      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          borderRadius: "6px", // Bordes redondeados
          backgroundColor: disabled ? "#f5f5f5" : "#fff",
          border: `2px solid ${disabled ? "#ccc" : "#ccc"}`,
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            borderColor: disabled ? "#ccc" : "#444",
          },
        }}
      >
        {loading ? (
          <Box
            sx={{
              ...sizeStyles[sizeVariant],
              height: customHeight || sizeStyles[sizeVariant].height,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              gap: "8px",
            }}
          >
            <CircularProgress size={24} />
            <Typography variant="body2">{loadingText}</Typography>
          </Box>
        ) : (
          <textarea
            placeholder={placeholder}
            value={content}
            onChange={handleChange}
            disabled={disabled}
            style={{
              ...sizeStyles[sizeVariant],
              height: customHeight || sizeStyles[sizeVariant].height,
              width: "100%",
              resize: "none",
              border: "none",
              outline: "none",
              fontFamily: "inherit",
              color: disabled ? "#777" : "#777", 
              backgroundColor: "transparent",
            }}
          />
        )}
      </Box>
    </div>
  );
};

export default CustomTextArea;
