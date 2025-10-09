require("dotenv").config();;
const fs = require("node:fs");
const path = require("node:path");
const { createClient } = require("next-sanity");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-28",
  withCredentials: true,
  useCdn: false,
  perspective: "published"
});

const redirectsGlobal = `
  *[_type == 'redirects'][0] {
    ...,
    redirects[] {
      ...,
      resource -> {
        slug
      }
    }
  }
`
async function generateRedirects() {
  const query = `*[_type == 'redirects'][0].redirects[]{
    sourceSlug,
    resource->{
      slug
    }
  }`;

  const redirects = await client.fetch(query);


  if (!redirects || !Array.isArray(redirects) || redirects.length === 0) {
    console.warn("No redirects found. Writing empty redirects.json.");
    const outputPath = path.join(process.cwd(), '', 'redirects.json');
    fs.writeFileSync(outputPath, JSON.stringify({}, null, 2));
    return;
  }

  const redirectMap: Record<string, string> = {};
  redirects.forEach((entry: any) => {
    if (entry?.sourceSlug?.current && entry?.resource?.slug?.current) {
      redirectMap[entry.sourceSlug.current] = entry.resource.slug.current;
    }
  });

  const outputPath = path.join(process.cwd(), '', 'redirects.json');
  fs.writeFileSync(outputPath, JSON.stringify(redirectMap, null, 2));
}

generateRedirects();
