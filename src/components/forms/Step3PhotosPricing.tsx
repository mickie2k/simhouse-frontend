"use client";
import React, { useState } from 'react';
import { toast } from 'sonner';
import { axiosJWTInstance } from '@/lib/http';

export default function Step3PricingAndPhotos({ formData, setFormData, prevStep, submit }: any) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePublish = async () => {
        setIsSubmitting(true);

        const payload = {
            // Data from Form (Step 1 & 3)
            simlistname: formData.simulatorName || 'New Simulator',
            listdescription: formData.description || 'No details provided',
            priceperhour: parseFloat(formData.price) || 0,
            addressdetail: formData.location || 'Not specified',

            latitude: 13.73569,   // Mock coordinates for now
            longitude: 100.565727,

            // Add missing simtypeid (Backend requires array of numbers)
            simtypeid: [1], // Mock simulator type ID as 1
            modid: 2,       // Mock model ID as 2
            cityId: 106448, // City ID 
        };

        console.log("Sending data to API:", payload);

        try {
            const { data: responseData } = await axiosJWTInstance.post('/host/simulator', payload);

            console.log("Data saved successfully:", responseData);
            toast.success("Data saved to Database successfully! 🎉");

            if (submit) {
                submit();
            }
        } catch (error: any) {
            console.error("Error connecting to API:", error);
            const errorMessage = error.response?.data?.message || error.message || "Unable to connect to backend server. Please check if Backend is running.";
            toast.error(`Error: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-2">
            <h2 className="text-2xl font-bold mb-6">Step 3: Photos & Pricing</h2>

            {/* Mock image upload box */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Photo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition">
                    <span className="text-3xl mb-2">📷</span>
                    <p>Click to upload or drag and drop</p>
                    <p className="text-xs mt-1">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                </div>
            </div>

            {/* Price input field */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Price per Hour (THB)</label>
                <input
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 250"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                />
            </div>

            {/* ปุ่มกดกดย้อนกลับ และ บันทึก */}
            <div className="flex justify-between items-center mt-10 pt-4 border-t border-gray-200">
                <button
                    onClick={prevStep}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition"
                >
                    Back
                </button>
                <button
                    onClick={handlePublish}
                    disabled={isSubmitting}
                    className={`px-6 py-2 rounded-lg text-white font-medium transition ${isSubmitting ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'
                        }`}
                >
                    {isSubmitting ? 'Publishing...' : 'Finish & Publish'}
                </button>
            </div>
        </div>
    );
}