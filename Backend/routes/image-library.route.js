import { Elysia } from 'elysia'; // นำเข้า Elysia framework สำหรับสร้าง API
import { PrismaClient } from '@prisma/client'; // นำเข้า PrismaClient สำหรับเชื่อมต่อฐานข้อมูล

const prisma = new PrismaClient(); // สร้าง Prisma client instance

// สร้าง router สำหรับเส้นทาง /medic
export const ImageRoutes = new Elysia({ prefix: "/images" })

// GET /images
    .get("/", async () => {
        const images = await prisma.imagelibrary.findMany()

        if(!images) throw new Error("ไม่สามารถเรียกข้อมูลได้");

        return { "resultData" : images };
    })

// GET /images/:id
    .get("/:id", async ({ params }) => {
        const image = await prisma.imagelibrary.findFirst({
            where: {
                ImageID: Number(params.id)
            }
        })

        if(!image) throw new Error("ไม่สามารถเรียกข้อมูลได้");

        return { "resultData" : image };
    })

// POST /images
    .post("/", async ({ body }) => {
        // ตรวจสอบว่า title ซ้ำหรือไม่
        const image = await prisma.imagelibrary.findFirst({
            where : { ImageName : body.image_name }
        })

        if(image) throw new Error("มีข้อมูลนี้แล้ว");

        const newImage = await prisma.imagelibrary.create({
            data: {
                ImageName: body.image_name,
                ImageURL: body.image_url,
            }
        })

        if(!newImage) throw new Error("ไม่สามารถบันทึกข้อมูลได้");

        return { "resultData" : newImage };
    })

// PUT /images/:id
    .put("/:id", async ({ params, body }) => {
        const image = await prisma.imagelibrary.update({
            where: {
                ImageID: Number(params.id)
            },
            data: {
                ImageName: body.image_name,
                ImageURL: body.image_url,
            }
        })

        if(!image) throw new Error("ไม่สามารถบันทึกข้อมูลได้");

        return { "resultData" : image };
    })

// DELETE /images/:id
    .delete("/:id", async ({ params }) => {
        const image = await prisma.imagelibrary.delete({
            where: {
                ImageID: Number(params.id)
            }
        })

        if(!image) throw new Error("ไม่สามารถลบข้อมูลได้");

        return { "message" : "ลบข้อมูลสำเร็จ" };
    })