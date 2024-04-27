"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { IconList, IconType } from "@/lib/icons";
import axios from "axios";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SelectIcon from "./select-icon";

const AddCategory = () => {
  const [isOpen, setOpen] = useState(false);
  const [icon, setIcon] = useState("trophy");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleAdd = async () => {
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
    }
  };

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  return (
    <DropdownMenu>
      <div className="flex gap-2">
        {isOpen && (
          <>
            <SelectIcon icon={icon} setIcon={setIcon}/>
            <Input ref={inputRef} placeholder="Title..." />
            <Button variant="outline" onClick={() => setOpen(false)}>
              <X size="16" />
            </Button>
          </>
        )}
        <Button className="" onClick={handleAdd}>
          {isOpen ? "Submit" : "Add New"}
        </Button>
      </div>
    </DropdownMenu>
  );
};

export default AddCategory;
