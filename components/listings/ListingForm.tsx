"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import type { User } from "@/types/auth.types";
import type { Category, Location } from "@/types/listing.types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

interface ListingFormProps {
  user: User;
}

interface ListingFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  locationId: string;
  itemType: "product" | "service" | "request"; // Lowercase to match backend
  available: boolean;
  // Product-specific
  quantity?: string;
  brand?: string;
  // Service-specific
  durationMinutes?: string;
  // Request-specific
  deadline?: string;
}

export function ListingForm({ user }: ListingFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ListingFormData>({
    name: "",
    description: "",
    price: "",
    category: "",
    locationId: "",
    itemType: "product", // Lowercase to match backend
    available: true,
    quantity: "1",
    brand: "",
    durationMinutes: "",
    deadline: "",
  });

  // Load categories and locations on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesRes, locationsRes] = await Promise.all([
          apiClient.get<Category[]>(API_ENDPOINTS.CATEGORIES.ALL, true), // Require auth
          apiClient.get<Location[]>(API_ENDPOINTS.LOCATIONS.ALL, true), // Require auth
        ]);
        setCategories(categoriesRes);
        setLocations(locationsRes);
      } catch (err) {
        console.error("Error loading categories/locations:", err);
        setError("Failed to load form data. Please refresh the page.");
      }
    };
    loadData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);

    // Limit to 5 images
    if (fileArray.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }

    setImages(fileArray);

    // Create previews
    const previews = fileArray.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]); // Clean up
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate required fields
      if (
        !formData.name ||
        !formData.description ||
        !formData.price ||
        !formData.category ||
        !formData.locationId
      ) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // Build the item DTO
      const itemDto: any = {
        userId: user.userId,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        locationId: parseInt(formData.locationId),
        itemType: formData.itemType,
        available: formData.available,
        releaseDate: new Date().toISOString().split("T")[0], // Add current date in YYYY-MM-DD format
      };

      // Add type-specific fields
      if (formData.itemType === "product") {
        itemDto.quantity = formData.quantity ? parseInt(formData.quantity) : 1;
        itemDto.brand = formData.brand || "";
      } else if (formData.itemType === "service") {
        itemDto.durationMinutes = formData.durationMinutes
          ? parseInt(formData.durationMinutes)
          : 60;
      } else if (formData.itemType === "request") {
        itemDto.deadline =
          formData.deadline || new Date().toISOString().split("T")[0];
      }

      let response;

      if (images.length > 0) {
        // Use multipart upload with images
        const formDataToSend = new FormData();
        formDataToSend.append(
          "item",
          new Blob([JSON.stringify(itemDto)], { type: "application/json" }),
        );
        images.forEach((image) => {
          formDataToSend.append("images", image);
        });

        response = await apiClient.postFormData(
          API_ENDPOINTS.ITEMS.CREATE_WITH_IMAGES,
          formDataToSend,
          true,
        );
      } else {
        // JSON-only request
        response = await apiClient.post(
          API_ENDPOINTS.ITEMS.CREATE,
          itemDto,
          true,
        );
      }

      console.log("Listing created successfully:", response);

      // Redirect to listings page
      router.push("/listings");
    } catch (err: any) {
      console.error("Error creating listing:", err);
      setError(err.message || "Failed to create listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <ErrorMessage message={error} onDismiss={() => setError(null)} />
      )}

      {/* Basic Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Basic Information
        </h2>

        <Input
          label="Title"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Calculus Textbook, Tutoring Service, Looking for Roommate"
          required
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#232C64] focus:border-transparent dark:bg-slate-700 dark:text-white"
            rows={4}
            placeholder="Describe your item, service, or request in detail..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Price ($)"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Item Type
            </label>
            <select
              name="itemType"
              value={formData.itemType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#232C64] focus:border-transparent dark:bg-slate-700 dark:text-white"
              required
            >
              <option value="product">Product</option>
              <option value="service">Service</option>
              <option value="request">Request</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#232C64] focus:border-transparent dark:bg-slate-700 dark:text-white"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.categoryId} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Location
            </label>
            <select
              name="locationId"
              value={formData.locationId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#232C64] focus:border-transparent dark:bg-slate-700 dark:text-white"
              required
            >
              <option value="">Select a location</option>
              {locations.map((loc) => (
                <option key={loc.locationId} value={loc.locationId}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Type-Specific Fields */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          {formData.itemType.charAt(0).toUpperCase() +
            formData.itemType.slice(1)}{" "}
          Details
        </h2>

        {formData.itemType === "product" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Quantity"
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="1"
              min="1"
            />
            <Input
              label="Brand (optional)"
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="e.g., Apple, Nike, Pearson"
            />
          </div>
        )}

        {formData.itemType === "service" && (
          <Input
            label="Duration (minutes)"
            type="number"
            name="durationMinutes"
            value={formData.durationMinutes}
            onChange={handleChange}
            placeholder="60"
            min="1"
          />
        )}

        {formData.itemType === "request" && (
          <Input
            label="Deadline"
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
          />
        )}
      </div>

      {/* Image Upload */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Images (Optional)
        </h2>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Upload up to 5 images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="block w-full text-sm text-slate-500 dark:text-slate-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-[#232C64] file:text-white
              hover:file:bg-[#1a2350]
              cursor-pointer"
          />
        </div>

        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border-2 border-slate-300 dark:border-slate-600"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Availability */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="available"
          name="available"
          checked={formData.available}
          onChange={handleChange}
          className="w-4 h-4 text-[#232C64] border-slate-300 rounded focus:ring-[#232C64]"
        />
        <label
          htmlFor="available"
          className="text-sm text-slate-700 dark:text-slate-300"
        >
          Mark as available
        </label>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4">
        <Button type="submit" isLoading={loading} className="flex-1">
          Create Listing
        </Button>
        <Button
          type="button"
          onClick={() => router.back()}
          className="flex-1 bg-slate-500 hover:bg-slate-600"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
