import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(req.url);
  const paymentId = url.searchParams.get("paymentId");
  if (!paymentId) return NextResponse.json({ error: "Missing paymentId" }, { status: 400 });

  try {
    const notes = await prisma.paymentNote.findMany({
      where: { paymentId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ notes });
  } catch (err) {
    console.error("notes GET error", err);
    return NextResponse.json({ error: "Could not fetch notes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const { paymentId, content } = body || {};
  if (!paymentId || !content || typeof content !== "string") {
    return NextResponse.json({ error: "paymentId and content are required" }, { status: 400 });
  }

  try {
    const note = await prisma.paymentNote.create({
      data: {
        payment: { connect: { id: paymentId } },
        content,
        authorId: session.user.id,
        authorName: session.user.name ?? undefined,
      },
    });
    return NextResponse.json({ note }, { status: 201 });
  } catch (err) {
    console.error("notes POST error", err);
    return NextResponse.json({ error: "Could not create note" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const { id, content } = body || {};
  if (!id || !content || typeof content !== "string") {
    return NextResponse.json({ error: "id and content are required" }, { status: 400 });
  }

  try {
    const note = await prisma.paymentNote.update({
      where: { id },
      data: { content },
    });
    return NextResponse.json({ note });
  } catch (err) {
    console.error("notes PATCH error", err);
    return NextResponse.json({ error: "Could not update note" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const { id } = body || {};
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    await prisma.paymentNote.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("notes DELETE error", err);
    return NextResponse.json({ error: "Could not delete note" }, { status: 500 });
  }
}