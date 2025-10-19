import { redirect } from "next/navigation";

export default function Page() {
  // Redirect to new login page
  redirect('/login');
}
