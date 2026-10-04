import type { MantineColorsTuple, MantineProviderProps } from "@mantine/core";
import { MantineProvider as BaseMantineProvider, createTheme, mergeThemeOverrides } from "@mantine/core";
import { useMemo } from "react";

export const BrandColors: MantineColorsTuple = [
  "#e5f3ff",
  "#cde2ff",
  "#9ac2ff",
  "#64a0ff",
  "#3884fe",
  "#1d72fe",
  "#0063ff",
  "#0058e4",
  "#004ecd",
  "#0043b5",
];

export const BrandTheme = createTheme({
  colors: {
    brand: BrandColors,
  },
  primaryColor: "brand",
  primaryShade: {
    light: 5,
    dark: 5,
  },
});

export default function MantineProvider({ theme, ...props }: MantineProviderProps) {
  const mergedTheme = useMemo(() => (theme ? mergeThemeOverrides(BrandTheme, theme) : BrandTheme), [theme]);

  return <BaseMantineProvider {...props} theme={mergedTheme} />;
}
