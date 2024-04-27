"use client";

import { useRouter } from "next/navigation";
import { Button, ButtonProps } from "../ui/button";

const RefreshButton: React.FC<ButtonProps> = (props) => {
  const router = useRouter();
  return (
    <Button variant="outline" {...props} onClick={() => router.refresh()}>
      Refresh
    </Button>
  );
};

export default RefreshButton;
