import React, { ChangeEvent, useState } from "react";
import { TextField, InputAdornment, Typography, IconButton, Chip } from "@mui/material";
import { SvgIconComponent, Close } from "@mui/icons-material";

interface CustomInputProps {
  label: string;
  icon?: SvgIconComponent;
  errorMessage?: string;
  sizeVariant?: "small" | "medium" | "compact";
  type?: "text" | "email" | "password" | "number";
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  placeholder?: string;
}

const sizeStyles = {
  small: { fontSize: "0.8rem", padding: "4px 8px", height: "36px" },
  medium: { fontSize: "0.9rem", padding: "6px 12px", height: "42px" },
  compact: { fontSize: "1rem", padding: "8px 12px", height: "38px" },
};

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  icon: Icon,
  errorMessage,
  sizeVariant = "medium",
  value,
  onChange,
  type = "text",
  disabled = false,
  placeholder,
}) => {
  return (
    <div style={{ marginBottom: "16px", width: "100%" }}>
      {/* Etiqueta */}
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 500, marginBottom: "4px", color: disabled ? "#aaa" : "#333" }}
      >
        {label}
      </Typography>

      {/* Campo de Entrada */}
      <TextField
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={onChange}
        fullWidth
        InputProps={{
          startAdornment: Icon && (
            <InputAdornment position="start">
              <Icon sx={{ color: "#666", marginRight: "8px" }} />
            </InputAdornment>
          ),
          sx: {
            ...sizeStyles[sizeVariant],
            borderRadius: "6px",
            backgroundColor: disabled ? "#f0f0f0" : "#fff",
            transition: "all 0.3s ease-in-out",
            "&:hover": { borderColor: "#1976d2" },
            "&.Mui-focused fieldset": { borderColor: "#1976d2" },
          },
        }}
        error={Boolean(errorMessage)}
        helperText={
          errorMessage ? (
            <Typography variant="caption" color="error">
              {errorMessage}
            </Typography>
          ) : null
        }
      />
    </div>
  );
};

export default CustomInput;
