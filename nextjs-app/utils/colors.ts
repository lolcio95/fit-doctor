import { ButtonVariant } from "@/components/ui/button";
import { BACKGROUND_COLORS } from "@/consts/colors";
import { ColorMap } from "@/types/colors";

function isColorMapType(bgColor: string): bgColor is ColorMap {
  const colorsLabels: string[] = Object.values(BACKGROUND_COLORS).map(
    ({ label }) => label
  );

  return colorsLabels.includes(bgColor);
}

export const getTextColor = (bgColor: string | undefined) => {
  if (!bgColor) {
    return '';
  }

  const color = isColorMapType(bgColor) ? bgColor : undefined;

  switch (color) {
    case "Brand":
    case "Dark":
    case "Brand Gradient":
      return "text-secondary-foreground";
    default:
      return "text-muted-foreground";
  }
};

export const getSecondaryTextColor = (bgColor: string | undefined) => {
  if (!bgColor) {
    return '';
  }

  const color = isColorMapType(bgColor) ? bgColor : undefined;

  switch (color) {
    case "Brand":
    case "Dark":
    case "Brand Gradient":
      return "text-secondary-foreground";
    default:
      return "text-foreground";
  }
};

export const getButtonModeForBackground = (
  bgColor: string | undefined
): ButtonVariant | undefined => {
  if (!bgColor) {
    return undefined;
  }

  const color = isColorMapType(bgColor) ? bgColor : undefined;

  switch (color) {
    case "Brand":
    case "Dark":
    case "Brand Gradient":
      return "secondary";
    default:
      return undefined;
  }
};

export const checkIfIsLight = (bgColor: string | undefined) => {
  if (!bgColor) {
    return false;
  }

  const color = isColorMapType(bgColor) ? bgColor : undefined;

  switch (color) {
    case "Light":
    case "Muted":
    case "Muted Light":
      return true;
    default:
      return false;
  }
};
