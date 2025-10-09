import { LabeledLinkType } from ".";

export const getHref = (link?: LabeledLinkType) => {
  switch (link?.type) {
    case "externalUrl":
      return link?.url ?? "";
    case "internalLink":
      return link.resource?.slug ?? "";
    case "mediaLink":
      return link.downloadType === "openInNewTab"
        ? (link.mediaLink?.asset?.url ?? "")
        : "";
    case "sectionLink": {
      const { page, sectionKey } = link.section || {};
      const { slug: sectionPageSlug } = page || {};

      return `${sectionPageSlug}#${sectionKey}`;
    }
    default:
      return "";
  }
};

export const downloadFile = async (fileUrl: string, fileName: string) => {
  const response = await fetch(fileUrl);
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
};
