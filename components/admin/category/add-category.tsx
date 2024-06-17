"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SelectIcon from "./select-icon";
import { Popover } from "@/components/ui/popover";

const AddCategory = () => {
  const [isOpen, setOpen] = useState(false);
  const [icon, setIcon] = useState("trophy");
  const [isLoading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleAdd = async () => {
    setLoading(true);
    try {
      if (!isOpen) return setOpen(true);

      const title = inputRef.current?.value;

      if (!title)
        return toast({
          title: "Please enter a title",
          variant: "warning",
        });
      const payload = { title: title, icon: icon };

      await axios.post("/api/category", payload);

      toast({
        title: "Category created successfully",
        variant: "success",
      });

      inputRef.current.value = "";

      router.refresh();
    } catch (error) {
      toast({
        title: "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  return (
    <Popover>
      <div className="flex gap-2">
        {isOpen && (
          <>
            <SelectIcon icon={icon} setIcon={setIcon} />
            <Input ref={inputRef} placeholder="Title..." />
            <Button variant="outline" onClick={() => setOpen(false)}>
              <X size="16" />
            </Button>
          </>
        )}
        <Button className="" onClick={handleAdd} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 size-5 animate-spin" />}
          {isOpen ? "Gửi" : "Thêm"}
        </Button>
      </div>
    </Popover>
  );
};

export default AddCategory;
