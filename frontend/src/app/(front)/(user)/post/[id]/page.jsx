"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../../../service/api";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import * as dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/th";

const PostDetail = () => {
  dayjs.locale("th");
  dayjs.extend(relativeTime);

  const { id } = useParams();
  const router = useRouter();

  const [post, setPost] = useState({});
  const [feedback, setFeedback] = useState("");
  const [activeTab, setActiveTab] = useState("content");
  const [fadeIn, setFadeIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getPost = async () => {
    try {
      const response = await axios.get(`${API}/posts/user/${id}`);
      setPost(response.data.resultData);
      setIsLoading(false);
      setFadeIn(true);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.message || "ไม่สามารถเรียกข้อมูลได้");
      setIsLoading(false);
    }
  };

  // ฟังก์ชันส่งข้อเสนอแนะไปยัง API
  const sendFeedback = async (event) => {
    try {
      event.preventDefault(); // ป้องกันหน้าเว็บรีเฟรชเมื่อ submit form
      const response = await axios.post(`${API}/comments`, {
        value: feedback,
        id: post.HealthArticleID,
      });
      setFeedback("");  // เคลียร์ข้อความหลังส่ง
      toast.success("ส่งข้อความสำเร็จ");  // แจ้งเตือนสำเร็จ\
    } catch (error) {
      console.log(error);
      toast.error(error.response?.message || "ไม่สามารถส่งข้อความได้");
    }
  };

  const renderVideoPreview = (link) => {
    if (typeof link === "string" && link) {
      const youtubePattern =
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = link.match(youtubePattern);
      if (match) {
        const videoId = match[1];
        return (
          <div className="relative w-full max-w-full pb-[56.25%] rounded-lg overflow-hidden shadow-lg">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        );
      }
    }
    return null;
  };

  useEffect(() => {
    getPost();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setFadeIn(false);
      const timeout = setTimeout(() => setFadeIn(true), 350);
      return () => clearTimeout(timeout);
    }
  }, [activeTab, isLoading]);

  const renderHTML = (html) => (
    <div
      className="prose prose-sm sm:prose lg:prose-lg max-w-full text-gray-800"
      dangerouslySetInnerHTML={{ __html: html || "-" }}
    />
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-3 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* ปุ่มย้อนกลับ */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl shadow-sm hover:shadow-lg hover:bg-gray-100 hover:text-indigo-600 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          ย้อนกลับ
        </button>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 break-words">
          {post?.diseases.DiseaseName}
        </h1>
        <h2 className="text-base sm:text-lg text-indigo-600 font-semibold mb-6 break-words">
          {post?.diseases.categories ? `ประเภทข้อมูล: ${post.diseases.categories.CategoryName}` : "ประเภทข้อมูล: -"}
        </h2>

        {post?.imagelibrary && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
            <img
              src={post.imagelibrary.ImageURL}
              alt={post.imagelibrary.ImageName}
              className="w-full h-auto object-cover max-w-full"
              loading="lazy"
            />
          </div>
        )}

        <div className="mb-8">
          <p className="text-xl font-bold">คำอธิบาย</p>
          <p>{post.diseases.Description}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {["content", "symptom", "situation", "protection", "medications", "treatments"].map((field) => {
            let label = "";
            if (field === "content") label = "รายละเอียดของโรค";
            else if (field === "symptom") label = "อาการของโรค";
            else if (field === "situation") label = "การติดต่อ";
            else if (field === "protection") label = "วิธีดูแล และ การป้องกัน";
            else if (field === "medications") label = "ยา";
            else if (field === "treatments") label = "การรักษา";

            return (
              <button
                key={field}
                onClick={() => setActiveTab(field)}
                className={`px-5 py-2 rounded-lg font-semibold transition text-sm sm:text-base
                  ${
                    activeTab === field
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-300"
                      : "bg-gray-200 text-gray-700 hover:bg-indigo-100"
                  }`}
                type="button"
              >
                {label}
              </button>
            );
          })}
        </div>

        <div
          key={activeTab}
          className={`max-w-3xl mx-auto bg-white rounded-lg shadow-md border border-gray-300 p-4 sm:p-6 text-base sm:text-lg min-h-[150px] prose max-w-full break-words overflow-x-auto
            transition-opacity transition-transform duration-700 ease-out
            will-change-opacity will-change-transform
            ${
              fadeIn
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
        >
          {activeTab === "content" && renderHTML(post?.diseases?.RiskFactors)}
          {activeTab === "symptom" && renderHTML(post?.diseases?.Symptoms)}
          {activeTab === "situation" && renderHTML(post?.diseases?.Diagnosis)}
          {activeTab === "protection" && renderHTML(post?.diseases?.Prevention)}
          {activeTab === "medications" && (
            <ul className="list-disc pl-5">
              {post?.diseases?.disease_medications?.map((item, index) => (
                <li key={index}>
                  <strong>{item.medications.MedicationName}</strong> (
                  {item.medications.GenericName}) - {item.medications.Strength}
                  <br />
                  <span className="text-sm text-gray-600">
                    <strong>รูปแบบยา:</strong> {item.medications.DosageForm}<br />
                    <strong>ข้อบ่งใช้:</strong> {item.medications.Indications}<br />
                    <strong>ผลข้างเคียง:</strong> {item.medications.SideEffects}<br />
                    <strong>ข้อห้ามใช้:</strong> {item.medications.Contraindications}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {activeTab === "treatments" && (
            <ul className="list-disc pl-5">
              {post?.diseases?.disease_treatments?.map((item, index) => (
                <li key={index}>
                  <strong>{item.treatments.TreatmentName}</strong>
                  <br />
                  <span className="text-sm text-gray-600">
                    <strong>รายละเอียด:</strong> {item.treatments.Description}<br />
                    <strong>ขั้นตอน:</strong> {item.treatments.Procedures}<br />
                    <strong>ระยะเวลา:</strong> {item.treatments.Duration}<br />
                    <strong>ผลข้างเคียง:</strong> {item.treatments.SideEffects}<br />
                    <strong>ข้อห้ามใช้:</strong> {item.treatments.Contraindications}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {post?.videolibrary && (
          <section className="mt-10 max-w-4xl mx-auto px-2 sm:px-0">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-5">
              วิดีโอแนะนำ
            </h3>
            {renderVideoPreview(post.videolibrary.VideoURL)}
          </section>
        )}

        {/* ฟอร์มส่งข้อเสนอแนะ */}
        <div className="w-full font-anakotmai mt-8">
          <h4 className="text-lg text-gray-500 mb-2">ข้อเสนอแนะเกี่ยวกับบทความนี้</h4>
          <form onSubmit={sendFeedback}>
            <textarea
              value={feedback}
              placeholder="พิมพ์ข้อความของคุณ..."
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md mb-2 text-black"
              required
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-8 py-3 rounded-md transition duration-300 hover:bg-green-700"
            >
              ส่ง
            </button>
          </form>
        </div>

        <section className="mt-10 max-w-4xl mx-auto px-2 sm:px-0 text-gray-600 space-y-2 text-xs sm:text-sm md:text-base">
          <div>
            <p className="text-sm text-gray-500">
              เผยแพร่โดย: {post?.admins?.AdminName ?? "-"}
            </p>
            <p className="text-sm text-gray-500">
              เผยแพร่เมื่อ: {post?.CreatedAt ? dayjs(post.CreatedAt).format("DD MMMM YYYY") : "-"}
            </p>
            <p className="text-sm text-gray-500">
              อัปเดตล่าสุดเมื่อ: {post?.articleedits ? dayjs(post.articleedits.EditDate).format("DD MMMM YYYY") : "-"}
            </p>
            <p className="text-sm text-gray-500">ดูแล้ว: {post?.Views ?? "-"} ครั้ง</p>
            <span
              className={`inline-block mt-2 px-2 py-1 rounded ${
                post.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {post.isActive ? "เผยแพร่แล้ว" : "ยังไม่เผยแพร่"}
            </span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PostDetail;
