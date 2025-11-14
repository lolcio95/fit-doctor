const group3 = (s: string) => (!s ? "" : (s.match(/.{1,3}/g)?.join(" ") ?? s));

export const formatDisplayPhone = (raw: string) => {
  if (raw == null) return "";
  const trimmed = raw.trim();
  const hasPlus = trimmed.startsWith("+");
  const digitsOnly = trimmed.replace(/\D/g, "");

  if (hasPlus) {
    if (!digitsOnly) return "+";
    if (digitsOnly.startsWith("48")) {
      const rest = digitsOnly.slice(2, 11);
      const groupedRest = group3(rest);
      return `+48${groupedRest ? " " + groupedRest : ""}`;
    }
    const afterPlus = raw
      .replace(/^\+/, "")
      .replace(/[^\d\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    return `+${afterPlus}`;
  } else {
    const national = digitsOnly.slice(0, 9);
    return group3(national);
  }
};