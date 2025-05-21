import { SignInButton } from "@clerk/nextjs";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

interface CustomSignInButtonProps {
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

const CustomSignInButton: FC<CustomSignInButtonProps> = ({
  className = "",
  variant = "default",
  size = "default",
}) => {
  return (
    <SignInButton
      mode="modal"
      forceRedirectUrl={process.env.NEXT_PUBLIC_APP_URL + "/auth-success"}
    >
      <Button variant={variant} size={size} className={className}>
        <LogIn className="mr-2 h-4 w-4" />
        Sign In
      </Button>
    </SignInButton>
  );
};

export default CustomSignInButton;
