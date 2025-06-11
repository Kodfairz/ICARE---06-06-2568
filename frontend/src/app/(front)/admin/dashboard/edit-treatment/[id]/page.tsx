"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import axios from "axios";
import { toast } from "react-toastify";
import { API } from "../../../../../service/api";

export default function EditMedicationPage() {
  const { id } = useParams();
  const [treatmentName, setTreatmentName] = useState("");
  const [description, setDescription] = useState("");
  const [procedure, setProcedure] = useState("");
  const [duration, setDuration] = useState("");
  const [sideEffect, setSideEffect] = useState("");
  const [contraindication, setContraindication] = useState("");
  const router = useRouter();

  // ฟังก์ชันดึงข้อมูลยาจาก API
  const getMedics = async () => {
    try {
      const response = await axios.get(`${API}/treatments/${id}`);
      const treatment = response.data.resultData; // เก็บข้อมูลยาลง state

      setTreatmentName(treatment.TreatmentName || "");
      setDescription(treatment.Description || "");
      setProcedure(treatment.Procedures || "");
      setDuration(treatment.Duration || "");
      setSideEffect(treatment.SideEffects || "");
      setContraindication(treatment.Contraindications || "");
    } catch (error) {
      console.log(error);
      toast.error(error.response.message || "ไม่สามารถเรียกข้อมูลได้"); // แจ้งเตือนถ้าดึงข้อมูลไม่สำเร็จ
    }
  };

  // ดึงข้อมูลยาครั้งแรกตอน component โหลด
  useEffect(() => {
    getMedics();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`${API}/treatments/${id}`, {
        treatment_name: treatmentName,
        description: description,
        procedure: procedure,
        duration: duration,
        side_effect: sideEffect,
        contraindication: contraindication,
      });
      if (response.status === 200) {
        toast.success(response.data.message || "แก้ไขข้อมูลสำเร็จ!");
        router.back();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "แก้ไขข้อมูลไม่สำเร็จ");
    }
  };

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 animate-fade-in-down">
        แก้ไขข้อมูลการรักษา
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-6 space-y-6 max-w-4xl mx-auto"
      >
        {/* ฟิลด์ข้อมูลหลัก */}
        <div className="space-y-6">
          <div>
            <label
              htmlFor="treatmentName"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              ชื่อการรักษา
            </label>
            <input
              type="text"
              id="treatmentName"
              value={treatmentName}
              onChange={(e) => setTreatmentName(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="ป้อนชื่อการรักษา"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              คำอธิบายการรักษา
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="ป้อนคำอธิบายการรักษา"
              rows={4}
            />
          </div>

          <div>
            <label
              htmlFor="procedure"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              ขั้นตอนการดำเนินการ
            </label>
            <textarea
              id="procedure"
              value={procedure}
              onChange={(e) => setProcedure(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="ขั้นตอนการดำเนินการ"
              rows={3}
            />
          </div>

          <div>
            <label
              htmlFor="duration"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              ระยะเวลาในการรักษา
            </label>
            <input
              type="text"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="ป้อนระยะเวลาในการรักษา"
            />
          </div>

          <div>
            <label
              htmlFor="sideEffect"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              ผลข้างเคียงที่อาจเกิดขึ้นจากการรักษา
            </label>
            <input
              type="text"
              id="sideEffect"
              value={sideEffect}
              onChange={(e) => setSideEffect(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="ป้อนผลข้างเคียงที่อาจเกิดขึ้นจากการรักษา"
            />
          </div>

          <div>
            <label
              htmlFor="contraindication"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              ข้อห้ามใช้วิธีนี้ในบางกรณี
            </label>
            <input
              type="text"
              id="contraindication"
              value={contraindication}
              onChange={(e) => setContraindication(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="ป้อนข้อห้ามใช้วิธีนี้ในบางกรณี"
            />
          </div>

          <div className="mt-8 text-center">
            <button
              type="submit"
              className="bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              บันทึกข้อมูล
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
