import { defineType } from "sanity";

export default defineType({
  title: "Media Link",
  name: "mediaLink",
  type: "file",
  preview: {
    select: {
      subtitle: "file.asset.originalFilename"
    },
    prepare: ({ subtitle = "" }) => ({
      title: "Media Link",
      subtitle
    })
  }
});
