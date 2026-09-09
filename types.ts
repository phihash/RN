export type Item = {
  id: string;
  name: string;
  checked: boolean;
};

export type Checklist = {
  id: string;
  name: string;
  items: Item[];
};
