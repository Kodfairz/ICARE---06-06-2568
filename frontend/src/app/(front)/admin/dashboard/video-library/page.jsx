"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation"; // ใช้สำหรับ navigation ใน Next.js (ถ้าจำเป็น)
import { API } from "../../../../service/api"; // ตัวแปร API endpoint
import { toast } from "react-toastify"; // ใช้แสดงแจ้งเตือน
import axios from "axios"; // สำหรับเรียก API
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table"; // ตารางสำหรับแสดงข้อมูล
import AddVideoModal from "../../../../components/Admin/Modal/AddVideoModal";
import EditVideoModal from "../../../../components/Admin/Modal/EditVideoModal"; // Modal สำหรับแก้ไขวิดีโอ

// Component Modal ยืนยันการทำรายการ เช่น การลบข้อมูล
function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "ยืนยัน",
  description = "คุณต้องการดำเนินการต่อหรือไม่?",
}) {
  if (!open) return null; // ถ้า modal ไม่เปิด ให้ไม่แสดงอะไร

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{description}</p>
        <div className="flex justify-end gap-2">
          {/* ปุ่มยกเลิก */}
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            ยกเลิก
          </button>
          {/* ปุ่มยืนยัน */}
          <button
            onClick={() => {
              onConfirm(); // เรียกฟังก์ชันยืนยัน
              onClose(); // ปิด modal
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VideoLibrary() {
  // สถานะเก็บข้อมูลวิดีโอ
  const [videos, setVideos] = useState([]);
  // สถานะเปิด/ปิด modal เพิ่มวิดีโอ
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  // สถานะเปิด/ปิด modal แก้ไขวิดีโอ
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  // สถานะเปิด/ปิด modal เปลี่ยนรหัสผ่าน
  const [idVideo, setIdVideo] = useState("");

  // สถานะเปิด/ปิด Confirm Modal สำหรับลบผู้ใช้
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  // เก็บ id ของผู้ใช้ที่ต้องการลบ
  const [videoIdToDelete, setVideoIdToDelete] = useState(null);

  // ฟังก์ชันเรียกข้อมูลวิดีโอจาก API
  const fetchVideosData = async () => {
    try {
      const response = await axios.get(`${API}/videos`);
      setVideos(response.data.resultData); // เก็บข้อมูลใน state
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch videos"); // แจ้งเตือนเมื่อมีข้อผิดพลาด
    }
  };

  // เมื่อ component โหลดครั้งแรก ให้เรียกข้อมูลวิดีโอทั้งหมด
  useEffect(() => {
    fetchVideosData();
  }, []);

  // ฟังก์ชันเพิ่มวิดีโอใหม่
  const handleAddVideo = async (newVideo) => {
    try {
      await axios.post(`${API}/videos`, {
        video_name: newVideo.VideoName,
        video_url: newVideo.VideoURL,
      });
      toast.success("เพิ่มข้อมูลวิดีโอสำเร็จ");
      setIsModalOpenAdd(false); // ปิด modal
      fetchVideosData(); // โหลดข้อมูลใหม่
    } catch (error) {
      toast.error(error.response?.message || "ไม่สามารถเพิ่มข้อมูลวิดีโอได้");
    }
  };

  // ฟังก์ชันลบวิดีโอ
  const handleDeleteVideo = async (id) => {
    try {
      await axios.delete(`${API}/videos/${id}`);
      toast.success("ลบข้อมูลวิดีโอสำเร็จ!");
      fetchVideosData();
    } catch (error) {
      toast.error(error.response?.message || "ไม่สามารถลบข้อมูลได้");
    }
  };

  // เตรียมเปิด Confirm Modal ลบผู้ใช้ พร้อมเก็บ id ที่จะลบ
  const confirmDeleteImage = (id) => {
    setVideoIdToDelete(id);
    setIsConfirmModalOpen(true);
  };

  // ฟังก์ชันแก้ไขข้อมูลวิดีโอ
  const handleEditVideo = async (newVideo) => {
    try {
      await axios.put(`${API}/videos/${idVideo}`, {
        video_name: newVideo.VideoName,
        video_url: newVideo.VideoURL,
      });
      toast.success("แก้ไขวิดีโอสำเร็จ");
      setIsModalOpenEdit(false);
      fetchVideosData();
    } catch (error) {
      toast.error(error.response?.message || "ไม่สามารถแก้ไขข้อมูลวิดีโอได้");
    }
  };

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

  // กำหนดคอลัมน์ของตาราง
  const columns = useMemo(
    () => [
      { header: "#", accessorKey: "VideoID" }, // แสดง id
      {
        header: "วิดีโอ",
        cell: ({ row }) => (
          <>
            {/* แสดงวิดีโอ */}
            {row.original.VideoURL && (
                <div className="mt-4 aspect-video w-24 max-w-xl mx-auto rounded-lg overflow-hidden shadow-lg">
                {renderVideoPreview(row.original.VideoURL)}
                </div>
            )}
          </>
        ),
      },
      { header: "ชื่อวิดีโอ", accessorKey: "VideoName" }, // แสดง username
      { header: "ลิงก์วิดีโอ", accessorKey: "VideoURL" }, // แสดง username
      {
        header: "เครื่องมือ",
        id: "actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            {/* ปุ่มแก้ไขข้อมูล */}
            <button
              onClick={() => {
                setIsModalOpenEdit(true);
                setIdVideo(row.original.VideoID); // กำหนด idVideo ที่จะแก้ไข
              }}
              className="px-3 py-1 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all duration-200 hover:scale-105"
            >
              แก้ไข
            </button>
            {/* ปุ่มลบ */}
            <button
              onClick={() => confirmDeleteImage(row.original.VideoID)}
              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 hover:scale-105"
            >
              ลบ
            </button>
          </div>
        ),
      },
    ],
    []
  );

  // สร้างตารางด้วย react-table
  const table = useReactTable({
    data: videos,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } }, // ตั้งค่าเริ่มต้น แสดง 10 แถวต่อหน้า
  });

  return (
    <div>
      {/* ส่วนหัวแสดงชื่อและปุ่มเพิ่มวิดีโอ */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          แสดงข้อมูลวิดีโอ
        </h2>
        <button
          onClick={() => setIsModalOpenAdd(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 hover:scale-105"
        >
          + เพิ่มข้อมูลวิดีโอ
        </button>
      </div>

      {/* Modal เพิ่มวิดีโอ */}
      {isModalOpenAdd && (
        <AddVideoModal
          onClose={() => setIsModalOpenAdd(false)}
          onSubmit={handleAddVideo}
        />
      )}

      {/* Modal แก้ไขวิดีโอ */}
      {isModalOpenEdit && (
        <EditVideoModal
          onClose={() => setIsModalOpenEdit(false)}
          onSubmit={handleEditVideo}
          id={idVideo}
        />
      )}

      {/* Modal ยืนยันการลบ */}
      <ConfirmModal
        open={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={() => handleDeleteVideo(videoIdToDelete)}
        title="ยืนยันการลบผู้ใช้"
        description="คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้? การกระทำนี้ไม่สามารถย้อนกลับได้"
      />

      {/* ตารางแสดงข้อมูล */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-600 text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-4 text-left font-semibold text-sm uppercase tracking-wider"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-indigo-50 transition-all duration-200"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-4 text-gray-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ปุ่มควบคุมการเลื่อนหน้า */}
      <div className="mt-6 flex flex-wrap gap-4 justify-between items-center">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-all duration-200"
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-all duration-200"
        >
          Next
        </button>
      </div>
    </div>
  );
}
