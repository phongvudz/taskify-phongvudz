import { db } from "@/lib/db";
import Image from "next/image";

export default async function Home() {
  const boards = await db.board.findMany();

  console.log(boards);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {boards.map((board) => (
        <div key={board.id}>{board.id}</div>
      ))}
    </main>
  );
}
