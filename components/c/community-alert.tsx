"use client";

import { useRef, useState } from "react";
import AlertItem from "./alert-item";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { ChevronsUpDown, Loader2, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";

const CommunityAlerts = ({
  isPermission,
  data,
  communityId,
}: {
  isPermission: boolean;
  data: string[];
  communityId: string;
}) => {
  const [alertData, setAlertData] = useState(data);
  const [isAdding, setAdd] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleEdit = async (itemIndex: number, text: string) => {
    const newData = alertData.map((alertText, index) => {
      if (index === itemIndex) {
        return text;
      }
      return alertText;
    });

    setAlertData(newData);
    try {
      const payload = {
        communityId: communityId,
        alerts: newData,
      };
      await axios.put("/api/community/alert", payload);
      toast({
        title: "Alert updated successfully",
        variant: "success",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  const handleAddAlert = async () => {
    if (!isAdding) return setAdd(true);

    if (!inputRef) return;

    const value = inputRef.current?.value;

    if (!value)
      return toast({
        title: "Please enter some text to alert title",
        variant: "warning",
      });
    setLoading(true);

    try {
      const payload = {
        communityId: communityId,
        alerts: [value],
      };
      await axios.put("/api/community/alert", payload);
      toast({
        title: "Alert updated successfully",
        variant: "success",
      });
      inputRef.current.value = "";
      setAdd(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.log(error);
      toast({
        title: "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    (alertData.length === 0 || isPermission) && (
      <Collapsible className="space-y-2 rounded-md border" defaultOpen={true}>
        <CollapsibleTrigger className="flex w-full items-center justify-center gap-2 p-1 hover:bg-foreground/10">
          Community Alert
          <ChevronsUpDown size="16" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 pb-1">
          {alertData.map((alertText, index) => {
            if (index === 4) return null;
            return (
              <AlertItem
                key={index}
                index={index}
                text={alertText}
                handleEdit={handleEdit}
                isPermission={isPermission}
                communityId={communityId}
              />
            );
          })}
          {alertData.length <= 3 && (
            <div className="flex items-center justify-center gap-2">
              {isAdding && (
                <>
                  <Input
                    type="text"
                    className="flex-1"
                    placeholder="Alert content..."
                    ref={inputRef}
                    onKeyDown={(e) => {
                      if (e.key !== "Enter") return;
                      handleAddAlert();
                    }}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setAdd(false)}
                  >
                    <X />
                  </Button>
                </>
              )}
              <Button
                disabled={isLoading}
                variant={isAdding ? "default" : "outline"}
                onClick={handleAddAlert}
              >
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {isAdding ? "Submit" : "Add Alert"}
              </Button>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    )
  );
};

export default CommunityAlerts;
