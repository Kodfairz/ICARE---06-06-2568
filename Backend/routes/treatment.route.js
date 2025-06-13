import { Elysia } from 'elysia'; // นำเข้า Elysia framework สำหรับสร้าง API
import { PrismaClient } from '@prisma/client'; // นำเข้า PrismaClient สำหรับเชื่อมต่อฐานข้อมูล

const prisma = new PrismaClient(); // สร้าง Prisma client instance

// สร้าง router สำหรับเส้นทาง /medic
export const TreatmentsRoutes = new Elysia({ prefix: "/treatments" })

// GET /treatments
    .get("/:id", async ({ params }) => {
        const treatments = await prisma.treatments.findFirst({
            where: {
                TreatmentID: Number(params.id)
            }
        })

        if(!treatments) throw new Error("ไม่สามารถเรียกข้อมูลได้");

        return { "resultData" : treatments };
    })

// GET /treatments
    .get("/diseases/:id", async ({ params }) => {
        const treatments = await prisma.disease_treatments.findMany({
            where: {
                DiseaseID: Number(params.id)
            },
            include: {
                treatments: true,
                diseases: true,
            }
        })

        if(!treatments) throw new Error("ไม่สามารถเรียกข้อมูลได้");

        return { "resultData" : treatments };
    })

// POST /diseases/treatments
    .post("/", async ({ body }) => {
        const treatments = await prisma.treatments.create({
            data: {
                TreatmentName: body.treatment_name,
                Description: body.description,
                Procedures: body.procedure,
                Duration: body.duration,
                SideEffects: body.side_effect ? body.side_effect : "-",
                Contraindications: body.contraindication ? body.contraindication : "-",
            }
        })

        const diseaseTreatment = await prisma.disease_treatments.create({
            data: {
                DiseaseID: Number(body.disease_id),
                TreatmentID: treatments.TreatmentID,
            }
        })

        if(!treatments || !diseaseTreatment) throw new Error("ไม่สามารถบันทึกข้อมูลได้");

        return { "resultData" : treatments };
    })

// PUT /diseases/treatments/:id
    .put("/:id", async ({ params, body }) => {
        const treatments = await prisma.treatments.update({
            where: {
                TreatmentID: Number(params.id)
            },
            data: {
                TreatmentName: body.treatment_name,
                Description: body.description,
                Procedures: body.procedure,
                Duration: body.duration,
                SideEffects: body.side_effect,
                Contraindications: body.contraindication,
            }
        })

        if(!treatments) throw new Error("ไม่สามารถบันทึกข้อมูลได้");

        return { "resultData" : treatments };
    })

// DELETE /treatments/:id
    .delete("/:id", async ({ params }) => {
        const treatments = await prisma.treatments.delete({
            where: {
                TreatmentID: Number(params.id)
            }
        })

        if(!treatments) throw new Error("ไม่สามารถลบข้อมูลได้");

        return { "message" : "ลบข้อมูลสำเร็จ" };
    })