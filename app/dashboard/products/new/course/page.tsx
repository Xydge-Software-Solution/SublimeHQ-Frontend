"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  GraduationCap,
  Upload,
  Trash2,
  Plus,
  Check,
  Loader2,
  BookOpen,
  Award,
  Clock,
  ChevronDown,
  ChevronUp,
  Play,
  FileText,
  File,
} from "lucide-react";
import { storage, type Product, type CourseDetails } from "@/lib/storage";

interface Lesson {
  id: string;
  title: string;
  type: "video" | "text" | "quiz" | "download";
  duration: string;
  isFree: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  isExpanded: boolean;
}

export default function NewCourseProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Basic Info
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [compareAtPrice, setCompareAtPrice] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState("");

  // Course Details
  const [skillLevel, setSkillLevel] = useState<"beginner" | "intermediate" | "advanced" | "all-levels">("all-levels");
  const [totalDuration, setTotalDuration] = useState("");
  const [hasCertificate, setHasCertificate] = useState(true);
  const [instructor, setInstructor] = useState("");
  const [language, setLanguage] = useState("English");

  // Course Curriculum
  const [modules, setModules] = useState<Module[]>([]);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newModuleDesc, setNewModuleDesc] = useState("");

  // Requirements & Learning Outcomes
  const [requirements, setRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState("");
  const [outcomes, setOutcomes] = useState<string[]>([]);
  const [newOutcome, setNewOutcome] = useState("");

  const [status, setStatus] = useState<"published" | "draft">("draft");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Module functions
  const addModule = () => {
    if (newModuleTitle.trim()) {
      setModules([
        ...modules,
        {
          id: crypto.randomUUID(),
          title: newModuleTitle.trim(),
          description: newModuleDesc.trim(),
          lessons: [],
          isExpanded: true,
        },
      ]);
      setNewModuleTitle("");
      setNewModuleDesc("");
    }
  };

  const removeModule = (moduleId: string) => {
    setModules(modules.filter((m) => m.id !== moduleId));
  };

  const toggleModuleExpanded = (moduleId: string) => {
    setModules(
      modules.map((m) =>
        m.id === moduleId ? { ...m, isExpanded: !m.isExpanded } : m
      )
    );
  };

  // Lesson functions
  const addLesson = (moduleId: string) => {
    setModules(
      modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: [
                ...m.lessons,
                {
                  id: crypto.randomUUID(),
                  title: "",
                  type: "video",
                  duration: "",
                  isFree: false,
                },
              ],
            }
          : m
      )
    );
  };

  const updateLesson = (moduleId: string, lessonId: string, updates: Partial<Lesson>) => {
    setModules(
      modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons.map((l) =>
                l.id === lessonId ? { ...l, ...updates } : l
              ),
            }
          : m
      )
    );
  };

  const removeLesson = (moduleId: string, lessonId: string) => {
    setModules(
      modules.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
          : m
      )
    );
  };

  // Requirements & Outcomes
  const addRequirement = () => {
    if (newRequirement.trim()) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const addOutcome = () => {
    if (newOutcome.trim()) {
      setOutcomes([...outcomes, newOutcome.trim()]);
      setNewOutcome("");
    }
  };

  const removeOutcome = (index: number) => {
    setOutcomes(outcomes.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !shortDescription.trim()) {
      alert("Please fill in the required fields");
      return;
    }

    setIsSubmitting(true);

    const courseDetails: CourseDetails = {
      modules: modules.map((m, idx) => ({
        title: m.title,
        description: m.description || undefined,
        order: idx + 1,
        lessons: m.lessons.map((l, lIdx) => ({
          title: l.title,
          type: l.type,
          duration: l.duration || undefined,
          order: lIdx + 1,
          isFree: l.isFree || undefined,
        })),
      })),
      totalLessons: modules.reduce((acc, m) => acc + m.lessons.length, 0),
      totalDuration: totalDuration || undefined,
      skillLevel,
      certificate: hasCertificate,
      instructor: instructor || undefined,
    };

    const newProduct: Omit<Product, "id" | "createdAt" | "sales"> = {
      type: "course",
      title,
      description,
      shortDescription,
      price,
      compareAtPrice,
      image: image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
      rating: 0,
      reviewCount: 0,
      status,
      category: category || undefined,
      courseDetails,
    };

    storage.addProduct(newProduct);
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSubmitting(false);
    router.push("/dashboard/products");
  };

  const lessonTypeIcons: Record<string, typeof Play> = {
    video: Play,
    text: FileText,
    quiz: BookOpen,
    download: File,
  };

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

  return (
    <div className="max-w-3xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/products/new"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Product Types
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Online Course</h1>
            <p className="text-gray-500">Multi-lesson courses with modules and curriculum</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-8">
        {/* Basic Information */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

          {/* Course Thumbnail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Thumbnail</label>
            {image ? (
              <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="Course" className="w-full h-full object-cover" />
                <button
                  onClick={() => setImage("")}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/50 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  <span className="font-medium text-indigo-600">Upload course image</span>
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Complete Web Development Bootcamp"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="One-line course summary"
              maxLength={150}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed course description..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                <option value="development">Development</option>
                <option value="business">Business</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="photography">Photography</option>
                <option value="music">Music</option>
                <option value="health">Health & Fitness</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instructor Name</label>
              <input
                type="text"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Course Details */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-gray-400" />
            Course Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skill Level</label>
              <select
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value as typeof skillLevel)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all-levels">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Total Duration
              </label>
              <input
                type="text"
                value={totalDuration}
                onChange={(e) => setTotalDuration(e.target.value)}
                placeholder="e.g., 12 hours"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Portuguese">Portuguese</option>
                <option value="Chinese">Chinese</option>
                <option value="Japanese">Japanese</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl">
            <Award className="w-6 h-6 text-indigo-600" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">Certificate of Completion</p>
              <p className="text-sm text-gray-500">Students receive a certificate after completing the course</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={hasCertificate}
                onChange={(e) => setHasCertificate(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Pricing</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Compare at Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={compareAtPrice || ""}
                  onChange={(e) => setCompareAtPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
                  min="0"
                  step="0.01"
                  placeholder="Original price"
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Course Curriculum */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Course Curriculum</h2>
              <p className="text-sm text-gray-500">
                {modules.length} module{modules.length !== 1 ? "s" : ""} • {totalLessons} lesson{totalLessons !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Add Module Form */}
          <div className="p-4 bg-gray-50 rounded-xl space-y-3">
            <input
              type="text"
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
              placeholder="Module title (e.g., Getting Started)"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <input
              type="text"
              value={newModuleDesc}
              onChange={(e) => setNewModuleDesc(e.target.value)}
              placeholder="Module description (optional)"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={addModule}
              disabled={!newModuleTitle.trim()}
              className="w-full px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add Module
            </button>
          </div>

          {/* Modules List */}
          {modules.length > 0 && (
            <div className="space-y-3">
              {modules.map((module, moduleIndex) => (
                <div
                  key={module.id}
                  className="border border-gray-200 rounded-xl overflow-hidden"
                >
                  {/* Module Header */}
                  <div className="flex items-center gap-3 p-4 bg-gray-50">
                    <button
                      type="button"
                      onClick={() => toggleModuleExpanded(module.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {module.isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">
                        Module {moduleIndex + 1}: {module.title}
                      </p>
                      {module.description && (
                        <p className="text-sm text-gray-500 truncate">{module.description}</p>
                      )}
                      <p className="text-xs text-gray-400">
                        {module.lessons.length} lesson{module.lessons.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeModule(module.id)}
                      className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Module Lessons */}
                  {module.isExpanded && (
                    <div className="p-4 space-y-2 bg-white">
                      {module.lessons.map((lesson, lessonIndex) => {
                        const LessonIcon = lessonTypeIcons[lesson.type] || Play;
                        return (
                          <div
                            key={lesson.id}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                          >
                            <span className="text-xs text-gray-400 font-mono w-6">
                              {lessonIndex + 1}.
                            </span>
                            <LessonIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <input
                              type="text"
                              value={lesson.title}
                              onChange={(e) =>
                                updateLesson(module.id, lesson.id, { title: e.target.value })
                              }
                              placeholder="Lesson title"
                              className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                            <select
                              value={lesson.type}
                              onChange={(e) =>
                                updateLesson(module.id, lesson.id, { type: e.target.value as Lesson["type"] })
                              }
                              className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                              <option value="video">Video</option>
                              <option value="text">Article</option>
                              <option value="quiz">Quiz</option>
                              <option value="download">Download</option>
                            </select>
                            <input
                              type="text"
                              value={lesson.duration}
                              onChange={(e) =>
                                updateLesson(module.id, lesson.id, { duration: e.target.value })
                              }
                              placeholder="5 min"
                              className="w-20 px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                            <label className="flex items-center gap-1 text-xs text-gray-500 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={lesson.isFree}
                                onChange={(e) =>
                                  updateLesson(module.id, lesson.id, { isFree: e.target.checked })
                                }
                                className="rounded text-indigo-600 focus:ring-indigo-500"
                              />
                              Free
                            </label>
                            <button
                              type="button"
                              onClick={() => removeLesson(module.id, lesson.id)}
                              className="p-1 text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}

                      <button
                        type="button"
                        onClick={() => addLesson(module.id)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Lesson
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Requirements */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Requirements</h2>
          <p className="text-sm text-gray-500">What should students know before taking this course?</p>

          <div className="flex gap-2">
            <input
              type="text"
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
              placeholder="e.g., Basic understanding of JavaScript"
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={addRequirement}
              className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {requirements.length > 0 && (
            <ul className="space-y-2">
              {requirements.map((item, index) => (
                <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">{item}</span>
                  <button
                    type="button"
                    onClick={() => removeRequirement(index)}
                    className="p-1 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Learning Outcomes */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">What You&apos;ll Learn</h2>
          <p className="text-sm text-gray-500">Key outcomes students will achieve</p>

          <div className="flex gap-2">
            <input
              type="text"
              value={newOutcome}
              onChange={(e) => setNewOutcome(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addOutcome())}
              placeholder="e.g., Build responsive web applications"
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={addOutcome}
              className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {outcomes.length > 0 && (
            <ul className="space-y-2">
              {outcomes.map((item, index) => (
                <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="flex items-center gap-2 text-gray-700">
                    <Check className="w-4 h-4 text-green-500" />
                    {item}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeOutcome(index)}
                    className="p-1 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Publish Status */}
        <div className="p-4 bg-gray-50 rounded-xl">
          <h3 className="font-medium text-gray-900 mb-3">Publish Status</h3>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                checked={status === "draft"}
                onChange={() => setStatus("draft")}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Save as Draft</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                checked={status === "published"}
                onChange={() => setStatus("published")}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Publish Immediately</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <Link
            href="/dashboard/products/new"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim() || !shortDescription.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Create Course
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
