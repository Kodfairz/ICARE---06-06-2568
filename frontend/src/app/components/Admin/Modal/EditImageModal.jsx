"use client"; 
// บอก Next.js ว่าโค้ดนี้จะรันฝั่ง client เท่านั้น (React component ที่ต้องการ state, effect หรือ browser API)

import { API } from "../../../service/api"; 
// นำเข้า URL หรือค่า API base path จากไฟล์ service/api.js

import { useEffect, useState } from "react"; 
// นำเข้า React hook สำหรับการจัดการ state และ lifecycle

import axios from "axios"; 
// นำเข้าไลบรารี axios สำหรับเรียก API

import { useDropzone } from "react-dropzone";

export default function EditImageModal({ onClose, onSubmit, id }) {
    // ประกาศฟังก์ชันคอมโพเนนต์ EditImageModal ที่รับ props คือ
    // onClose - ฟังก์ชันสำหรับปิด modal
    // onSubmit - ฟังก์ชันสำหรับส่งข้อมูลเมื่อแก้ไขเสร็จ
    // id - รหัสผู้ใช้ที่จะแก้ไขข้อมูล

    const [image, setImage] = useState({ ImageName: "", ImageURL: "" });
    // กำหนด state สำหรับเก็บข้อมูลผู้ใช้ใหม่ในแบบฟอร์ม (เริ่มต้นเป็น AdminName ว่าง)

    const handleSubmit = (event) => {
        event.preventDefault(); 
        // ป้องกันการรีเฟรชหน้าเมื่อกด submit form

        onSubmit(image); 
        // เรียกฟังก์ชัน onSubmit ส่งข้อมูล newUser กลับไปให้ parent component

        setImage({ ImageName: "", ImageURL: "" }); 
        // ล้างข้อมูลฟอร์มหลัง submit
    };

    const fetchImage = async () => {
        // ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้จาก API ตาม id ที่ได้รับมา
        try {
            const response = await axios.get(`${API}/images/${id}`);
            // เรียก API ดึงข้อมูลผู้ใช้

            if (response.status == 200) {
                setImage(response.data.resultData);
                // ถ้าดึงข้อมูลสำเร็จ ให้อัปเดต state newUser ด้วยข้อมูลที่ได้
            }
        } catch (error) {
            console.log(error);
            // ถ้าเกิดข้อผิดพลาด ให้แสดงใน console (สามารถปรับเพิ่มการแจ้งเตือนได้)
        }
    };

    useEffect(() => {
        fetchImage();
        // เรียกฟังก์ชัน fetchUser ครั้งแรกเมื่อ component โหลดขึ้นมา (mount)
    }, []);

    const handleImageUpload = async (file) => {
    if (!file) {
      toast.error("กรุณาเลือกไฟล์รูปภาพ!");
      return null;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("รองรับเฉพาะไฟล์รูปภาพ!");
      return null;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", `jyvur9yd`);
    formData.append("folder", "icare");

    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/dcq3ijz0g/image/upload`,
            formData
        );
        return response.data.url;
        } catch (error) {
        console.error(
            "Error uploading image:",
            error.response?.data || error.message
        );
        toast.error("อัปโหลดรูปภาพไม่สำเร็จ");
        return null;
        }
    };

    const handleCoverImageUpload = async (file) => {
        const imageUrl = await handleImageUpload(file);
        if (imageUrl) {
        setImage((prev) => ({ ...prev, ImageURL: imageUrl }));
        }
    };

    const onDrop = (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
        handleCoverImageUpload(acceptedFiles[0]);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: "image/*",
    });

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            {/* ตัวแสดง modal ครอบคลุมหน้าจอ มีพื้นหลังสีดำโปร่งแสง */}
            <div className="relative bg-white rounded-xl p-6 w-full max-w-md shadow-2xl animate-fade-in-up">
                {/* กล่อง modal สีขาว มีขนาดจำกัด และเอฟเฟกต์ fade-in */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                >
                    ×
                    {/* ปุ่มกดปิด modal */}
                </button>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    แก้ไขรูปภาพ
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* ฟอร์มแก้ไขข้อมูล */}
                    <input
                        type="text"
                        placeholder="ชื่อรูปภาพ"
                        value={image.ImageName}
                        onChange={(e) => setImage({ ...image, ImageName: e.target.value })}
                        // อัปเดตค่า ImageName ใน state ทุกครั้งที่มีการพิมพ์ใน input
                        required
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />
                    {/* ช่องกรอก ImageName */}
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            รูปภาพ
                        </label>
                        <div
                            {...getRootProps()}
                            className="border-dashed border-2 border-gray-300 p-6 text-center cursor-pointer rounded-lg"
                        >
                            <input {...getInputProps()} />
                            <p className="text-gray-500">ลากและวางหรือเลือกไฟล์</p>
                            {image.ImageURL && (
                            <img
                                src={image.ImageURL}
                                alt="Cover"
                                className="max-w-xs max-h-60 w-full h-auto mx-auto rounded-lg mt-4 object-cover shadow"
                            />
                            )}
                        </div>
                    </div>
                    {/* ช่องกรอก ImageURL */}

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="flex-1 p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300"
                        >
                            แก้ไข
                        </button>
                        {/* ปุ่ม submit สำหรับส่งข้อมูลแก้ไข */}

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 p-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
                        >
                            ยกเลิก
                        </button>
                        {/* ปุ่มกดยกเลิก ปิด modal โดยไม่ส่งข้อมูล */}
                    </div>
                </form>
            </div>
        </div>
    );
}
