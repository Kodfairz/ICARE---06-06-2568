"use client"; 
// ประกาศว่า component นี้ทำงานบน client side (ใน browser) ไม่ใช่ server side

import { useState } from "react"; 
// import useState hook สำหรับเก็บสถานะใน component

import axios from "axios";
import { useDropzone } from "react-dropzone";

// ประกาศฟังก์ชันคอมโพเนนต์ AddImageModal ซึ่งรับ props 2 ตัวคือ onClose และ onSubmit
export default function AddImageModal({ onClose, onSubmit }) {
    // สร้าง state เก็บข้อมูลผู้ใช้ใหม่ โดยเริ่มจาก AdminName และ password เป็นค่าว่าง
    const [newImage, setNewImage] = useState({ ImageName: "", ImageURL: "" });

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
      setNewImage((prev) => ({ ...prev, ImageURL: imageUrl }));
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

    // ฟังก์ชันจัดการเมื่อ submit ฟอร์ม
    const handleSubmit = (event) => {
        event.preventDefault(); // ป้องกันไม่ให้หน้าเว็บรีเฟรชตามปกติของฟอร์ม
        onSubmit(newImage); // เรียกฟังก์ชัน onSubmit ที่ส่งมาจาก props พร้อมข้อมูลผู้ใช้ใหม่
        setNewImage({ ImageName: "", ImageURL: "" }); // เคลียร์ข้อมูลฟอร์มให้ว่างหลังส่งข้อมูลแล้ว
    };

    return (
        // กล่อง modal ครอบเต็มหน้าจอ
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            {/* กล่องเนื้อหา modal */}
            <div className="relative bg-white rounded-xl p-6 w-full max-w-md shadow-2xl animate-fade-in-up">
                {/* ปุ่มกากบาท ปิด modal */}
                <button
                    onClick={onClose} // เมื่อคลิกเรียก onClose จาก props เพื่อปิด modal
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                >
                    ×
                </button>

                {/* หัวข้อ modal */}
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    เพิ่มรูปภาพ
                </h2>

                {/* ฟอร์มเพิ่มแอดมิน */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* ช่องกรอก ชื่อรูปภาพ */}
                    <input
                        type="text"
                        placeholder="ชื่อรูปภาพ"
                        value={newImage.ImageName} // ผูกค่า input กับ state newUser.AdminName
                        onChange={(e) => setNewImage({ ...newImage, ImageName: e.target.value })} 
                        // เมื่อเปลี่ยนแปลง input จะอัปเดต state โดยไม่ลบค่าอื่น ๆ (spread operator ...)
                        required // กำหนดให้ช่องนี้ต้องกรอก
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />
                    {/* ช่องกรอก ลิงก์รูปภาพ */}
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
                            {newImage.ImageURL && (
                            <img
                                src={newImage.ImageURL}
                                alt="Cover"
                                className="max-w-xs max-h-60 w-full h-auto mx-auto rounded-lg mt-4 object-cover shadow"
                            />
                            )}
                        </div>
                    </div>
                    <div className="flex gap-4">
                        {/* ปุ่ม submit ฟอร์ม */}
                        <button
                            type="submit"
                            className="flex-1 p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300"
                        >
                            เพิ่ม
                        </button>
                        {/* ปุ่มกดเพื่อปิด modal */}
                        <button
                            type="button"
                            onClick={onClose} // ปิด modal
                            className="flex-1 p-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
                        >
                            ลบ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
