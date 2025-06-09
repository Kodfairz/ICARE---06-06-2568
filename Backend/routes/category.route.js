import { Elysia } from 'elysia'; // นำเข้า Elysia สำหรับสร้าง HTTP server
import { PrismaClient } from '@prisma/client'; // นำเข้า PrismaClient เพื่อเชื่อมต่อฐานข้อมูล

const prisma = new PrismaClient(); // สร้าง instance ของ PrismaClient

// ประกาศ route สำหรับจัดการข้อมูล category (ประเภทโรค) โดยใช้ prefix /category
export const categoryRoutes = new Elysia({ prefix : "/category" })

    // GET /category - ดึงข้อมูลประเภทโรคทั้งหมด
    .get("/", async () => {
        const categories = await prisma.categories.findMany({}) // ดึงข้อมูลทั้งหมดจากตาราง categories

        return {
            "resultData" : categories
        }
    })

    // POST /category - สร้างประเภทโรคใหม่
    .post("/", async ({ body }) => {
        // ตรวจสอบว่ามีชื่อซ้ำในระบบหรือไม่
        const category = await prisma.categories.findFirst({
            where : {
                CategoryName : body.CategoryName
            }
        })

        if(category) {
            throw new Error("ชื่อประเภทโรคซ้ำ")
        }

        // สร้างข้อมูล category ใหม่
        const newCategory = await prisma.categories.create({
            data : {
                CategoryName : body.CategoryName
            }
        })
        
        if(!newCategory) {
            throw new Error("สร้างประเภทโรคไม่สำเร็จ")
        }

        return {
            "message" : "สร้างประเภทโรคสำเร็จแล้ว"
        }
    })

    // PUT /category/:id - แก้ไขข้อมูลประเภทโรคตาม ID
    .put("/:id", async ({ body, params }) => {
        // ตรวจสอบว่ามี category ตาม ID หรือไม่
        const category = await prisma.categories.findFirst({
            where : {
                CategoryID : Number(params.id)
            }
        })

        if(!category) {
            throw new Error("ไม่พบไอดีประเภทโรค")
        }

        // แก้ไขข้อมูล category
        const editCategory = await prisma.categories.update({
            where : {
                CategoryID : Number(params.id),
            },
            data : {
                CategoryName : body.CategoryName
            }
        })

        if(!editCategory) {
            throw new Error("แก้ไขประเภทโรคไม่สำเร็จ")
        }

        return {
            "message" : "แก้ไขประเภทโรคสำเร็จ"
        }
    })

    // DELETE /category/:id - ลบประเภทโรคตาม ID
    .delete("/:id", async ({ params }) => {
        // ตรวจสอบว่ามี category ตาม ID หรือไม่
        const category = await prisma.categories.findFirst({
            where : {
                CategoryID : Number(params.id)
            },
        })

        if(!category) {
            throw new Error("ไม่พบประเภทโรค")
        }

        // ลบ category
        const deleteCategory = await prisma.categories.delete({
            where : {
                CategoryID : Number(params.id)
            }
        })

        if(!deleteCategory) {
            throw new Error("ลบประเภทโรคไม่สำเร็จ")
        }

        return {
            "message" : "ลบประเภทโรคสำเร็จ"
        }
    })

    // GET /category/:id - ดึงข้อมูลประเภทโรคตาม ID
    .get("/:id", async ({ params }) => {
        const category = await prisma.categories.findFirst({
            where : {
                CategoryID : Number(params.id)
            }
        })

        if(!category) {
            throw new Error("ไม่สามารถเรียกข้อมูลประเภทโรคได้")
        }

        return {
            "resultData" : category
        }
    })
