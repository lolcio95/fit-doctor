import { ArticleRichText, RichText } from "@/sanity.types";

export type RichTextStyle =
  | Extract<
      NonNullable<RichText["richText"]>[number],
      {
        _type: "block";
      }
    >["style"]
  | Extract<
      NonNullable<ArticleRichText["richText"]>[number],
      {
        _type: "block";
      }
    >["style"];
