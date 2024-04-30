import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { BoardNavbar } from "./_components/board-nav-bar";

export async function generateMetadata({
  params,
}: {
  params: { boardId: string };
}) {
  const { orgId } = auth();

  if (!orgId) {
    return {
      title: "Board",
    };
  }

  const board = await db.board.findUnique({
    where: {
      orgId,
      id: params.boardId,
    },
  });

  return {
    title: `${board?.title}`,
  };
}

const BoardIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { boardId: string };
}) => {
  const { orgId } = auth();

  if (!orgId) {
    return redirect(`/select-org`);
  }

  const board = await db.board.findUnique({
    where: {
      orgId,
      id: params.boardId,
    },
  });

  if (!board) {
    notFound();
  }

  return (
    <div
      style={{
        backgroundImage: `url(${board.imageFullUrl})`,
      }}
      className="relative h-full bg-no-repeat bg-center bg-cover"
    >
      <BoardNavbar board={board} />
      <main className="relative pt-28 h-full">{children}</main>
    </div>
  );
};
export default BoardIdLayout;
