import { Elysia } from 'elysia';             // นำเข้า Elysia framework สำหรับสร้าง API server
import { PrismaClient } from '@prisma/client';  // นำเข้า PrismaClient สำหรับเชื่อมต่อฐานข้อมูล

const prisma = new PrismaClient();           // สร้าง instance ของ PrismaClient เพื่อใช้ query database

// กำหนด route group ที่มี prefix เป็น /video
export const videoRoutes = new Elysia({ prefix : "/video" })
.get("/", async () => {                       // GET /video : ดึงข้อมูลวิดีโอทั้งหมด
    const video = await prisma.videoarticles.findMany({
        include : {
            videolibrary: true,         // รวมข้อมูลวิดีโอที่เกี่ยวข้อง
            imagelibrary: true,
            admins: true,
        }
    })

    if(!video) {                             // ถ้าไม่มีข้อมูลวิดีโอ
        throw new Error("ไม่สามารถเรียกวิดีโอได้");  // โยน error แจ้งว่าไม่สามารถดึงข้อมูลได้
    }

    return {
        "resultData" : video                  // ส่งข้อมูลวิดีโอทั้งหมดกลับไป
    }
})
.get("/video-recommend", async () => {       // GET /video/video-recommend : ดึงวิดีโอแนะนำ
    const video = await prisma.videoarticles.findMany({
        orderBy: {
            Views: 'desc',                   // เรียงตามจำนวนวิวมากไปน้อย
        },
        take: 6 ,                           // เอาแค่ 6 รายการ
        include : {
            videolibrary: true,              // รวมข้อมูลวิดีโอที่เกี่ยวข้อง
            imagelibrary: true,
        },
        where : {
            isActive : true                  // เฉพาะวิดีโอที่ active เท่านั้น
        }
    });

    if(!video) {                            // ถ้าไม่มีข้อมูล
        throw new Error("ไม่สามารถเรียกวิดีโอได้");  // โยน error
    }

    return {
        "resultData" : video                 // ส่งข้อมูลวิดีโอแนะนำกลับ
    }
})
.get("/user", async () => {                  // GET /video/user : ดึงวิดีโอที่ active ทั้งหมด (เหมือน /video)
    const video = await prisma.videoarticles.findMany({
        where : {
            isActive : true                  // เฉพาะวิดีโอ active
        },
        include : {
            videolibrary: true,              // รวมข้อมูลวิดีโอที่เกี่ยวข้อง
        }
    })

    if(!video) {                            // ถ้าไม่มีข้อมูล
        throw new Error("ไม่สามารถเรียกวิดีโอได้");  // โยน error
    }

    return {
        "resultData" : video                 // ส่งข้อมูลวิดีโอกลับ
    }
})
.post("/", async ({ body }) => {             // POST /video : เพิ่มวิดีโอใหม่
    const video = await prisma.videoarticles.findFirst({
        where : {
            Title : body.title               // ตรวจสอบว่ามีวิดีโอที่ชื่อเดียวกันหรือไม่
        }
    })

    if(video) {                             // ถ้ามีชื่อซ้ำ
        throw new Error("ชื่อวิดีโอซ้ำ")       // โยน error แจ้งชื่อซ้ำ
    }

    const newVideo = await prisma.videoarticles.create({
        data : {
            Title : body.title,
            Description : body.description,
            ImageID : body.image_id,
            VideoID : body.video_id,  // ใช้ VideoID ที่สร้างใหม่
            AdminID : Number(body.admin_id),  // ใช้ admin_id ที่ส่งมา
            Views : 0,                // เริ่มต้นวิวที่ 0
            isActive : body.isActive,  // ใช้สถานะ active ที่ส่งมา
        }
    })

    if(!newVideo) {                         // ถ้าเพิ่มวิดีโอไม่สำเร็จ
        throw new Error("ไม่สามารถเพิ่มวิดีโอได้");
    }

    return {
        "message" : "เพิ่มวิดีโอสำเร็จ"       // แจ้งผลสำเร็จ
    }
})
.put("/:id", async ({ body, params }) => {  // PUT /video/:id : แก้ไขข้อมูลวิดีโอตาม id
    const video = await prisma.videoarticles.findFirst({
        where : {
            VideoArticleID : Number(params.id)            // หา video ที่มี id ตรงกับ param
        }
    })

    if(!video) {                            // ถ้าไม่เจอวิดีโอ
        throw new Error("ไม่เจอวิดีโอ")
    }

    const updateVideo = await prisma.videoarticles.update({
        where : {
            VideoArticleID : Number(params.id)            // อัปเดตวิดีโอตาม id
        },
        data : {
            Title : body.title,
            Description : body.description,
            ImageID : body.image_id,
            VideoID : body.video_id,
            AdminID : Number(body.admin_id),
            isActive : body.isActive,
        }
    })

    if(!updateVideo) {                      // ถ้าแก้ไขไม่สำเร็จ
        throw new Error("แก้ไขวิดีโอไม่สำเร็จ")
    }

    return {
        "message" : "แก้ไขวิดีโอสำเร็จ"        // แจ้งผลสำเร็จ
    }
})
.get("/:id", async ({ params }) => {         // GET /video/:id : ดึงข้อมูลวิดีโอตาม id
    const video = await prisma.videoarticles.findFirst({
        where : {
            VideoArticleID : Number(params.id)            // หา video ตาม id
        },
        include : {                          // รวมข้อมูลผู้ใช้ที่เกี่ยวข้องกับ video
            videolibrary: true,              // รวมข้อมูลวิดีโอ
            imagelibrary: true,
        }
    })

    return {
        "resultData" : video                 // ส่งข้อมูลวิดีโอกลับ
    }
})
.get("/user/:id", async ({ params }) => {         // GET /video/user/:id : ดึงข้อมูลวิดีโอตาม id
    const video = await prisma.videoarticles.findFirst({
        where : {
            VideoArticleID : Number(params.id)            // หา video ตาม id
        },
        include : {                          // รวมข้อมูลผู้ใช้ที่เกี่ยวข้องกับ video
            videolibrary: true,              // รวมข้อมูลวิดีโอ
            imagelibrary: true,
        }
    })

    if(!video) {                            // ถ้าไม่เจอวิดีโอ
        throw new Error("ไม่มีวิดีโอ")
    }

    const updateView = await prisma.videoarticles.update({
        where : {
            VideoArticleID : Number(params.id)            // อัปเดตจำนวนวิวเพิ่ม 1
        },
        data : {
            Views : video.Views + 1
        }
    })

    return {
        "resultData" : video                 // ส่งข้อมูลวิดีโอกลับ
    }
})
.delete("/:id", async ({ params }) => {      // DELETE /video/:id : ลบวิดีโอตาม id
    const video = await prisma.videoarticles.findFirst({
        where : {
            VideoArticleID : Number(params.id)            // หา video ตาม id
        }
    })

    if(!video) {                            // ถ้าไม่เจอวิดีโอ
        throw new Error("ไม่มีวิดีโอ");
    }

    const deleteVideo = await prisma.videoarticles.delete({
        where : {
            VideoArticleID : Number(params.id)            // ลบวิดีโอตาม id
        }
    })

    if(!deleteVideo) {                      // ถ้าลบไม่สำเร็จ
        throw new Error("ลบวิดีโอไม่สำเร็จ")
    }

    return {
        "message" : "ลบวิดีโอสำเร็จ"          // แจ้งผลสำเร็จ
    }
})
.patch("/change-status/:id", async ({ body, params }) => {  // PATCH /video/change-status/:id : เปลี่ยนสถานะ isActive
    console.log(body)
    const video = await prisma.videoarticles.findFirst({
        where : {
            VideoArticleID : Number(params.id)            // หา video ตาม id
        }
    })

    if(!video) {                            // ถ้าไม่เจอวิดีโอ
        throw new Error("ไม่เจอวิดีโอ")
    }

    const updateVideo = await prisma.videoarticles.update({
        where : {
            VideoArticleID : Number(params.id)
        },
        data : {
            AdminID : Number(body.admin_id),  // อัปเดต admin_id
            isActive : body.isActive,        // อัปเดตสถานะ isActive
        },
    })

    if(!updateVideo) {                      // ถ้าเปลี่ยนสถานะไม่สำเร็จ
        throw new Error("ไม่สามารถเปลี่ยนแปลงสถานะการเผยแพร่ได้")
    }

    return {
        "message" : "เปลี่ยนสถานะสำเร็จ"      // แจ้งผลสำเร็จ
    }

})
