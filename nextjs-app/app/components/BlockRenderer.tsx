import React from "react";

import { dataAttr } from "@/sanity/lib/utils";
import dynamic from "next/dynamic";

type BlocksType = {
  [key: string]: React.FC<any>;
};

type BlockType = {
  _type: string;
  _key: string;
};

type BlockProps = {
  block: BlockType;
  pageId: string;
  pageType: string;
};

const TwoColumns = dynamic(() =>
  import("@/app/components/organisms/TwoColumns").then((mod) => mod.TwoColumns)
);
const Tabs = dynamic(() =>
  import("@/app/components/organisms/Tabs").then((mod) => mod.Tabs)
);
const RichTextSection = dynamic(
  () => import("@/app/components/organisms/RichTextSection")
);
const MainHero = dynamic(() =>
  import("@/app/components/organisms/MainHero").then((mod) => mod.MainHero)
);
const FeaturesWithImage = dynamic(() =>
  import("@/app/components/organisms/FeaturesWithImage").then(
    (mod) => mod.FeaturesWithImage
  )
);
const Stats = dynamic(() =>
  import("@/app/components/organisms/Stats").then((mod) => mod.Stats)
);
const FeaturesWithIcons = dynamic(() =>
  import("@/app/components/organisms/FeaturesWithIcons").then(
    (mod) => mod.FeaturesWithIcons
  )
);
const CTA = dynamic(() =>
  import("@/app/components/organisms/CTA").then((mod) => mod.CTA)
);
const Logos = dynamic(() =>
  import("@/app/components/organisms/Logos").then((mod) => mod.Logos)
);
const TwoColumnsFeatures = dynamic(() =>
  import("@/app/components/organisms/TwoColumnsFeatures").then(
    (mod) => mod.TwoColumnsFeatures
  )
);
const Ethos = dynamic(() =>
  import("@/app/components/organisms/Ethos").then((mod) => mod.Ethos)
);
const SecondaryHero = dynamic(() =>
  import("@/app/components/organisms/SecondaryHero").then(
    (mod) => mod.SecondaryHero
  )
);
const FeaturesWithCards = dynamic(() =>
  import("@/app/components/organisms/FeaturesWithCards").then(
    (mod) => mod.FeaturesWithCards
  )
);
const Testimonials = dynamic(() =>
  import("@/app/components/organisms/Testimonials").then(
    (mod) => mod.Testimonials
  )
);
const DownloadCards = dynamic(() =>
  import("@/app/components/organisms/DownloadCards").then(
    (mod) => mod.DownloadCards
  )
);
const TechPartnersCards = dynamic(() =>
  import("@/app/components/organisms/TechPartnersCards").then(
    (mod) => mod.TechPartnersCards
  )
);
const FeaturesWithLogos = dynamic(() =>
  import("@/app/components/organisms/FeaturesWithLogos").then(
    (mod) => mod.FeaturesWithLogos
  )
);
const ContactForm = dynamic(() =>
  import("@/app/components/organisms/ContactForm").then(
    (mod) => mod.ContactForm
  )
);
const BigImage = dynamic(() =>
  import("@/app/components/organisms/BigImage").then((mod) => mod.BigImage)
);
const TeamCards = dynamic(() =>
  import("@/app/components/organisms/TeamCards").then((mod) => mod.TeamCards)
);
const TeamIcons = dynamic(() =>
  import("@/app/components/organisms/TeamIcons").then((mod) => mod.TeamIcons)
);
const FAQ = dynamic(() =>
  import("@/app/components/organisms/FAQ").then((mod) => mod.FAQ)
);
const IconHighlights = dynamic(() =>
  import("@/app/components/organisms/IconHighlights").then(
    (mod) => mod.IconHighlights
  )
);
const Table = dynamic(() =>
  import("@/app/components/organisms/Table").then((mod) => mod.Table)
);
const Newsletter = dynamic(() =>
  import("@/app/components/organisms/Newsletter").then((mod) => mod.Newsletter)
);
const Steps = dynamic(() =>
  import("@/app/components/organisms/Steps").then((mod) => mod.Steps)
);
const ContactTeam = dynamic(() =>
  import("@/app/components/organisms/ContactTeam").then(
    (mod) => mod.ContactTeam
  )
);
const ListOfArticles = dynamic(() =>
  import("@/app/components/organisms/ListOfArticles").then(
    (mod) => mod.ListOfArticles
  )
);
const TextColumnsGrid = dynamic(() =>
  import("@/app/components/organisms/TextColumnsGrid").then(
    (mod) => mod.TextColumnsGrid
  )
);
const TabbedList = dynamic(() =>
  import("@/app/components/organisms/TabbedList").then((mod) => mod.TabbedList)
);
const WhyUsSection = dynamic(
  () => import("@/components/blocks/why-us-section")
);
const ListOfTwoColumns = dynamic(() =>
  import("@/app/components/organisms/ListOfTwoColumns").then(
    (mod) => mod.ListOfTwoColumns
  )
);

