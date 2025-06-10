"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import axios from "axios";
import { toast } from "react-toastify";
import { API } from "../../../../../service/api";

export default function EditMedicationPage() {
  const { id } = useParams();
  const [medicationName, setMedicationName] = useState("");
  const [genericName, setGenericName] = useState("");
  const [dosageForm, setDosageForm] = useState("");
  const [strength, setStrength] = useState("");
  const [indication, setIndication] = useState("");
  const [sideEffect, setSideEffect] = useState("");
  const [contraindication, setContraindication] = useState("");
  const router = useRouter();

  // ฟังก์ชันดึงข้อมูลยาจาก API
  const getMedics = async () => {
    try {
      const response = await axios.get(`${API}/medics/${id}`);
      const medic = response.data.resultData; // เก็บข้อมูลยาลง state

      setMedicationName(medic.MedicationName || "");
      setGenericName(medic.GenericName || "");
      setDosageForm(medic.DosageForm || "");
      setStrength(medic.Strength || "");
      setIndication(medic.Indications || "");
      setSideEffect(medic.SideEffects || "");
      setContraindication(medic.Contraindications || "");
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
      const response = await axios.put(`${API}/medics/${id}`, {
        medic_name: medicationName,
        generic_name: genericName,
        dosage: dosageForm,
        strength: strength,
        indication: indication,
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
        แก้ไขข้อมูล
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-6 space-y-6 max-w-4xl mx-auto"
      >
        {/* ฟิลด์ข้อมูลหลัก */}
        <div className="space-y-6">
          <div>
            <label
              htmlFor="MedicationName"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              ชื่อยา
            </label>
            <input
              type="text"
              id="MedicationName"
              value={medicationName}
              onChange={(e) => setMedicationName(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="ป้อนชื่อยา"
            />
          </div>

          <div>
            <label
              htmlFor="genericName"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              ชื่อสามัญทางยา
            </label>
            <input
              type="text"
              id="genericName"
              value={genericName}
              onChange={(e) => setGenericName(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="ป้อนชื่อสามัญทางยา"
            />
          </div>

          <div>
            <label
              htmlFor="dosageForm"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              รูปแบบยา
            </label>
            <input
              type="text"
              id="dosageForm"
              value={dosageForm}
              onChange={(e) => setDosageForm(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="ป้อนรูปแบบยา"
            />
          </div>

          <div>
            <label
              htmlFor="strength"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              ความรุนแรงของยา
            </label>
            <input
              type="text"
              id="strength"
              value={strength}
              onChange={(e) => setStrength(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="ป้อนความรุนแรงของยา"
            />
          </div>

          <div>
            <label
              htmlFor="indication"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              ข้อบ่งใช้
            </label>
            <input
              type="text"
              id="indication"
              value={indication}
              onChange={(e) => setIndication(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="ป้อนข้อบ่งใช้"
            />
          </div>

          <div>
            <label
              htmlFor="sideEffect"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              ผลข้างเคียง
            </label>
            <input
              type="text"
              id="sideEffect"
              value={sideEffect}
              onChange={(e) => setSideEffect(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="ป้อนผลข้างเคียง"
            />
          </div>

          <div>
            <label
              htmlFor="contraindication"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              ข้อห้าม
            </label>
            <input
              type="text"
              id="contraindication"
              value={contraindication}
              onChange={(e) => setContraindication(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="ป้อนข้อห้าม"
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
