"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Category } from "@prisma/client";
import axios from "axios";
import { Edit, Send, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SelectIcon from "./select-icon";
import { Popover } from "@/components/ui/popover";

const EditCategory = ({ data }: { data: Category }) => {
  const [_title, setTitle] = useState(data.title);
  const [_icon, setIcon] = useState(data.icon);
  const [isEdit, setEdit] = useState(false);
  const router = useRouter();

  const handleEdit = async () => {
    if (!isEdit) return setEdit(true);
    if (data.title === _title || data.icon === _icon)
      return toast({
        title: "Nothing changed !",
        variant: "warning",
      });

    try {
      const payload = {
        title: _title,
      };

      await axios.put(`/api/category/${data.id}`, payload);
      toast({
        title: "Category updated successfully",
        variant: "success",
      });
      router.refresh();
      setEdit(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "Something went wrong.",
        description: "Category wasn't updated successfully. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Popover>
      {isEdit && (
        <div className="absolute bottom-0 left-1 right-11 top-0 flex items-center gap-2 bg-background ">
          <SelectIcon icon={_icon} setIcon={setIcon} />
          <Input
            className="text-md"
            value={_title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <Button
            className=""
            variant="outline"
            size="icon"
            onClick={() => setEdit(false)}
          >
            <X size="16" />
          </Button>
        </div>
      )}
      <div className="absolute bottom-0 right-0.5 top-0 grid place-items-center">
        <Button className="" variant="outline" size="icon" onClick={handleEdit}>
          {isEdit ? <Send size="16" /> : <Edit size="16" />}
        </Button>
      </div>
    </Popover>
  );
};

export default EditCategory;
