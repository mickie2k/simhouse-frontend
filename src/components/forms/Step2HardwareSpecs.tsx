import React from 'react';

interface Step2Props {
    formData: any;
    setFormData: (data: any) => void;
    next: () => void;
    back: () => void;
}

export default function Step2HardwareSpecs({ formData, setFormData, next, back }: Step2Props) {
    return (
        <div>
            {/* Status bar at the top */}
            <div className="flex justify-between items-center mb-10">
                <span className="text-sm font-semibold text-orange-600">Step 2 of 3</span>
                <span className="text-sm text-gray-400">Hardware Specifications</span>
            </div>

            <h2 className="text-3xl font-bold mb-3">Hardware Details</h2>
            <p className="text-gray-500 mb-10">Tell us about the equipment included in your setup.</p>

            {/* Data entry form */}
            <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Platform</label>
                        <select
                            value={formData.platform || ''}
                            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="">Select platform...</option>
                            <option value="PC">PC</option>
                            <option value="PS5">PlayStation 5</option>
                            <option value="Xbox">Xbox Series X/S</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Wheel Base</label>
                        <input
                            type="text"
                            value={formData.wheelBase || ''}
                            onChange={(e) => setFormData({ ...formData, wheelBase: e.target.value })}
                            placeholder="e.g., Fanatec DD Pro (8Nm)"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Pedals</label>
                        <input
                            type="text"
                            value={formData.pedals || ''}
                            onChange={(e) => setFormData({ ...formData, pedals: e.target.value })}
                            placeholder="e.g., Heusinkveld Sprint"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Screen Setup</label>
                        <select
                            value={formData.screenSetup || ''}
                            onChange={(e) => setFormData({ ...formData, screenSetup: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="">Select screen setup...</option>
                            <option value="Single">Single Monitor</option>
                            <option value="Triple">Triple Monitors</option>
                            <option value="VR">VR Headset</option>
                        </select>
                    </div>
                </div>
            </form>

            {/* Back and Continue buttons */}
            <div className="mt-12 pt-6 border-t border-gray-200 flex justify-between items-center">
                <button
                    onClick={back}
                    className="px-6 py-2.5 rounded-lg text-sm font-semibold text-gray-800 border border-gray-300 hover:bg-gray-50 transition"
                >
                    Back
                </button>
                <button
                    onClick={next}
                    className="px-10 py-2.5 rounded-lg text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 transition"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}