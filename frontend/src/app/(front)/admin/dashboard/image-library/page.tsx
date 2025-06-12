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
import AddImageModal from "../../../../components/Admin/Modal/AddImageModal"; // Modal สำหรับเพิ่มรูปภาพ
import EditImageModal from "../../../../components/Admin/Modal/EditImageModal"; // Modal สำหรับแก้ไขรูปภาพ

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

export default function ImageLibrary() {
  // สถานะเก็บข้อมูลรูปภาพ
  const [images, setImages] = useState([]);
  // สถานะเปิด/ปิด modal เพิ่มรูปภาพ
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  // สถานะเปิด/ปิด modal แก้ไขรูปภาพ
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  // สถานะเปิด/ปิด modal เปลี่ยนรหัสผ่าน
  const [idImage, setIdImage] = useState("");

  // สถานะเปิด/ปิด Confirm Modal สำหรับลบผู้ใช้
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  // เก็บ id ของผู้ใช้ที่ต้องการลบ
  const [imageIdToDelete, setImageIdToDelete] = useState(null);

  // ฟังก์ชันเรียกข้อมูลรูปภาพจาก API
  const fetchImagesData = async () => {
    try {
      const response = await axios.get(`${API}/images`);
      setImages(response.data.resultData); // เก็บข้อมูลใน state
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch images"); // แจ้งเตือนเมื่อมีข้อผิดพลาด
    }
  };

  // เมื่อ component โหลดครั้งแรก ให้เรียกข้อมูลรูปภาพทั้งหมด
  useEffect(() => {
    fetchImagesData();
  }, []);

  // ฟังก์ชันเพิ่มรูปภาพใหม่
  const handleAddImage = async (newImage) => {
    try {
      await axios.post(`${API}/images`, {
        image_name: newImage.ImageName,
        image_url: newImage.ImageURL,
        credit: newImage.Credit,
      });
      toast.success("เพิ่มข้อมูลรูปภาพสำเร็จ");
      setIsModalOpenAdd(false); // ปิด modal
      fetchImagesData(); // โหลดข้อมูลใหม่
    } catch (error) {
      toast.error(error.response?.message || "ไม่สามารถเพิ่มข้อมูลรูปภาพได้");
    }
  };

  // ฟังก์ชันลบรูปภาพ
  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${API}/images/${id}`);
      toast.success("ลบข้อมูลรูปภาพสำเร็จ!");
      fetchImagesData();
    } catch (error) {
      toast.error(error.response?.message || "ไม่สามารถลบข้อมูลได้");
    }
  };

  // เตรียมเปิด Confirm Modal ลบผู้ใช้ พร้อมเก็บ id ที่จะลบ
  const confirmDeleteImage = (id) => {
    setImageIdToDelete(id);
    setIsConfirmModalOpen(true);
  };

  // ฟังก์ชันแก้ไขข้อมูลรูปภาพ
  const handleEditImage = async (newImage) => {
    try {
      await axios.put(`${API}/images/${idImage}`, {
        image_name: newImage.ImageName,
        image_url: newImage.ImageURL,
        credit: newImage.Credit,
      });
      toast.success("แก้ไขรูปภาพสำเร็จ");
      setIsModalOpenEdit(false);
      fetchImagesData();
    } catch (error) {
      toast.error(error.response?.message || "ไม่สามารถแก้ไขข้อมูลรูปภาพได้");
    }
  };

  // กำหนดคอลัมน์ของตาราง
  const columns = useMemo(
    () => [
      { header: "#", accessorKey: "ImageID" }, // แสดง id
      {
        header: "รูปภาพ",
        cell: ({ row }) => (
          <>
            {/* แสดงรูปภาพ */}
            <img
              src={row.original.ImageURL}
              alt={row.original.ImageName}
              className="w-24 rounded-2xl"
            />
          </>
        ),
      },
      { header: "ชื่อรูปภาพ", accessorKey: "ImageName" }, // แสดง username
      { header: "ลิงก์รูปภาพ", accessorKey: "Credit" }, // แสดง username
      {
        header: "เครื่องมือ",
        id: "actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            {/* ปุ่มแก้ไขข้อมูล */}
            <button
              onClick={() => {
                setIsModalOpenEdit(true);
                setIdImage(row.original.ImageID); // กำหนด idImage ที่จะแก้ไข
              }}
              className="px-3 py-1 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all duration-200 hover:scale-105"
            >
              แก้ไข
            </button>
            {/* ปุ่มลบ */}
            <button
              onClick={() => confirmDeleteImage(row.original.ImageID)}
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
    data: images,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } }, // ตั้งค่าเริ่มต้น แสดง 10 แถวต่อหน้า
  });

  return (
    <div>
      {/* ส่วนหัวแสดงชื่อและปุ่มเพิ่มรูปภาพ */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          แสดงข้อมูลรูปภาพ
        </h2>
        <button
          onClick={() => setIsModalOpenAdd(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 hover:scale-105"
        >
          + เพิ่มข้อมูลรูปภาพ
        </button>
      </div>

      {/* Modal เพิ่มรูปภาพ */}
      {isModalOpenAdd && (
        <AddImageModal
          onClose={() => setIsModalOpenAdd(false)}
          onSubmit={handleAddImage}
        />
      )}

      {/* Modal แก้ไขรูปภาพ */}
      {isModalOpenEdit && (
        <EditImageModal
          onClose={() => setIsModalOpenEdit(false)}
          onSubmit={handleEditImage}
          id={idImage}
        />
      )}

      {/* Modal ยืนยันการลบ */}
      <ConfirmModal
        open={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={() => handleDeleteUser(imageIdToDelete)}
        title="ยืนยันการลบรูปภาพ"
        description="คุณแน่ใจหรือไม่ว่าต้องการลบรูปภาพนี้? การกระทำนี้ไม่สามารถย้อนกลับได้"
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
