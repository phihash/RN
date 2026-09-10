import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";
export type IconName = ComponentProps<typeof Ionicons>["name"];

export type Item = {
  id: string;
  name: string;
  checked: boolean;
  icon?: IconName;
};

export type Checklist = {
  id: string;
  name: string;
  items: Item[];
};
