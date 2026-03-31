"use client";
import React, { useState } from 'react';
import { toast } from 'sonner';

interface UploadedImage {
    file: File;
    preview: string;
    objectKey?: string;
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const HOURS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

interface Step4Props {
    formData: any;
    setFormData: (data: any) => void;
    back: () => void;
    submit: () => void;
    finalizeSimulatorWithSchedule: (
        uploadedImages: UploadedImage[],
        daysOfWeek: number[],
        startTime: string,
        endTime: string
    ) => Promise<void>;
}

export default function Step4ScheduleTemplate({
    formData,
    setFormData,
    back,
    submit,
    finalizeSimulatorWithSchedule,
}: Step4Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedDays, setSelectedDays] = useState<number[]>([]);
    const [startTime, setStartTime] = useState<string>('09:00');
    const [endTime, setEndTime] = useState<string>('21:00');

    const toggleDay = (dayIndex: number) => {
        setSelectedDays(prev =>
            prev.includes(dayIndex)
                ? prev.filter(d => d !== dayIndex)
                : [...prev, dayIndex].sort()
        );
    };

    const handleSaveAndExit = async () => {
        // Validation
        if (selectedDays.length === 0) {
            toast.error('Please select at least one day');
            return;
        }

        if (!startTime || !endTime) {
            toast.error('Please select start and end times');
            return;
        }

        if (startTime >= endTime) {
            toast.error('End time must be after start time');
            return;
        }

        if (!formData.price || parseFloat(formData.price) <= 0) {
            toast.error('Price per hour must be set');
            return;
        }

        setIsSubmitting(true);

        try {
            // Call parent function to create everything: simulator, images, and schedule templates
            await finalizeSimulatorWithSchedule(
                formData.uploadedImages,
                selectedDays,
                startTime,
                endTime
            );

            // Submit the form
            submit();
        } catch (error) {
            // Error handling is done in parent component
            console.error('Error creating simulator and schedule:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-2">
            <h2 className="text-2xl font-bold mb-2">Step 4: Schedule & Availability</h2>
            <p className="text-gray-600 text-sm mb-6">
                Set recurring availability for your simulator. You can add more schedules later if needed.
            </p>

            {/* Days of Week Selection */}
            <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                    Available Days
                </label>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                    {DAY_NAMES.map((day, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => toggleDay(index)}
                            className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${selectedDays.includes(index)
                                ? 'bg-orange-600 text-white border-2 border-orange-600'
                                : 'bg-gray-100 text-gray-700 border-2 border-gray-300 hover:bg-gray-200'
                                }`}
                        >
                            {day.slice(0, 3)}
                        </button>
                    ))}
                </div>
                {selectedDays.length > 0 && (
                    <p className="mt-2 text-xs text-gray-600">
                        Selected: {selectedDays.map(d => DAY_NAMES[d]).join(', ')}
                    </p>
                )}
            </div>

            {/* Time Range Selection */}
            <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                    Operating Hours
                </label>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Start Time */}
                    <div>
                        <label className="block text-xs text-gray-600 mb-2">Start Time</label>
                        <select
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                        >
                            {HOURS.map(hour => (
                                <option key={hour} value={hour}>
                                    {hour}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* End Time */}
                    <div>
                        <label className="block text-xs text-gray-600 mb-2">End Time</label>
                        <select
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                        >
                            {HOURS.map(hour => (
                                <option key={hour} value={hour}>
                                    {hour}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Visual Preview */}
                {startTime && endTime && startTime < endTime && (
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <p className="text-sm text-gray-700">
                            <span className="font-semibold text-orange-600">
                                {startTime}
                            </span>
                            {' - '}
                            <span className="font-semibold text-orange-600">
                                {endTime}
                            </span>
                            {' • '}
                            <span className="text-gray-600">
                                {selectedDays.length > 0
                                    ? `${selectedDays.length} day${selectedDays.length > 1 ? 's' : ''} per week`
                                    : 'No days selected'}
                            </span>
                        </p>
                        <p className="text-xs text-gray-600 mt-2">
                            Price per hour: <span className="font-semibold">฿{formData.price || '0'}</span>
                        </p>
                    </div>
                )}
            </div>

            {/* Hourly Time Slots Preview */}
            {selectedDays.length > 0 && startTime && endTime && startTime < endTime && (
                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Available Time Slots{' '}
                        <span className="text-xs text-gray-600 font-normal">
                            (1-hour increments)
                        </span>
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-64 overflow-y-auto p-2 bg-gray-50 rounded-lg">
                        {HOURS.map(hour => {
                            const hourNum = parseInt(hour);
                            const startNum = parseInt(startTime);
                            const endNum = parseInt(endTime);
                            const isInRange = hourNum >= startNum && hourNum < endNum;

                            return isInRange ? (
                                <div
                                    key={hour}
                                    className="px-2 py-1 rounded bg-orange-100 border border-orange-300 text-center text-xs font-medium text-orange-700"
                                >
                                    {hour}
                                </div>
                            ) : null;
                        })}
                    </div>
                </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-10 pt-4 border-t border-gray-200">
                <button
                    onClick={back}
                    disabled={isSubmitting}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition disabled:opacity-50"
                >
                    Back
                </button>

                <div className="flex gap-3">
                    <button
                        onClick={handleSaveAndExit}
                        disabled={isSubmitting || selectedDays.length === 0}
                        className={`px-6 py-2 rounded-lg text-white font-medium transition ${isSubmitting || selectedDays.length === 0
                            ? 'bg-orange-400 cursor-not-allowed opacity-50'
                            : 'bg-orange-600 hover:bg-orange-700'
                            }`}
                    >
                        {isSubmitting ? 'Saving...' : 'Save & Exit'}
                    </button>
                </div>
            </div>
        </div>
    );
}
