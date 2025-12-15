import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function HomePage() {
    // Check if user is authenticated
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (token) {
        // Redirect authenticated users to dashboard
        redirect("/dashboard");
    } else {
        // Redirect unauthenticated users to login
        redirect("/login");
    }
}
