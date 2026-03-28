"use client";
import React, { useState, useRef } from 'react';
import { toast } from 'sonner';

interface UploadedImage {
    file: File;
    preview: string;
    objectKey?: string;
}

interface Step3Props {
    formData: any;
    setFormData: (data: any) => void;
    back: () => void;
    next: () => void;
}

export default function Step3PricingAndPhotos({
    formData,
    setFormData,
    back,
    next,
}: Step3Props) {
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
    const fileInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
    const [priceError, setPriceError] = useState<string | undefined>();

    const handleFileSelect = (index: number, file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file');
            return;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            toast.error('Image size must be less than 10MB');
            return;
        }

        const preview = URL.createObjectURL(file);
        const newImages = [...uploadedImages];
        newImages[index] = { file, preview };
        setUploadedImages(newImages);
    };

    const handleImageClick = (index: number) => {
        fileInputRefs[index].current?.click();
    };

    const removeImage = (index: number) => {
        const newImages = [...uploadedImages];
        if (newImages[index]?.preview) {
            URL.revokeObjectURL(newImages[index]!.preview);
        }
        newImages.splice(index, 1);
        setUploadedImages(newImages);
    };

    const handlePublish = () => {
        // Validation
        if (!formData.price || parseFloat(formData.price) <= 0) {
            setPriceError('Price per hour is required and must be greater than 0.');
            return;
        }
        setPriceError(undefined);

        if (!formData.name || !formData.description) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (uploadedImages.length === 0) {
            toast.error('Please upload at least one image');
            return;
        }

        // Store uploaded images in formData for Step 4
        setFormData((prev: any) => ({ ...prev, uploadedImages }));

        // Move to next step (Schedule Template configuration)
        next();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-10">
                <span className="text-sm font-semibold text-orange-600">Step 3 of 4</span>
                <span className="text-sm text-gray-400">Photos & Pricing</span>
            </div>

            <h2 className="text-3xl font-bold mb-3">Photos & Pricing</h2>
            <p className="text-gray-500 mb-10">Upload photos of your simulator and set the hourly rental rate.</p>

            {/* Image upload boxes */}
            <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-4">Cover Photos (Upload at least 1)</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[0, 1, 2].map((index) => (
                        <div key={index}>
                            <input
                                ref={fileInputRefs[index]}
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileSelect(index, file);
                                }}
                                className="hidden"
                            />
                            <div
                                onClick={() => handleImageClick(index)}
                                className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition aspect-square"
                            >
                                {uploadedImages[index] ? (
                                    <div className="relative w-full h-full">
                                        <img
                                            src={uploadedImages[index]!.preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-full object-cover rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeImage(index);
                                            }}
                                            className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <span className="text-3xl mb-2">📷</span>
                                        <p className="text-sm text-center">Click to upload</p>
                                        <p className="text-xs mt-1">Max 10MB (JPG, PNG, WebP)</p>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price input field */}
            <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price per Hour (THB) <span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => {
                        setFormData({ ...formData, price: e.target.value });
                        if (priceError) setPriceError(undefined);
                    }}
                    placeholder="e.g. 250"
                    className={`w-full border rounded-lg px-4 py-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition ${priceError ? 'border-red-500' : 'border-gray-300'}`}
                />
                {priceError && <p className="mt-1 text-xs text-red-500">{priceError}</p>}
            </div>

            {/* Navigation buttons */}
            <div className="mt-12 pt-6 border-t border-gray-200 flex justify-between items-center">
                <button
                    onClick={back}
                    className="px-6 py-2.5 rounded-lg text-sm font-semibold text-gray-800 border border-gray-300 hover:bg-gray-50 transition"
                >
                    Back
                </button>
                <button
                    onClick={handlePublish}
                    disabled={uploadedImages.length === 0}
                    className={`px-10 py-2.5 rounded-lg text-sm font-semibold text-white transition ${uploadedImages.length === 0
                        ? 'bg-orange-400 cursor-not-allowed opacity-50'
                        : 'bg-orange-600 hover:bg-orange-700'
                        }`}
                >
                    Continue
                </button>
            </div>
        </div>
    );
}