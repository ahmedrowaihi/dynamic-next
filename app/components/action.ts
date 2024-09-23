"use server";
import fs from "fs";
export const save = async (component: string) => {
  const filePath = "widgets.json";
  let widgets = [] as string[];

  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    widgets = JSON.parse(fileContent);
  } catch (err) {
    if ((err as any).code !== "ENOENT") {
      throw err;
    }
  }

  widgets.push(component);

  fs.writeFileSync(filePath, JSON.stringify(widgets, null, 2));
  Promise.resolve();
};

export const load = async () => {
  const filePath = "widgets.json";
  let widgets = [] as string[];
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    widgets = JSON.parse(fileContent);
  } catch (err) {
    if ((err as any).code !== "ENOENT") {
      throw err;
    }
  }
  return widgets;
};
