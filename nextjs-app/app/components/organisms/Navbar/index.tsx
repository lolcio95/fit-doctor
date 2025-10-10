import { Navigation } from "@/components/blocks/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import { getNavbar } from "@/sanity/lib/queries";

export const Navbar = async () => {
  const [{ data: navbar }] = await Promise.all([
    sanityFetch({
      query: getNavbar,
    }),
  ]);
  return (
    <>
      <Navigation logo={navbar?.logo} menuItems={navbar?.menuItems || []} />
    </>
  );
};
