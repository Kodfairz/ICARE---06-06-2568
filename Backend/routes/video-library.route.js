import { Elysia } from 'elysia'; // นำเข้า Elysia framework สำหรับสร้าง API
import { PrismaClient } from '@prisma/client'; // นำเข้า PrismaClient สำหรับเชื่อมต่อฐานข้อมูล

const prisma = new PrismaClient(); // สร้าง Prisma client instance

// สร้าง router สำหรับเส้นทาง /medic
export const VideoRoutes = new Elysia({ prefix: "/videos" })

// GET /videos
    .get("/", async () => {
        const videos = await prisma.videolibrary.findMany()

        if(!videos) throw new Error("ไม่สามารถเรียกข้อมูลได้");

        return { "resultData" : videos };
    })

// GET /videos/:id
    .get("/:id", async ({ params }) => {
        const video = await prisma.videolibrary.findFirst({
            where: {
                VideoID: Number(params.id)
            }
        })

        if(!video) throw new Error("ไม่สามารถเรียกข้อมูลได้");

        return { "resultData" : video };
    })

// POST /videos
    .post("/", async ({ body }) => {
        // ตรวจสอบว่า title ซ้ำหรือไม่
        const video = await prisma.videolibrary.findFirst({
            where : { VideoName : body.video_name }
        })

        if(video) throw new Error("มีข้อมูลนี้แล้ว");

        const newVideo = await prisma.videolibrary.create({
            data: {
                VideoName: body.video_name,
                VideoURL: body.video_url,
            }
        })

        if(!newVideo) throw new Error("ไม่สามารถบันทึกข้อมูลได้");

        return { "resultData" : newVideo };
    })

// PUT /videos/:id
    .put("/:id", async ({ params, body }) => {
        const video = await prisma.videolibrary.update({
            where: {
                VideoID: Number(params.id)
            },
            data: {
                VideoName: body.video_name,
                VideoURL: body.video_url,
            }
        })

        if(!video) throw new Error("ไม่สามารถบันทึกข้อมูลได้");

        return { "resultData" : video };
    })

// DELETE /videos/:id
    .delete("/:id", async ({ params }) => {
        const video = await prisma.videolibrary.delete({
            where: {
                VideoID: Number(params.id)
            }
        })

        if(!video) throw new Error("ไม่สามารถลบข้อมูลได้");

        return { "message" : "ลบข้อมูลสำเร็จ" };
    })