import { Navbar as NavbarBlock } from "@/components/blocks/navbar";
import { sanityFetch } from "@/sanity/lib/live";
import { getNavbarQuery } from "@/sanity/lib/queries";

export const Navbar = async () => {
  const [{ data: navbar }] = await Promise.all([
    sanityFetch({
      query: getNavbarQuery,
    }),
  ]);
  return (
    <NavbarBlock
      logo={navbar?.logo}
      menuItems={navbar?.menuItems}
      buttons={navbar?.buttons}
    />
  );
};
