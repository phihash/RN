import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";
export type IconName = ComponentProps<typeof Ionicons>["name"];

export const CATEGORIES = [
  "貴重品",
  "書類",
  "電子機器",
  "化粧品",
  "お風呂・洗面",
  "衣類・身につけるもの",
  "食事・その他",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Item = {
  id: string;
  name: string;
  checked: boolean;
  category: Category;
  icon?: IconName;
};

export type Checklist = {
  id: string;
  name: string;
  items: Item[];
};
