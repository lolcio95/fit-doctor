export const getAppDomain = () => {
  const domain =
    process.env.NEXT_PUBLIC_APP_DOMAIN ||
    process.env.NEXT_PUBLIC_VERCEL_URL;

  const protocol = process.env.NEXT_PUBLIC_VERCEL_ENV
    ? "https"
    : "http";

  return `${protocol}://${domain}`;
};
