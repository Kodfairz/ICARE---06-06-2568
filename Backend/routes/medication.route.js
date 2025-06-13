import { Elysia } from 'elysia'; // นำเข้า Elysia framework สำหรับสร้าง API
import { PrismaClient } from '@prisma/client'; // นำเข้า PrismaClient สำหรับเชื่อมต่อฐานข้อมูล

const prisma = new PrismaClient(); // สร้าง Prisma client instance

// สร้าง router สำหรับเส้นทาง /medic
export const MedicationsRoutes = new Elysia({ prefix: "/medics" })

// GET /medics
    .get("/:id", async ({ params }) => {
        const medics = await prisma.medications.findFirst({
            where: {
                MedicationID: Number(params.id)
            }
        })

        if(!medics) throw new Error("ไม่สามารถเรียกข้อมูลได้");

        return { "resultData" : medics };
    })

// GET /medics
    .get("/diseases/:id", async ({ params }) => {
        const medics = await prisma.disease_medications.findMany({
            where: {
                DiseaseID: Number(params.id)
            },
            include: {
                medications: true,
                diseases: true,
            }
        })

        if(!medics) throw new Error("ไม่สามารถเรียกข้อมูลได้");

        return { "resultData" : medics };
    })

// POST /diseases/medics
    .post("/", async ({ body }) => {
        const medics = await prisma.medications.create({
            data: {
                MedicationName: body.medic_name,
                GenericName: body.generic_name,
                DosageForm: body.dosage,
                Strength: body.strength,
                Indications: body.indication ? body.indication : "-",
                SideEffects: body.side_effect ? body.side_effect : "-",
                Contraindications: body.contraindication ? body.contraindication : "-",
                SymptomsDrugAllergies: body.symptoms_drug_allergies ? body.symptoms_drug_allergies : "-",
                TreatDrugAllergies: body.treat_drug_allergies ? body.treat_drug_allergies : "-",
            }
        })

        const diseaseMedic = await prisma.disease_medications.create({
            data: {
                DiseaseID: Number(body.disease_id),
                MedicationID: medics.MedicationID,
            }
        })

        if(!medics || !diseaseMedic) throw new Error("ไม่สามารถบันทึกข้อมูลได้");

        return { "resultData" : medics };
    })

// PUT /diseases/medics/:id
    .put("/:id", async ({ params, body }) => {
        const medics = await prisma.medications.update({
            where: {
                MedicationID: Number(params.id)
            },
            data: {
                MedicationName: body.medic_name,
                GenericName: body.generic_name,
                DosageForm: body.dosage,
                Strength: body.strength,
                Indications: body.indication,
                SideEffects: body.side_effect,
                Contraindications: body.contraindication,
                SymptomsDrugAllergies: body.symptoms_drug_allergies,
                TreatDrugAllergies: body.treat_drug_allergies,
            }
        })

        if(!medics) throw new Error("ไม่สามารถบันทึกข้อมูลได้");

        return { "resultData" : medics };
    })

// DELETE /medics/:id
    .delete("/:id", async ({ params }) => {
        const medics = await prisma.medications.delete({
            where: {
                MedicationID: Number(params.id)
            }
        })

        if(!medics) throw new Error("ไม่สามารถลบข้อมูลได้");

        return { "message" : "ลบข้อมูลสำเร็จ" };
    })