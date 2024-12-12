import { setupUser } from "@/actions/billing/setup-user";

export default async function SetupPage() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return await setupUser();
}
