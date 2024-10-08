"use client";

import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Community } from "@prisma/client";
import axios from "axios";

interface props {
  form: any;
  communities: {
    community: Pick<Community, "id" | "name">;
  }[];
  setCommunityName: (value: string) => void;
  setCommunityLoading: (value: boolean) => void;
}

const CommunitySelect: React.FC<props> = ({
  form,
  communities,
  setCommunityName,
  setCommunityLoading,
}) => {
  const getCommunityData = async (e: string) => {
    setCommunityLoading(true);
    try {
      const { data } = await axios.get(`/api/community?communityId=${e}`);
    } catch (error) {
      console.log(error);
    } finally {
      setCommunityLoading(false);
    }
  };

  return (
    <FormField
      control={form.control}
      name="communityId"
      render={({ field }) => (
        <FormItem>
          <div className="relative">
            <FormControl>
              <Select
                onValueChange={(e) => {
                  const cName = communities.find((c) => c.community.id === e);
                  setCommunityName(cName!.community.name);
                  field.onChange(e);
                  getCommunityData(e);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn cộng đồng" />
                </SelectTrigger>
                <SelectGroup>
                  <SelectContent className="z-[100]" align="end">
                    <SelectLabel>Cộng đồng</SelectLabel>
                    <SelectSeparator />
                    {communities.map((c) => (
                      <SelectItem key={c.community.id} value={c.community.id}>
                        c/{c.community.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectGroup>
              </Select>
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CommunitySelect;
