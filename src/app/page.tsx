import { unstable_noStore as noStore } from "next/cache";
import GoogleMap from "~/components/Map";

export default async function Home() {
  noStore();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="mt-40 h-[400px] w-3/4">
        <GoogleMap />
      </div>
    </main>
  );
}
