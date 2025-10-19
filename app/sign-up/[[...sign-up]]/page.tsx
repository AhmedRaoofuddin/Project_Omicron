import { redirect } from "next/navigation";
 
export default function Page() {
  // Redirect to new signup page
  redirect('/signup');
}