import type { MantineColorsTuple } from "@mantine/core";
import { createTheme } from "@mantine/core";

export const BrandColors: MantineColorsTuple = [
  "#f0f5ff",
  "#dfe9ff",
  "#badcff",
  "#91caff",
  "#69b1ff",
  "#4096ff",
  "#1677ff",
  "#0958d9",
  "#003eb3",
  "#002c8c",
];

export const BrandTheme = createTheme({
  colors: {
    baseflow: BrandColors,
  },
  primaryColor: "baseflow",
});
