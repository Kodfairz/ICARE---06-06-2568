"use client"; // ประกาศให้ Next.js รู้ว่านี่คือ client component

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ใช้สำหรับการนำทางหน้า
import axios from "axios"; // สำหรับเรียก API
import { toast } from "react-toastify"; // แสดงข้อความแจ้งเตือน
import { API } from "../../../../service/api"; // base API url
import Switch from "react-switch"; // คอมโพเนนต์สวิตช์เปิด-ปิด
import dynamic from "next/dynamic"; // สำหรับ dynamic import
import Cookies from "js-cookie"; // จัดการ cookie

const Select = dynamic(() => import("react-select"), { ssr: false });

export default function AddVideoPage() {
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  // state เก็บค่าต่างๆ ในฟอร์ม
  const [title, setTitle] = useState(""); // หัวข้อวิดีโอ
  const [description, setDescription] = useState("");
  const [imageId, setImageId] = useState(null); // URL รูปหน้าปก
  const [videoId, setVideoId] = useState(""); // URL วิดีโอ (Youtube)
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // สถานะโหลดระหว่างบันทึก
  const [publishStatus, setPublishStatus] = useState(true); // สถานะเผยแพร่ (true = เผยแพร่)
  const router = useRouter(); // สำหรับนำทางหน้า

  useEffect(() => {
    const getImages = async () => {
      try {
        const response = await axios.get(`${API}/images/`);
        setImages(response.data.resultData || []);
      } catch (error) {
        console.log(error);
      }
    };
    
    const getVideos = async () => {
      try {
        const response = await axios.get(`${API}/videos/`);
        setVideos(response.data.resultData || []);
      } catch (error) {
        console.log(error);
      }
    };

    getImages();
    getVideos();
  }, []);

  // ฟังก์ชันส่งข้อมูลวิดีโอไปยัง backend
  const handleSubmit = async (e) => {
    e.preventDefault(); // ป้องกัน reload หน้า

    const user = Cookies.get("user");
    if (!user) {
      toast.error("กรุณาเข้าสู่ระบบ");
      setIsLoading(false);
      return;
    }
    const userId = JSON.parse(user).id;

    setIsLoading(true); // ตั้งสถานะโหลด
    try {
      // เรียก API สร้างวิดีโอใหม่
      const response = await axios.post(`${API}/video`, {
        title,
        description,
        image_id: imageId, // ส่ง URL รูปหน้าปก
        video_id: videoId, // ส่ง URL วิดีโอ
        isActive: publishStatus, // ส่งสถานะเผยแพร่
        admin_id: userId,
      });
      if (response.status === 200) {
        toast.success(response.data.message || "เพิ่มวิดีโอสำเร็จ!"); // แจ้งสำเร็จ
        router.push("/admin/dashboard"); // ไปหน้าหลัก dashboard
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "เพิ่มวิดีโอไม่สำเร็จ"); // แจ้ง error
    } finally {
      setIsLoading(false); // ปิดสถานะโหลด
    }
  };

  const ImageOptions = images.map((img) => ({
    value: img.ImageID,
    label: img.ImageName,
    imageUrl: img.ImageURL,
  }));

  const videoOptions = videos.map((vid) => {
    const youtubeId = extractYouTubeID(vid.VideoURL);
    return {
      value: vid.VideoID,
      label: vid.VideoName,
      youtubeId,
      videoUrl: vid.VideoURL
    };
  });

  // Custom option (แสดงรูป + ชื่อ)
  const customOption = (props) => {
    const { data, innerRef, innerProps } = props;
    return (
      <div ref={innerRef} {...innerProps} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
        <img src={data.imageUrl} alt={data.label} className="w-8 h-8 object-cover rounded mr-2" />
        <span>{data.label}</span>
      </div>
    );
  };

  // Custom selected value (แสดงเมื่อเลือกแล้ว)
  const customSingleValue = ({ data }) => (
    <div className="flex items-center">
      <img src={data.imageUrl} alt={data.label} className="w-6 h-6 object-cover rounded mr-2" />
      <span>{data.label}</span>
    </div>
  );

  // ฟังก์ชันแยก YouTube ID จาก URL
  function extractYouTubeID(url) {
    const regex = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  // // ฟังก์ชันแปลงลิงก์ YouTube เป็น iframe สำหรับแสดง preview
  // const renderVideoPreview = (link) => {
  //   const youtubePattern =
  //     /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  //   const match = link.match(youtubePattern);
  //   if (match) {
  //     const videoId = match[1]; // ดึง video id จาก URL
  //     return (
  //       <div className="mt-4">
  //         <iframe
  //           height="100%"
  //           src={`https://www.youtube.com/embed/${videoId}`}
  //           title="YouTube video"
  //           frameBorder="0"
  //           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  //           allowFullScreen
  //         ></iframe>
  //       </div>
  //     );
  //   }
  //   return null; // ถ้าไม่ใช่ลิงก์ YouTube ไม่แสดง preview
  // };

  return (
    <div className="container mx-auto p-6 min-h-screen">
      {/* หัวข้อหน้า */}
      <h1 className="text-4xl font-bold text-gray-800 mb-8 animate-fade-in-down">เพิ่มวิดีโอ</h1>

      {/* ฟอร์มเพิ่มวิดีโอ */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        {/* Input หัวข้อ */}
        <div>
          <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">
            หัวข้อ
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            placeholder="ป้อนหัวข้อ"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            คำอธิบาย
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            placeholder="ป้อนคำอธิบาย"
            rows={3}
          />
        </div>

        {/* Input รูปหน้าปก (drag & drop) */}
        <div>
          <label
            htmlFor="image"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            หน้าปกข้อมูล
          </label>
          <Select
            id="image"
            options={ImageOptions}
            value={ImageOptions.find((option) => option.value === imageId) || null}
            onChange={(selected) => setImageId(selected?.value || null)}
            placeholder="เลือกหน้าปกข้อมูล"
            classNamePrefix="react-select"
            className="w-full"
            isClearable
            components={{
              Option: customOption,
              SingleValue: customSingleValue
            }}
          />
        </div>

        {/* Input ลิงก์วิดีโอ */}
        <div>
          <label
            htmlFor="video"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            วิดีโอ
          </label>
          <Select
            id="video"
            options={videoOptions}
            value={videoOptions.find((option) => option.value === videoId) || null}
            onChange={(selected) => {
              setVideoId(selected?.value || null);
              setSelectedVideo(selected || null); // เก็บ object ที่เลือกไว้
            }}
            placeholder="เลือกวิดีโอ"
            classNamePrefix="react-select"
            className="w-full"
            isClearable
          />
        </div>

        {selectedVideo && (
          <div className="mt-4">
            <h4 className="text-lg font-medium mb-2">วิดีโอตัวอย่าง</h4>
            <div>
              <iframe
                width="100%"
                height="315"
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}`}
                title={selectedVideo.label}
                className="aspect-video rounded-xl overflow-hidden shadow-lg"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        {/* สถานะการเผยแพร่ */}
        <div>
          <label htmlFor="publishStatus" className="block text-lg font-medium text-gray-700 mb-2">
            สถานะการเผยแพร่
          </label>
          <div className="flex items-center gap-4">
            <span>ไม่เผยแพร่</span>
            <Switch
              checked={publishStatus}
              onChange={() => setPublishStatus(!publishStatus)} // สลับสถานะ
              offColor="#888"
              onColor="#4CAF50"
              offHandleColor="#FFF"
              onHandleColor="#FFF"
              height={30}
              width={60}
            />
            <span>เผยแพร่</span>
          </div>
        </div>

        {/* ปุ่มเพิ่มวิดีโอและยกเลิก */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? "กำลังเพิ่ม..." : "เพิ่มวิดีโอ"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 p-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
          >
            ยกเลิก
          </button>
        </div>
      </form>
    </div>
  );
}
