"use client"; 
// ประกาศว่า component นี้ทำงานบน client side (ใน browser) ไม่ใช่ server side

import { useState } from "react"; 
// import useState hook สำหรับเก็บสถานะใน component

// ประกาศฟังก์ชันคอมโพเนนต์ AddVideoModal ซึ่งรับ props 2 ตัวคือ onClose และ onSubmit
export default function AddVideoModal({ onClose, onSubmit }) {
    // สร้าง state เก็บข้อมูลผู้ใช้ใหม่ โดยเริ่มจาก AdminName และ password เป็นค่าว่าง
    const [newVideo, setNewVideo] = useState({ VideoName: "", VideoURL: "" });

    const renderVideoPreview = (link) => {
        const youtubePattern =
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = link.match(youtubePattern);
        if (match) {
        const videoId = match[1];
        return (
            <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            />
        );
        }
        return null;
    };

    // ฟังก์ชันจัดการเมื่อ submit ฟอร์ม
    const handleSubmit = (event) => {
        event.preventDefault(); // ป้องกันไม่ให้หน้าเว็บรีเฟรชตามปกติของฟอร์ม
        onSubmit(newVideo); // เรียกฟังก์ชัน onSubmit ที่ส่งมาจาก props พร้อมข้อมูลผู้ใช้ใหม่
        setNewVideo({ VideoName: "", VideoURL: "" }); // เคลียร์ข้อมูลฟอร์มให้ว่างหลังส่งข้อมูลแล้ว
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
                    เพิ่มวิดีโอ
                </h2>

                {/* ฟอร์มเพิ่มแอดมิน */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* ช่องกรอก ชื่อวิดีโอ */}
                    <label
                            htmlFor="newVideo"
                            className="block text-lg font-medium text-gray-700 mb-2"
                        >
                            ชื่อวิดีโอ
                        </label>
                    <input
                        type="text"
                        placeholder="ชื่อวิดีโอ"
                        value={newVideo.VideoName} // ผูกค่า input กับ state newUser.AdminName
                        onChange={(e) => setNewVideo({ ...newVideo, VideoName: e.target.value })} 
                        // เมื่อเปลี่ยนแปลง input จะอัปเดต state โดยไม่ลบค่าอื่น ๆ (spread operator ...)
                        required // กำหนดให้ช่องนี้ต้องกรอก
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />
                    {/* ช่องกรอก ลิงก์วิดีโอ */}
                    <div>
                        <label
                            htmlFor="newVideo"
                            className="block text-lg font-medium text-gray-700 mb-2"
                        >
                            ลิงก์วิดีโอ
                        </label>
                        <input
                            type="url"
                            id="newVideo"
                            value={newVideo.VideoURL}
                            onChange={(e) => setNewVideo({ ...newVideo, VideoURL: e.target.value })}
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                            placeholder="กรอกลิงก์วิดีโอ"
                        />
                        {newVideo.VideoURL && (
                            <div className="mt-4 aspect-video w-full max-w-xl mx-auto rounded-lg overflow-hidden shadow-lg">
                            {renderVideoPreview(newVideo.VideoURL)}
                            </div>
                        )}
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
                            ยกเลิก
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
