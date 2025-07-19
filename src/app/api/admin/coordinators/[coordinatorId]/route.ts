import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { coordinatorId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Check if coordinator exists and is a coordinator
    const coordinator = await prisma.user.findUnique({
      where: {
        id: params.coordinatorId,
        role: "COORDINATOR",
      },
      include: {
        coordinatedClubs: true,
      },
    });

    if (!coordinator) {
      return new NextResponse("Coordinator not found", { status: 404 });
    }

    // Check if coordinator has any clubs
    if (coordinator.coordinatedClubs.length > 0) {
      return new NextResponse("Cannot delete coordinator with active clubs", { status: 400 });
    }

    // Delete the coordinator
    await prisma.user.delete({
      where: {
        id: params.coordinatorId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[COORDINATOR_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 