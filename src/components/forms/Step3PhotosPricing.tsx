"use client";
import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { axiosInstance, axiosJWTInstance } from '@/lib/http';

interface UploadedImage {
    file: File;
    preview: string;
    objectKey?: string;
}

export default function Step3PricingAndPhotos({ formData, setFormData, back, submit }: any) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
    const fileInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
    const [uploadProgress, setUploadProgress] = useState<{ [key: number]: number }>({});
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

    const uploadImageToS3 = async (file: File, simId: number, imageIndex: number): Promise<string> => {
        try {
            // Determine content type
            const contentType = (file.type === 'image/jpeg' ? 'image/jpeg' : file.type === 'image/png' ? 'image/png' : 'image/webp') as 'image/jpeg' | 'image/png' | 'image/webp';

            // Get presigned URL
            const presignedResponse = await axiosJWTInstance.post(
                `/host/simulator/${simId}/image-upload`,
                { contentType }
            );

            const { uploadUrl, objectKey } = presignedResponse.data;

            // Upload to S3
            const uploadResponse = await axiosInstance.put(uploadUrl, file, {
                headers: {
                    'Content-Type': contentType,
                },
            });

            console.log(uploadResponse)

            if (uploadResponse.status !== 200) {
                throw new Error(`S3 upload failed: ${uploadResponse.statusText}`);
            }

            setUploadProgress(prev => ({ ...prev, [imageIndex]: 100 }));
            return objectKey;
        } catch (error) {
            console.error(`Error uploading image ${imageIndex + 1}:`, error);
            throw error;
        }
    };

    const handlePublish = async () => {
        // Validation
        if (!formData.price || parseFloat(formData.price) <= 0) {
            setPriceError('Price per hour is required and must be greater than 0.');
            return;
        }
        setPriceError(undefined);

        if (!formData.simulatorName || !formData.description) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (uploadedImages.length === 0) {
            toast.error('Please upload at least one image');
            return;
        }

        setIsSubmitting(true);

        try {
            // Step 1: Create simulator
            const payload = {
                simlistname: formData.simulatorName,
                listdescription: formData.description,
                priceperhour: parseFloat(formData.price),
                addressdetail: formData.location || 'Not specified',
                latitude: formData.latitude || 13.73569,
                longitude: formData.longitude || 100.565727,
                simtypeid: formData.simtypeid || [1],
                modid: formData.modid || 2,
                cityId: formData.cityId || 106448,
            };

            console.log("Creating simulator with data:", payload);
            const createResponse = await axiosJWTInstance.post('/host/simulator', payload);
            const simId = createResponse.data.simid;

            if (!simId) {
                throw new Error('Failed to get simulator ID from response');
            }

            toast.success(`Simulator created with ID: ${simId}`);
            console.log("Simulator created:", simId);

            // Step 2 & 3: Upload images to S3 and collect object keys
            const imageUpdates: { [key: string]: string } = {};
            const imageKeys = ['firstImageKey', 'secondImageKey', 'thirdImageKey'];

            for (let i = 0; i < uploadedImages.length; i++) {
                if (uploadedImages[i]) {
                    try {
                        setUploadProgress(prev => ({ ...prev, [i]: 50 }));
                        const objectKey = await uploadImageToS3(uploadedImages[i]!.file, simId, i);
                        imageUpdates[imageKeys[i]] = objectKey;
                        console.log(`Image ${i + 1} uploaded with key:`, objectKey);
                        toast.success(`Image ${i + 1} uploaded successfully`);
                    } catch (error) {
                        console.error(`Failed to upload image ${i + 1}:`, error);
                        toast.error(`Failed to upload image ${i + 1}`);
                    }
                }
            }

            // Step 4: Confirm simulator images (validates S3 keys and saves CDN URLs)
            if (Object.keys(imageUpdates).length > 0) {
                console.log("Confirming simulator images with keys:", imageUpdates);
                const updateResponse = await axiosJWTInstance.patch(
                    `/host/simulator/${simId}/images/confirm`,
                    imageUpdates
                );
                console.log("Simulator updated with images:", updateResponse.data);
                toast.success("Simulator images updated successfully! 🎉");
            }

            if (submit) {
                submit();
            }
        } catch (error: any) {
            console.error("Error in simulator creation workflow:", error);
            const errorMessage = error.response?.data?.message || error.message || "Failed to create simulator";
            toast.error(`Error: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
            setUploadProgress({});
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-2">
            <h2 className="text-2xl font-bold mb-6">Step 3: Photos & Pricing</h2>

            {/* Image upload boxes */}
            <div className="mb-6">
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
                                        {uploadProgress[index] !== undefined && uploadProgress[index] < 100 && (
                                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                                                <div className="text-white text-center">
                                                    <div className="text-sm font-medium mb-2">Uploading...</div>
                                                    <div className="w-24 h-1 bg-gray-300 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-orange-500 transition-all"
                                                            style={{ width: `${uploadProgress[index]}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {uploadProgress[index] === 100 && (
                                            <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
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
            <div className="mb-6">
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
            <div className="flex justify-between items-center mt-10 pt-4 border-t border-gray-200">
                <button
                    onClick={back}
                    disabled={isSubmitting}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition disabled:opacity-50"
                >
                    Back
                </button>
                <button
                    onClick={handlePublish}
                    disabled={isSubmitting || uploadedImages.length === 0}
                    className={`px-6 py-2 rounded-lg text-white font-medium transition ${isSubmitting || uploadedImages.length === 0
                        ? 'bg-orange-400 cursor-not-allowed opacity-50'
                        : 'bg-orange-600 hover:bg-orange-700'
                        }`}
                >
                    {isSubmitting ? 'Publishing...' : 'Finish & Publish'}
                </button>
            </div>
        </div>
    );
}