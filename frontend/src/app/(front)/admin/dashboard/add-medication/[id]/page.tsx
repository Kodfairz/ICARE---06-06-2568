"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import axios from "axios";
import { toast } from "react-toastify";
import { API } from "../../../../../service/api";

export default function AddMedicationPage() {
  const { id } = useParams();
  const [medicationName, setMedicationName] = useState("");
  const [genericName, setGenericName] = useState("");
  const [dosageForm, setDosageForm] = useState("");
  const [strength, setStrength] = useState("");
  const [indication, setIndication] = useState("");
  const [sideEffect, setSideEffect] = useState("");
  const [contraindication, setContraindication] = useState("");
  const [symptomsDrugAllergies, setSymptomsDrugAllergies] = useState("");
  const [treatDrugAllergies, setTreatDrugAllergies] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${API}/medics`, {
        medic_name: medicationName,
        generic_name: genericName,
        dosage: dosageForm,
        strength: strength,
        indication: indication,
        side_effect: sideEffect,
        contraindication: contraindication,
        symptoms_drug_allergies: symptomsDrugAllergies,
        treat_drug_allergies: treatDrugAllergies,
        disease_id: id,
      });
      if (response.status === 200) {
        toast.success(response.data.message || "เพิ่มข้อมูลสำเร็จ!");
        router.back();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "เพิ่มข้อมูลไม่สำเร็จ");
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 animate-fade-in-down">
        เพิ่มข้อมูลยา
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
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="ป้อนชื่อยา"
              required
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
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="ป้อนชื่อสามัญทางยา"
              required
            />
          </div>

          <div>
            <label
              htmlFor="dosageForm"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              รูปแบบยา
            </label>
            <select
              id="dosageForm"
              value={dosageForm}
              onChange={(e) => setDosageForm(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              required
            >
              <option value="">-- เลือกรูปแบบยา --</option>
              <option value="เม็ด">เม็ด</option>
              <option value="น้ำ">น้ำ</option>
              <option value="ฉีด">ฉีด</option>
              <option value="ดม">ดม</option>
              <option value="ทา">ทา</option>
            </select>
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
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="ขนาดโดส เช่น 500mg"
              required
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
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="ใช้ในกรณีใด เช่น ลดไข้, แก้ปวด"
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
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="ป้อนข้อห้าม"
            />
          </div>

          <div>
            <label
              htmlFor="symptomsDrugAllergies"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              อาการสำหรับผู้ที่แพ้ยา
            </label>
            <input
              type="text"
              id="symptomsDrugAllergies"
              value={symptomsDrugAllergies}
              onChange={(e) => setSymptomsDrugAllergies(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="ป้อนอาการสำหรับผู้ที่แพ้ยา"
            />
          </div>

          <div>
            <label
              htmlFor="treatDrugAllergies"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              วิธีการรักษาอาการแพ้ยา
            </label>
            <textarea
              id="treatDrugAllergies"
              value={treatDrugAllergies}
              onChange={(e) => setTreatDrugAllergies(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="ป้อนวิธีการรักษาอาการแพ้ยา"
              rows={3}
            />
          </div>

          {/* ปุ่มบันทึกและยกเลิก */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 p-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? "กำลังบันทึกข้อมูล..." : "บันทึกข้อมูล"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 p-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
