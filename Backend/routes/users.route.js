import { Elysia } from 'elysia';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'; // ใช้สำหรับเข้ารหัสรหัสผ่าน
import jwt from 'jsonwebtoken'; // ใช้สำหรับสร้าง JWT token

const prisma = new PrismaClient();

// สร้าง routes สำหรับจัดการข้อมูลผู้ใช้ โดยใช้ prefix /users
export const userRoutes = new Elysia({ prefix: "/users" })

    // ดึงผู้ใช้ทั้งหมด
    .get('/', async () => {
        return await prisma.admins.findMany();
    })

    // สมัครผู้ใช้ใหม่
    .post('/', async ({ body }) => {
        // ตรวจสอบว่ามี username นี้ในระบบหรือยัง
        const admin = await prisma.admins.findFirst({
            where: {
                AdminName: body.username
            }
        });

        // ถ้ามีแล้วให้แจ้งว่าไม่สามารถสมัครซ้ำได้
        if (admin) {
            throw new Error("มีผู้ใช้งานนี้แล้ว");
        }

        // เข้ารหัสรหัสผ่านก่อนบันทึก
        const password = bcrypt.hashSync(body.password, 10);

        // สร้างผู้ใช้ใหม่
        return await prisma.admins.create({
            data: {
                AdminName: body.username,
                Password: password,
                isActive: true // ตั้งค่าเริ่มต้นให้ผู้ใช้เปิดใช้งาน
            }
        });
    })

    // ล็อกอินผู้ใช้
    .post("/login", async ({ body }) => {
        // ตรวจสอบว่ามีผู้ใช้นี้หรือไม่
        const admin = await prisma.admins.findFirst({
            where: {
                AdminName: body.username
            }
        });

        if (!admin) {
            throw new Error("ไม่พบผู้ใช้งาน");
        }

        // ตรวจสอบว่าผู้ใช้ถูกเปิดใช้งานอยู่หรือไม่
        if (!admin.isActive) {
            throw new Error("ผู้ใช้ปิดใช้งาน");
        }

        // ตรวจสอบความถูกต้องของรหัสผ่าน
        const isPasswordMatch = bcrypt.compareSync(body.password, admin.Password);

        if (!isPasswordMatch) {
            throw new Error("รหัสผ่านไม่ถูกต้อง");
        }

        // สร้าง JWT token เพื่อส่งกลับไปให้ client
        const token = jwt.sign({
            data: {
                "username": admin.AdminName,
                "id": admin.AdminID,
                "isActive": admin.isActive
            }
        }, 'secret', { expiresIn: '24h' }); // หมายเหตุ: ควรใช้ secret จาก .env

        // ส่ง token และข้อมูลผู้ใช้กลับ
        return {
            "token": token,
            "resultData": {
                "username": admin.AdminName,
                "id": admin.AdminID,
                "isActive": admin.isActive
            }
        };
    })

    // แก้ไขชื่อผู้ใช้งาน
    .put("/:id", async ({ body, params }) => {
        // ตรวจสอบว่าผู้ใช้มีอยู่จริงหรือไม่
        const admin = await prisma.admins.findFirst({
            where: {
                AdminID: Number(params.id)
            }
        });

        if (!admin) {
            throw new Error("ไม่พบผู้ใช้งาน");
        }

        // อัปเดตชื่อผู้ใช้
        const updateAdmin = await prisma.admins.update({
            where: {
                AdminID: Number(params.id)
            },
            data: {
                AdminName: body.username
            }
        });

        if (!updateAdmin) {
            throw new Error("ไม่สามารถแก้ไขข้อมูลได้");
        }

        return {
            "message": "แก้ไขข้อมูลสำเร็จ"
        };
    })

    // เปลี่ยนรหัสผ่านผู้ใช้
    .put("/change-password/:id", async ({ body, params }) => {
        // ค้นหาผู้ใช้ตาม id
        const admin = await prisma.admins.findFirst({
            where: {
                AdminID: Number(params.id)
            }
        });

        // ตรวจสอบรหัสผ่านเดิมว่าตรงหรือไม่
        const isPasswordMatch = bcrypt.compareSync(body.oldPassword, admin.Password);

        if (!isPasswordMatch) {
            throw new Error("รหัสผ่านเดิมไม่ถูกต้อง");
        }

        // เข้ารหัสรหัสผ่านใหม่
        const newPassword = bcrypt.hashSync(body.newPassword, 10);

        // อัปเดตรหัสผ่านใหม่
        const updateUser = await prisma.admins.update({
            where: {
                AdminID: Number(params.id)
            },
            data: {
                Password: newPassword
            }
        });

        if (!updateUser) {
            throw new Error("ไม่สามารถเปลี่ยนรหัสผ่านได้");
        }

        return {
            "message": "เปลี่ยนรหัสผ่านสำเร็จ"
        };
    })

    // เปลี่ยนสถานะการใช้งาน (active/inactive)
    .patch("/status/:id", async ({ params }) => {
        const admin = await prisma.admins.findFirst({
            where: {
                AdminID: Number(params.id)
            }
        });

        if (!admin) {
            throw new Error("ไม่พบผู้ใช้งาน");
        }

        // toggle ค่าสถานะ
        const updateAdmin = await prisma.admins.update({
            where: {
                AdminID: Number(params.id)
            },
            data: {
                isActive: !admin.isActive
            }
        });

        if (!updateAdmin) {
            throw new Error("ไม่สามารถเปลี่ยนสถานะได้");
        }

        return {
            "message": "เปลี่ยนสถานะสำเร็จ"
        };
    })

    // ลบผู้ใช้งาน
    .delete("/:id", async ({ params }) => {
        const admin = await prisma.admins.findFirst({
            where: {
                AdminID: Number(params.id)
            }
        });

        if (!admin) {
            throw new Error("ไม่พบผู้ใช้งาน");
        }

        const deleteAdmin = await prisma.admins.delete({
            where: {
                AdminID: Number(params.id)
            }
        });

        if (!deleteAdmin) {
            throw new Error("ไม่สามารถลบข้อมูลได้");
        }

        return {
            "message": "ลบข้อมูลสำเร็จ"
        };
    })

    // ดึงข้อมูลผู้ใช้รายบุคคล
    .get("/:id", async ({ params }) => {
        const admin = await prisma.admins.findFirst({
            where: {
                AdminID: Number(params.id)
            }
        });

        if (!admin) {
            throw new Error("ไม่พบผู้ใช้งาน");
        }

        return {
            "resultData": admin
        };
    });
