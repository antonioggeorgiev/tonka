import { auth } from "~/server/auth";
import { LoginButton } from "~/app/_components/LoginButton";

export default async function AdminPage() {
  const session = await auth();

  return <LoginButton session={session} />;
}
