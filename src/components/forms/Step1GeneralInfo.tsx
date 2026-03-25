import React, { useState } from 'react';

interface Step1Props {
    formData: any;
    setFormData: (data: any) => void;
    next: () => void;
    onClose: () => void;
}

export default function Step1GeneralInfo({ formData, setFormData, next, onClose }: Step1Props) {
    const [errors, setErrors] = useState<{ simulatorName?: string; description?: string; location?: string }>({});

    const handleNext = () => {
        const newErrors: typeof errors = {};
        if (!formData.simulatorName?.trim()) newErrors.simulatorName = 'Simulator name is required.';
        if (!formData.description?.trim()) newErrors.description = 'Description is required.';
        if (!formData.location?.trim()) newErrors.location = 'Installation location is required.';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});
        next();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-10">
                <span className="text-sm font-semibold text-orange-600">Step 1 of 3</span>
                <span className="text-sm text-gray-400">Basic Configuration</span>
            </div>

            <h2 className="text-3xl font-bold mb-3">General Information</h2>
            <p className="text-gray-500 mb-10">Provide the basic details of your simulation hardware to get started.</p>

            <form className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold mb-2">
                        Simulator Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.simulatorName || ''}
                        onChange={(e) => {
                            setFormData({ ...formData, simulatorName: e.target.value });
                            if (errors.simulatorName) setErrors(prev => ({ ...prev, simulatorName: undefined }));
                        }}
                        placeholder="e.g., Moza R5 at Pattaya Hotel"
                        className={`w-full px-4 py-3 border rounded-lg text-sm ${errors.simulatorName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                    />
                    {errors.simulatorName && <p className="mt-1 text-xs text-red-500">{errors.simulatorName}</p>}
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-2">
                        Simulator Descriptions <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={formData.description || ''}
                        onChange={(e) => {
                            setFormData({ ...formData, description: e.target.value });
                            if (errors.description) setErrors(prev => ({ ...prev, description: undefined }));
                        }}
                        placeholder="e.g., This is the best sim racing in this area."
                        rows={6}
                        className={`w-full px-4 py-3 border rounded-lg text-sm ${errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                    />
                    {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-2">
                        Installation Location <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.location || ''}
                        onChange={(e) => {
                            setFormData({ ...formData, location: e.target.value });
                            if (errors.location) setErrors(prev => ({ ...prev, location: undefined }));
                        }}
                        placeholder="e.g., Berlin Facility - Room 302"
                        className={`w-full px-4 py-3 border rounded-lg text-sm ${errors.location ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                    />
                    {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location}</p>}
                </div>
            </form>

            <div className="mt-12 pt-6 border-t border-gray-200 flex justify-end gap-4">
                <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-lg text-sm font-semibold text-gray-800 border border-gray-300 hover:bg-gray-50 transition"
                >
                    Save Draft
                </button>
                <button
                    onClick={handleNext}
                    className="px-10 py-2.5 rounded-lg text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 transition"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}