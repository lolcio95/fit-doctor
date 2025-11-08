import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.sub) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const userId = token.sub; // dla next-auth przy Mongo token.sub == user.id
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        // settings: true,
        notificationsEnabled: true,
      },
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ error: "Not found" }), { status: 404 });
    }

    return NextResponse.json({
      // settings: user.settings ?? null,
      notificationsEnabled: user.notificationsEnabled ?? false,
    });
  } catch (err: any) {
    console.error("GET /api/user/settings error:", err);
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.sub) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const body = await req.json();
    // oczekujemy { notificationsEnabled?: boolean, settings?: any }
    const { notificationsEnabled, settings } = body as { notificationsEnabled?: boolean; settings?: any };

    const userId = token.sub;

    const data: any = {};
    if (typeof notificationsEnabled === "boolean") data.notificationsEnabled = notificationsEnabled;
    if (typeof settings !== "undefined") data.settings = settings;

    if (Object.keys(data).length === 0) {
      return new NextResponse(JSON.stringify({ error: "Nothing to update" }), { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, notificationsEnabled: true },
    });

    return NextResponse.json({ user: updated });
  } catch (err: any) {
    console.error("PATCH /api/user/settings error:", err);
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}