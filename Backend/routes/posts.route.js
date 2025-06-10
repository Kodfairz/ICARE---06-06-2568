import { Elysia } from 'elysia'; // นำเข้า Elysia framework สำหรับสร้าง API
import { PrismaClient } from '@prisma/client'; // นำเข้า PrismaClient สำหรับเชื่อมต่อฐานข้อมูล

const prisma = new PrismaClient(); // สร้าง Prisma client instance

// สร้าง router สำหรับเส้นทาง /posts
export const postRoutes = new Elysia({ prefix: "/posts" })

    // POST /posts - สร้างโพสต์ใหม่
    .post("/", async ({ body }) => {
        console.log("Creating new post with body:", body);
        // ตรวจสอบว่า title ซ้ำหรือไม่
        const diseases = await prisma.diseases.findFirst({
            where : { DiseaseName : body.name }
        })

        if(diseases) throw new Error("มีข้อมูลนี้แล้ว");

        // สร้างโรคใหม่
        const newDisease = await prisma.diseases.create({
            data : {
                DiseaseName : body.name,
                Description : body.description,
                CategoryID : Number(body.category_id),
                RiskFactors : body.risk_factors,
                Prevention : body.prevention,
                Symptoms : body.symptoms,
                Diagnosis : body.diagnosis,
                ICD10_Code : body.icd10_code,
            }
        })

        // สร้างรูปใหม่
        const newImage = await prisma.imagelibrary.create({
            data : {
                ImageName : body.image_name,
                ImageURL : body.image_url,
            }
        })

        // สร้างวิดีโอใหม่
        const newVideo = await prisma.videolibrary.create({
            data : {
                VideoName : body.video_name,
                VideoURL : body.video_url,
            }
        })

        // สร้างโพสต์ใหม่
        const newPost = await prisma.healtharticles.create({
            data : {
                DiseaseID : newDisease.id,
                AdminID : Number(body.admin_id),
                ImageID : newImage.id,
                VideoID : newVideo.id,
                Views : 0,
                isActive : body.isActive,
            }
        })

        if(!newPost) throw new Error("เพิ่มข้อมูลไม่สำเร็จ");

        return { "message" : "เพิ่มข้อมูลสำเร็จแล้ว" };
    })

    // GET /posts - ดึงโพสต์ทั้งหมดที่เปิดเผยอยู่ (isActive)
    .get("/", async () => {
        const healtharticles = await prisma.healtharticles.findMany({
            where : { isActive : true },
            include : { category : true }
        })

        if(!healtharticles) throw new Error("ไม่สามารถเรียกข้อมูลได้");

        return { "resultData" : healtharticles };
    })

    // GET /posts/post-recommend - ดึงโพสต์ยอดนิยม (views มากสุด 6 อันดับ)
    .get("/post-recommend", async () => {
        const healtharticles = await prisma.healtharticles.findMany({
            orderBy: { Views: 'desc' },
            include : { diseases : true },
            where : { isActive : true },
            take: 6 
        });

        if(!healtharticles) throw new Error("ไม่สามารถเรียกข้อมูลได้");

        return { "resultData" : healtharticles };
    })

    // GET /posts/admin - ดึงโพสต์ทั้งหมด (รวมโพสต์ที่ไม่ active)
    .get("/admin", async () => {
        const healtharticles = await prisma.healtharticles.findMany({
            include : {
                diseases : true,
            }
        })

        if(!healtharticles) throw new Error("ไม่สามารถเรียกข้อมูลได้");

        return { "resultData" : healtharticles };
    })

    // PATCH /posts/change-status/:id - เปลี่ยนสถานะการเผยแพร่ของโพสต์
    .patch("/change-status/:id", async ({ body, params }) => {
        const healtharticles = await prisma.healtharticles.findFirst({
            where : { HealthArticleID : Number(params.id) }
        })

        if(!healtharticles) throw new Error("ไม่เจอข้อมูล");

        const updateHealtharticles = await prisma.healtharticles.update({
            data : {
                isActive : body.isActive,
            },
            where : { HealthArticleID : Number(params.id) }
        })

        await prisma.articleedits.create({
            data : {
                HealthArticleID : healtharticles.HealthArticleID,
                AdminID : Number(body.admin_id),
                EditDescription : "เปลี่ยนสถานะการเผยแพร่",
            }
        })

        if(!updateHealtharticles) throw new Error("ไม่สามารถเปลี่ยนแปลงสถานะการเผยแพร่ได้");

        return { "message" : "เปลี่ยนสถานะสำเร็จ" };
    })

    // DELETE /posts/:id - ลบโพสต์
    .delete("/:id", async ({ params }) => {
        const healtharticles = await prisma.healtharticles.findFirst({
            where : { HealthArticleID : Number(params.id) }
        })

        if(!healtharticles) throw new Error("ไม่เจอข้อมูล");

        const deleteHealtharticles = await prisma.healtharticles.delete({
            where : { HealthArticleID : Number(params.id) }
        })

        const deleteDeseases = await prisma.diseases.delete({
            where: { id: healtharticles.DiseaseID }
        })

        if(!deleteHealtharticles) throw new Error("ไม่สามารถลบข้อมูลได้");

        return { "message" : "ลบข้อมูลสำเร็จ" };
    })

    // GET /posts/:id - ดึงข้อมูลโพสต์ตาม ID
    .get("/:id", async ({ params }) => {
        const healtharticles = await prisma.healtharticles.findFirst({
            where : { HealthArticleID : Number(params.id) },
            include: {
                diseases: true,
            }
        })

        if(!healtharticles) throw new Error("ไม่เจอข้อมูล");

        return { "resultData" : healtharticles };
    })

    // PUT /posts/:id - แก้ไขข้อมูลโพสต์
    .put("/:id", async ({ body, params }) => {
        const healtharticles = await prisma.healtharticles.findFirst({
            where : { DiseaseID : Number(params.id) }
        })

        if(!healtharticles) throw new Error("ไม่เจอข้อมูล");

        const updateDisease = await prisma.diseases.update({
            where: { DiseaseID: healtharticles.DiseaseID },
            data: {
                DiseaseName: body.name,
                Description: body.description,
                CategoryID: Number(body.category_id),
                RiskFactors: body.risk_factors,
                Prevention: body.prevention,
                Symptoms: body.symptoms,
                Diagnosis: body.diagnosis,
                ICD10_Code: body.icd10_code,
                isActive: body.isActive
            }
        })

        await prisma.articleedits.create({
            data : {
                HealthArticleID : healtharticles.HealthArticleID,
                AdminID : Number(body.admin_id),
                EditDescription : body.edit_description,
            }
        })

        if(!updateDisease) throw new Error("ไม่สามารถแก้ไขข้อมูลได้");

        return { "message" : "แก้ไขข้อมูลสำเร็จ" };
    })

    // GET /posts/user/:id - ดูโพสต์เฉพาะ ID และเพิ่มยอด View
    .get("/user/:id", async ({ params }) => {
        const healtharticles = await prisma.healtharticles.findFirst({
            where : { id : Number(params.id) },
            include : {
                diseases: true,
                category: true,
                imagelibrary: true,
                videolibrary: true
            }
        })

        if(!healtharticles) throw new Error("ไม่เจอข้อมูล");

        // อัปเดตยอดผู้ชม
        const updateView = await prisma.healtharticles.update({
            where : { HealthArticleID : Number(params.id) },
            data : { Views : healtharticles.Views + 1 }
        })

        return { "resultData" : healtharticles };
    })
