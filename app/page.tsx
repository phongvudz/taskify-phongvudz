import { db } from "@/lib/db";
import Image from "next/image";

export default async function Home() {
  const listCards = await db.card.findMany();

  console.log(listCards);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {listCards.map((card) => (
        <div key={card.id}>{card.title}</div>
      ))}
    </main>
  );
}
