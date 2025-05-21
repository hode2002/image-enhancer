import { Button } from "@/components/ui/button";
import { SignUpButton } from "@clerk/nextjs";

interface CustomSignUpButtonProps {
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const CustomSignUpButton = ({
  className = "",
  variant = "default",
  size = "default",
}: CustomSignUpButtonProps) => {
  return (
    <SignUpButton mode="modal">
      <Button variant={variant} size={size} className={className}>
        Sign Up
      </Button>
    </SignUpButton>
  );
};

export default CustomSignUpButton;
