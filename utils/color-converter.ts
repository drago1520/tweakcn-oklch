import * as culori from "culori";
import type { Hsl, Oklch } from "culori";
import { ColorFormat } from "../types";

export const formatNumber = (num?: number) => {
  if (!num) return "0";
  return num % 1 === 0 ? num : num.toFixed(4);
};

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const formatOklchString = (oklch: Oklch, alpha?: number) => {
  const parts = [formatNumber(oklch.l), formatNumber(oklch.c), formatNumber(oklch.h)];
  const alphaValue =
    typeof alpha === "number" && !Number.isNaN(alpha)
      ? alpha
      : typeof oklch.alpha === "number" && !Number.isNaN(oklch.alpha)
        ? oklch.alpha
        : undefined;
  const alphaSegment =
    alphaValue !== undefined && alphaValue < 1 ? ` / ${formatNumber(alphaValue)}` : "";

  return `oklch(${parts.join(" ")}${alphaSegment})`;
};

export const formatHsl = (hsl: Hsl) => {
  return `hsl(${formatNumber(hsl.h)} ${formatNumber(hsl.s * 100)}% ${formatNumber(hsl.l * 100)}%)`;
};

export const colorFormatter = (
  colorValue: string,
  format: ColorFormat = "oklch",
  tailwindVersion: "3" | "4" = "3"
): string => {
  try {
    const color = culori.parse(colorValue);
    if (!color) throw new Error("Invalid color input");

    switch (format) {
      case "hsl": {
        const hsl = culori.converter("hsl")(color);
        if (tailwindVersion === "4") {
          return formatHsl(hsl);
        }
        return `${formatNumber(hsl.h)} ${formatNumber(hsl.s * 100)}% ${formatNumber(hsl.l * 100)}%`;
      }
      case "rgb":
        return culori.formatRgb(color);
      case "hex":
        return culori.formatHex(color);
      case "oklch":
      default: {
        const oklch = culori.converter("oklch")(color) as Oklch;
        return formatOklchString(oklch);
      }
    }
  } catch (error) {
    console.error(`Failed to convert color: ${colorValue}`, error);
    return colorValue;
  }
};

export const formatColorWithAlpha = (colorValue: string, alpha: number) => {
  try {
    const color = culori.parse(colorValue);
    if (!color) throw new Error("Invalid color input");

    const normalizedAlpha = clamp(alpha);
    const oklch = culori.converter("oklch")(color) as Oklch;
    return formatOklchString(oklch, normalizedAlpha);
  } catch (error) {
    console.error(`Failed to apply alpha to color: ${colorValue}`, error);
    return colorValue;
  }
};

export const convertToHSL = (colorValue: string): string => colorFormatter(colorValue, "hsl");
