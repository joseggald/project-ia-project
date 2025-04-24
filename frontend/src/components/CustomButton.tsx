// components/CustomButton.tsx
import React from "react";
import { Button, ButtonProps, CircularProgress } from "@mui/material";
import { SvgIconComponent } from "@mui/icons-material";

interface CustomButtonProps extends ButtonProps {
  sizeVariant?: "xsmall" | "small" | "medium" | "large" | "xlarge";
  colorVariant?: "primary" | "success" | "error" | "warning";
  outline?: boolean;
  loading?: boolean;
  icon?: SvgIconComponent;
}

const sizeStyles = {
  xsmall: { padding: "4px 8px", fontSize: "0.7rem" },
  small: { padding: "6px 12px", fontSize: "0.8rem" },
  medium: { padding: "8px 16px", fontSize: "1rem" },
  large: { padding: "12px 20px", fontSize: "1.2rem" },
  xlarge: { padding: "16px 24px", fontSize: "1.5rem" },
};

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  sizeVariant = "medium",
  colorVariant = "primary",
  outline = false,
  loading = false,
  icon: Icon,
  ...props
}) => {
  return (
    <Button
      {...props}
      variant={outline ? "outlined" : "contained"} 
      color={colorVariant} 
      sx={{
        ...sizeStyles[sizeVariant],
        borderRadius: "6px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        textTransform: "none",
        transition: "all 0.3s ease-in-out",
        "&:hover": outline
          ? { backgroundColor: `${colorVariant}.main`, color: "white" }
          : { boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" },
      }}
      disabled={loading}
    >
      {loading ? (
        <CircularProgress size={20} color="inherit" />
      ) : (
        <>
          {Icon && <Icon fontSize="inherit" />}
          {children}
        </>
      )}
    </Button>
  );
};

export default CustomButton;
