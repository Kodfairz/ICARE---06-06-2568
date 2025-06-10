"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";

import axios from "axios";
import { toast } from "react-toastify";
import { API } from "../../../../service/api";
import Switch from "react-switch";
import dynamic from "next/dynamic";
import { useDropzone } from "react-dropzone";
import Cookies from "js-cookie";

const Select = dynamic(() => import("react-select"), { ssr: false });

export default function AddPostPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [videoName, setVideoName] = useState("");
  const [icd10Code, setIcd10Code] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const [categories, setCategories] = useState([]);
  const [publishStatus, setPublishStatus] = useState(true);
  const router = useRouter();

  // ตัว editor สำหรับเนื้อหาในฟิลด์หลัก
  const riskfactorsEditor = useEditor({
    extensions: [StarterKit, Image.configure({ inline: true }), Underline],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl m-0 focus:outline-none min-h-[150px]",
      },
    },
    immediatelyRender: false,
  });

  // editor สำหรับอาการ
  const symptomsEditor = useEditor({
    extensions: [StarterKit, Image.configure({ inline: true }), Underline],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl m-0 focus:outline-none min-h-[150px]",
      },
    },
    immediatelyRender: false,
  });

  // editor สำหรับสถานการณ์
  const diagnosisEditor = useEditor({
    extensions: [StarterKit, Image.configure({ inline: true }), Underline],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl m-0 focus:outline-none min-h-[150px]",
      },
    },
    immediatelyRender: false,
  });

  // editor สำหรับการป้องกัน
  const preventionEditor = useEditor({
    extensions: [StarterKit, Image.configure({ inline: true }), Underline],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl m-0 focus:outline-none min-h-[150px]",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axios.get(`${API}/category/`);
        setCategories(response.data.resultData || []);
      } catch (error) {
        console.log(error);
      }
    };
    getCategories();
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

  const addImage = (editorInstance) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;
      const imageUrl = await handleImageUpload(file);
      if (imageUrl && editorInstance) {
        editorInstance.chain().focus().setImage({ src: imageUrl }).run();
      }
    };
  };

  const handleCoverImageUpload = async (file) => {
    const imageUrl = await handleImageUpload(file);
    if (imageUrl) {
      setImageUrl(imageUrl);
    }
  };

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      handleCoverImageUpload(acceptedFiles[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) {
      toast.error("กรุณาเลือกประเภทข้อมูล");
      return;
    }
    setIsLoading(true);

    try {
      const risk_factors = riskfactorsEditor?.getHTML() || "";
      const symptoms = symptomsEditor?.getHTML() || "";
      const diagnosis = diagnosisEditor?.getHTML() || "";
      const prevention = preventionEditor?.getHTML() || "";

      const user = Cookies.get("user");
      if (!user) {
        toast.error("กรุณาเข้าสู่ระบบ");
        setIsLoading(false);
        return;
      }
      const userId = JSON.parse(user).id;

      const response = await axios.post(`${API}/posts`, {
        name: title,
        description: description,
        category_id: category.toString(),
        image_url: coverImage,
        image_name: imageName,
        video_url: videoLink,
        video_name: videoName,
        icd10_code: icd10Code,
        risk_factors: content,
        symptoms: symptom,
        diagnosis: situation,
        prevention: protection,
        isActive: publishStatus,
        admin_id: userId,
      });
      if (response.status === 200) {
        toast.success(response.data.message || "เพิ่มข้อมูลสำเร็จ!");
        router.push("/admin/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "เพิ่มโพสต์ไม่สำเร็จ");
    } finally {
      setIsLoading(false);
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

  const categoryOptions = categories.map((cat) => ({
    value: cat.CategoryID,
    label: cat.CategoryName,
  }));

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  // Toolbar component สำหรับ editor ย่อย
  const RenderToolbar = ({ editorInstance }) => {
    if (!editorInstance) return null; // ถ้า editor ยังไม่พร้อม แสดงอะไรไม่ได้เลย

    return (
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => editorInstance.chain().focus().toggleBold().run()}
          disabled={!editorInstance.can().chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded border ${editorInstance.isActive("bold")
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-800 hover:bg-indigo-100"
            } transition`}
          title="ตัวหนา"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editorInstance.chain().focus().toggleItalic().run()}
          disabled={!editorInstance.can().chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded border ${editorInstance.isActive("italic")
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-800 hover:bg-indigo-100"
            } transition`}
          title="ตัวเอียง"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editorInstance.chain().focus().toggleUnderline().run()}
          disabled={!editorInstance.can().chain().focus().toggleUnderline().run()}
          className={`px-2 py-1 rounded border ${editorInstance.isActive("underline")
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-800 hover:bg-indigo-100"
            } transition`}
          title="ขีดเส้นใต้"
        >
          U
        </button>
        <button
          type="button"
          onClick={() => addImage(editorInstance)}
          className="px-2 py-1 rounded border bg-white text-gray-800 hover:bg-indigo-100 transition"
          title="แทรกรูปภาพ"
        >
          รูปภาพ
        </button>
      </div>
    );
  };


  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 animate-fade-in-down">
        เพิ่มข้อมูล
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-6 space-y-6 max-w-4xl mx-auto"
      >
        {/* ฟิลด์ข้อมูลหลัก */}
        <div className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              หัวข้อ
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="ป้อนหัวข้อ"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              รายละเอียด
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
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
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="ป้อนคำอธิบาย"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              ประเภทของข้อมูล
            </label>
            <Select
              id="category"
              options={categoryOptions}
              value={categoryOptions.find((option) => option.value === category) || null}
              onChange={(selected) => setCategory(selected?.value || null)}
              placeholder="เลือกประเภทข้อมูล"
              classNamePrefix="react-select"
              className="w-full"
              isClearable
            />
          </div>
        </div>

        {/* หน้าปก */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            หน้าปกข้อมูล
          </label>
          <div
            {...getRootProps()}
            className="border-dashed border-2 border-gray-300 p-6 text-center cursor-pointer rounded-lg"
          >
            <input {...getInputProps()} />
            <p className="text-gray-500">ลากและวางหรือเลือกไฟล์</p>
            {coverImage && (
              <img
                src={imageUrl}
                alt="Cover"
                className="max-w-xs max-h-60 w-full h-auto mx-auto rounded-lg mt-4 object-cover shadow"
              />
            )}
          </div>
        </div>

        <div>
            <label
              htmlFor="imageName"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              ชื่อรูปภาพ
            </label>
            <input
              type="text"
              id="imageName"
              value={imageName}
              onChange={(e) => setImageName(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="ป้อนชื่อรูปภาพ"
            />
          </div>

        {/* วิดีโอ */}
        <div>
          <label
            htmlFor="videoUrl"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            ลิงก์วิดีโอแนะนำ
          </label>
          <input
            type="url"
            id="videoUrl"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            placeholder="กรอกลิงก์วิดีโอแนะนำ"
          />
          {videoUrl && (
            <div className="mt-4 aspect-video w-full max-w-xl mx-auto rounded-lg overflow-hidden shadow-lg">
              {renderVideoPreview(videoUrl)}
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="videoName"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            ชื่อวิดีโอ
          </label>
          <input
            type="text"
            id="videoName"
            value={videoName}
            onChange={(e) => setVideoName(e.target.value)}
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            placeholder="ป้อนชื่อวิดีโอ"
          />
        </div>

        <div>
          <label
            htmlFor="icd10Code"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            ICD10 Code
          </label>
          <input
            type="text"
            id="icd10Code"
            value={icd10Code}
            onChange={(e) => setIcd10Code(e.target.value)}
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            placeholder="ป้อน ICD10 Code"
          />
        </div>

        {/* สวิตช์สถานะ */}
        <div>
          <label
            htmlFor="publishStatus"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            สถานะเผยแพร่
          </label>
          <Switch
            checked={publishStatus}
            onChange={setPublishStatus}
            offColor="#d1d5db"
            onColor="#4f46e5"
            uncheckedIcon={false}
            checkedIcon={false}
            height={24}
            width={48}
            handleDiameter={22}
            aria-label="Toggle publish status"
          />
        </div>

        {/* แท็บแก้ไขเนื้อหา */}
        <div className="mt-6">
          <div className="flex gap-4 mb-4 border-b border-gray-200">
            {["riskfactor", "symptoms", "diagnosis", "prevention"].map((tab) => (
              <button
                type="button"
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-semibold rounded-t-lg transition-colors ${activeTab === tab
                    ? "bg-indigo-100 text-indigo-700 border border-b-0 border-indigo-300"
                    : "text-gray-500 hover:text-indigo-600"
                  }`}
              >
                {tab === "riskfactor"
                  ? "รายละเอียดของโรค"
                  : tab === "symptoms"
                    ? "อาการ"
                    : tab === "diagnosis"
                      ? "การติดต่อ"
                      : "ดูแล และ การป้องกัน"}
              </button>
            ))}
          </div>

          {/* // แสดง Editor เฉพาะเมื่อแท็บที่เลือกคือ "edit" */}
          {activeTab === "riskfactor" && (
            <>
              {/* แถบเครื่องมือของ Editor (Toolbar) ที่เชื่อมกับอินสแตนซ์ของ editor หลัก */}
              <RenderToolbar editorInstance={riskfactorsEditor} />
              {/* พื้นที่เขียนเนื้อหาหลัก */}
              <EditorContent editor={riskfactorsEditor} className="border rounded-md p-4 min-h-[150px]" />
            </>
          )}

          {/* แสดง Editor เฉพาะเมื่อแท็บที่เลือกคือ "symptom"*/}
          {activeTab === "symptoms" && (
            <>
              {/* แถบเครื่องมือของ Editor สำหรับเนื้อหา 'อาการ' */}
              <RenderToolbar editorInstance={symptomsEditor} />
              {/* พื้นที่เขียนเนื้อหา 'อาการ' */}
              <EditorContent
                editor={symptomsEditor}
                className="border rounded-md p-4 min-h-[100px]"
              />
            </>
          )}

{/* // แสดง Editor เฉพาะเมื่อแท็บที่เลือกคือ "situation" */}
          {activeTab === "diagnosis" && (
            <>
              {/* แถบเครื่องมือของ Editor สำหรับเนื้อหา 'สถานการณ์' */}
              <RenderToolbar editorInstance={diagnosisEditor} />
              {/* พื้นที่เขียนเนื้อหา 'สถานการณ์' */}
              <EditorContent
                editor={diagnosisEditor}
                className="border rounded-md p-4 min-h-[100px]"
              />
            </>
          )}

{/* // แสดง Editor เฉพาะเมื่อแท็บที่เลือกคือ "protection" */}
          {activeTab === "prevention" && (
            <>
              {/* แถบเครื่องมือของ Editor สำหรับเนื้อหา 'การป้องกัน' */}
              <RenderToolbar editorInstance={preventionEditor} />
              {/* พื้นที่เขียนเนื้อหา 'การป้องกัน' */}
              <EditorContent
                editor={preventionEditor}
                className="border rounded-md p-4 min-h-[100px]"
              />
            </>
          )}

        </div>

        <div className="mt-8 text-center">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
          </button>
        </div>
      </form>
    </div>
  );
}
