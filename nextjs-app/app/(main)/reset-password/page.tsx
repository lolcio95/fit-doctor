import ResetPasswordForm from "./components/ResetPasswordForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const tokenParam = resolvedSearchParams?.token;
  const token = Array.isArray(tokenParam) ? tokenParam[0] : (tokenParam ?? "");

  return (
    <main className="py-16">
      <h1 className="text-center text-2xl mb-6">Zresetuj hasło</h1>
      <ResetPasswordForm token={token} />
    </main>
  );
}
