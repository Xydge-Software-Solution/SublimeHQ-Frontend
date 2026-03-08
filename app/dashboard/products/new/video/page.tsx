"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Video,
  Upload,
  Trash2,
  Plus,
  Check,
  Loader2,
  Play,
  Clock,
  Film,
} from "lucide-react";
import { storage, type Product, type VideoDetails } from "@/lib/storage";

interface Chapter {
  id: string;
  title: string;
  startTime: string;
  description: string;
}

export default function NewVideoProductPage() {
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

  // Video Details
  const [duration, setDuration] = useState("");
  const [format, setFormat] = useState("mp4");
  const [resolution, setResolution] = useState("1080p");
  const [previewUrl, setPreviewUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [hostingPlatform, setHostingPlatform] = useState("");

  // Chapters
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [newChapter, setNewChapter] = useState<Omit<Chapter, "id">>({
    title: "",
    startTime: "",
    description: "",
  });

  // Subtitles
  const [hasSubtitles, setHasSubtitles] = useState(false);
  const [subtitleLanguages, setSubtitleLanguages] = useState<string[]>([]);
  const [newSubtitleLang, setNewSubtitleLang] = useState("");

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

  const addChapter = () => {
    if (newChapter.title.trim() && newChapter.startTime.trim()) {
      setChapters([...chapters, { ...newChapter, id: crypto.randomUUID() }]);
      setNewChapter({ title: "", startTime: "", description: "" });
    }
  };

  const removeChapter = (id: string) => {
    setChapters(chapters.filter((c) => c.id !== id));
  };

  const addSubtitleLanguage = () => {
    if (newSubtitleLang.trim() && !subtitleLanguages.includes(newSubtitleLang.trim())) {
      setSubtitleLanguages([...subtitleLanguages, newSubtitleLang.trim()]);
      setNewSubtitleLang("");
    }
  };

  const removeSubtitleLanguage = (lang: string) => {
    setSubtitleLanguages(subtitleLanguages.filter((l) => l !== lang));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !shortDescription.trim()) {
      alert("Please fill in the required fields");
      return;
    }

    setIsSubmitting(true);

    const videoDetails: VideoDetails = {
      duration: duration || undefined,
      previewUrl: previewUrl || undefined,
      videoUrl: videoUrl || undefined,
      format: format || undefined,
      chapters: chapters.length > 0 ? chapters.map((c) => ({
        title: c.title,
        startTime: c.startTime,
        description: c.description || undefined,
      })) : undefined,
      subtitles: hasSubtitles && subtitleLanguages.length > 0 ? subtitleLanguages : undefined,
    };

    const newProduct: Omit<Product, "id" | "createdAt" | "sales"> = {
      type: "video",
      title,
      description,
      shortDescription,
      price,
      compareAtPrice,
      image: image || "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=400&h=300&fit=crop",
      rating: 0,
      reviewCount: 0,
      status,
      category: category || undefined,
      videoDetails,
    };

    storage.addProduct(newProduct);
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSubmitting(false);
    router.push("/dashboard/products");
  };

  const commonLanguages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Portuguese",
    "Chinese",
    "Japanese",
    "Korean",
    "Arabic",
    "Hindi",
  ];

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
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <Video className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Video Product</h1>
            <p className="text-gray-500">Tutorials, masterclasses, and video content</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-8">
        {/* Basic Information */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Video Thumbnail</label>
            {image ? (
              <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="Thumbnail" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 bg-black/50 rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-white ml-1" />
                  </div>
                </div>
                <button
                  onClick={() => setImage("")}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-red-500 hover:bg-red-50/50 transition-colors">
                <Film className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  <span className="font-medium text-red-600">Upload thumbnail</span>
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
              Video Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Complete Video Editing Masterclass"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
              placeholder="Brief one-line description"
              maxLength={150}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of your video content..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              <option value="tutorial">Tutorial</option>
              <option value="masterclass">Masterclass</option>
              <option value="workshop">Workshop Recording</option>
              <option value="documentary">Documentary</option>
              <option value="entertainment">Entertainment</option>
              <option value="fitness">Fitness / Workout</option>
              <option value="music">Music / Performance</option>
              <option value="other">Other</option>
            </select>
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
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Video Details */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Film className="w-5 h-5 text-gray-400" />
            Video Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 2h 30m"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="mp4">MP4</option>
                <option value="mov">MOV</option>
                <option value="avi">AVI</option>
                <option value="webm">WebM</option>
                <option value="stream">Stream Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Resolution</label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="4k">4K (2160p)</option>
                <option value="1080p">Full HD (1080p)</option>
                <option value="720p">HD (720p)</option>
                <option value="480p">SD (480p)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preview URL</label>
              <input
                type="url"
                value={previewUrl}
                onChange={(e) => setPreviewUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">Free preview trailer or clip</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hosting Platform</label>
              <select
                value={hostingPlatform}
                onChange={(e) => setHostingPlatform(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select platform</option>
                <option value="vimeo">Vimeo</option>
                <option value="youtube">YouTube (Unlisted)</option>
                <option value="wistia">Wistia</option>
                <option value="bunny">Bunny Stream</option>
                <option value="self">Self-hosted</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Chapters */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Chapters / Sections</h2>
          <p className="text-sm text-gray-500">Break your video into navigable sections</p>

          <div className="p-4 bg-gray-50 rounded-xl space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={newChapter.startTime}
                onChange={(e) => setNewChapter({ ...newChapter, startTime: e.target.value })}
                placeholder="0:00"
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <input
                type="text"
                value={newChapter.title}
                onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
                placeholder="Chapter title"
                className="sm:col-span-2 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <input
              type="text"
              value={newChapter.description}
              onChange={(e) => setNewChapter({ ...newChapter, description: e.target.value })}
              placeholder="Brief description (optional)"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={addChapter}
              disabled={!newChapter.title.trim() || !newChapter.startTime.trim()}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add Chapter
            </button>
          </div>

          {chapters.length > 0 && (
            <div className="space-y-2">
              {chapters.map((chapter, index) => (
                <div
                  key={chapter.id}
                  className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg"
                >
                  <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {chapter.startTime}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">
                      {index + 1}. {chapter.title}
                    </p>
                    {chapter.description && (
                      <p className="text-sm text-gray-500">{chapter.description}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeChapter(chapter.id)}
                    className="p-1 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subtitles */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Subtitles / Captions</h2>
              <p className="text-sm text-gray-500">Make your content accessible</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={hasSubtitles}
                onChange={(e) => setHasSubtitles(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-red-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-red-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>

          {hasSubtitles && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {commonLanguages.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      if (subtitleLanguages.includes(lang)) {
                        removeSubtitleLanguage(lang);
                      } else {
                        setSubtitleLanguages([...subtitleLanguages, lang]);
                      }
                    }}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                      subtitleLanguages.includes(lang)
                        ? "bg-red-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubtitleLang}
                  onChange={(e) => setNewSubtitleLang(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSubtitleLanguage())}
                  placeholder="Other language..."
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addSubtitleLanguage}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
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
                className="text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">Save as Draft</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                checked={status === "published"}
                onChange={() => setStatus("published")}
                className="text-red-600 focus:ring-red-500"
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
            className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Create Video
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