const Blocks: BlocksType = {
  twoColumns: (block) => <TwoColumns {...block} />,
  tabs: (block) => <Tabs {...block} />,
  sectionRichText: (block) => <RichTextSection {...block} />,
  mainHero: (block) => <MainHero {...block} />,
  featuresWithImage: (block) => <FeaturesWithImage {...block} />,
  stats: (block) => <Stats {...block} />,
  featuresWithIcons: (block) => <FeaturesWithIcons {...block} />,
  cta: (block) => <CTA {...block} />,
  logos: (block) => <Logos {...block} />,
  twoColumnsFeatures: (block) => <TwoColumnsFeatures {...block} />,
  ethos: (block) => <Ethos {...block} />,
  secondaryHero: (block) => <SecondaryHero {...block} />,
  featuresWithCards: (block) => <FeaturesWithCards {...block} />,
  testimonials: (block) => <Testimonials {...block} />,
  downloadCards: (block) => <DownloadCards {...block} />,
  techPartnersCards: (block) => <TechPartnersCards {...block} />,
  featuresWithLogos: (block) => <FeaturesWithLogos {...block} />,
  contactForm: (block) => <ContactForm {...block} />,
  bigImage: (block) => <BigImage {...block} />,
  teamCards: (block) => <TeamCards {...block} />,
  teamIcons: (block) => <TeamIcons {...block} />,
  faq: (block) => <FAQ {...block} />,
  iconHighlights: (block) => <IconHighlights {...block} />,
  tableObject: (block) => <Table {...block} />,
  newsletter: (block) => <Newsletter {...block} />,
  steps: (block) => <Steps {...block} />,
  contactTeam: (block) => <ContactTeam {...block} />,
  listOfArticles: (block) => <ListOfArticles {...block} />,
  textColumnsGrid: (block) => <TextColumnsGrid {...block} />,
  tabbedList: (block) => <TabbedList {...block} />,
  whyUs: (block) => <WhyUsSection {...block} />,
  listOfTwoColumns: (block) => <ListOfTwoColumns {...block} />,
};

/**
 * Used by the <PageBuilder>, this component renders a the component that matches the block type.
 */
export default function BlockRenderer({ block, pageId, pageType }: BlockProps) {
  // Block does exist
  if (typeof Blocks[block._type] !== "undefined") {
    return (
      <div
        id={block._key}
        key={block._key}
        data-sanity={dataAttr({
          id: pageId,
          type: pageType,
          path: `pageBuilder[_key=="${block._key}"]`,
        }).toString()}
      >
        {React.createElement(Blocks[block._type], {
          key: block._key,
          block: block,
        })}
      </div>
    );
  }
  // Block doesn't exist yet
  return React.createElement(
    () => (
      <div className="w-full bg-gray-100 text-center text-gray-500 p-20 rounded">
        A &ldquo;{block._type}&rdquo; block hasn&apos;t been created
      </div>
    ),
    { key: block._key }
  );
}
