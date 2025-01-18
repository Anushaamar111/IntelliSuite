import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import {auth} from "@clerk/nextjs/server"

const prisma = new PrismaClient()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
    const authResult = await auth()
    const userId = authResult.userId
    console.log('API endpoint /api/videos hit');
    if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

    try {
        const videos = await prisma.video.findMany({
            orderBy: { UploadedAt: "desc" },
            where: { userId },
        })
        return NextResponse.json(videos)
    
    } catch (error) {
        return NextResponse.json({error: "Error fetching videos"}, {status: 500})
    } finally {
        await prisma.$disconnect()
    }
}