import React, { useState, useEffect } from 'react';
import { axiosInstance } from '@/lib/http';

interface Step2Props {
    formData: any;
    setFormData: (data: any) => void;
    next: () => void;
    back: () => void;
}

interface Brand {
    id: number;
    brandName: string;
}

interface Model {
    id: number;
    modelName: string;
    brandId: number;
    brand: Brand;
}

export default function Step2HardwareSpecs({ formData, setFormData, next, back }: Step2Props) {
    const [errors, setErrors] = useState<{ platform?: string; brand?: string; wheelBase?: string; pedals?: string; screenSetup?: string; model?: string }>({});
    const [brands, setBrands] = useState<Brand[]>([]);
    const [models, setModels] = useState<Model[]>([]);
    const [loadingBrands, setLoadingBrands] = useState(true);
    const [loadingModels, setLoadingModels] = useState(false);

    useEffect(() => {
        // Fetch brands on component mount
        const fetchBrands = async () => {
            try {
                setLoadingBrands(true);
                const response = await axiosInstance.get('/simulator/brands/list');
                setBrands(response.data || []);
            } catch (error) {
                console.error('Failed to fetch brands:', error);
                setErrors(prev => ({ ...prev, brand: 'Failed to load brands' }));
            } finally {
                setLoadingBrands(false);
            }
        };
        fetchBrands();
    }, []);

    // Fetch models when brand is selected
    useEffect(() => {
        const fetchModels = async () => {
            if (!formData.brandId) {
                setModels([]);
                return;
            }
            try {
                setLoadingModels(true);
                const response = await axiosInstance.get('/simulator/models/list', {
                    params: { brandId: formData.brandId }
                });
                setModels(response.data || []);
            } catch (error) {
                console.error('Failed to fetch models:', error);
                setErrors(prev => ({ ...prev, model: 'Failed to load models' }));
            } finally {
                setLoadingModels(false);
            }
        };
        fetchModels();
    }, [formData.brandId]);

    const handleNext = () => {
        const newErrors: typeof errors = {};
        if (!formData.platform) newErrors.platform = 'Platform is required.';
        if (!formData.brandId) newErrors.brand = 'Brand is required.';
        if (!formData.wheelBase?.trim()) newErrors.wheelBase = 'Wheel base is required.';
        if (!formData.pedals?.trim()) newErrors.pedals = 'Pedals are required.';
        if (!formData.screenSetup) newErrors.screenSetup = 'Screen setup is required.';
        if (!formData.modId) newErrors.model = 'Model is required.';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});
        next();
    };

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
                        <label className="block text-sm font-semibold mb-2">
                            Platform <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.platform || ''}
                            onChange={(e) => {
                                setFormData({ ...formData, platform: e.target.value });
                                if (errors.platform) setErrors(prev => ({ ...prev, platform: undefined }));
                            }}
                            className={`w-full px-4 py-3 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.platform ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            <option value="">Select platform...</option>
                            <option value="PC">PC</option>
                            <option value="PS5">PlayStation 5</option>
                            <option value="Xbox">Xbox Series X/S</option>
                        </select>
                        {errors.platform && <p className="mt-1 text-xs text-red-500">{errors.platform}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Brand <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.brandId || ''}
                            onChange={(e) => {
                                const brandId = e.target.value ? parseInt(e.target.value) : '';
                                setFormData({ ...formData, brandId, modId: '' });
                                if (errors.brand) setErrors(prev => ({ ...prev, brand: undefined }));
                            }}
                            disabled={loadingBrands}
                            className={`w-full px-4 py-3 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100 ${errors.brand ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            <option value="">{loadingBrands ? 'Loading brands...' : 'Select brand...'}</option>
                            {brands.map((brand) => (
                                <option key={brand.id} value={brand.id}>
                                    {brand.brandName}
                                </option>
                            ))}
                        </select>
                        {errors.brand && <p className="mt-1 text-xs text-red-500">{errors.brand}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Model <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.modId || ''}
                            onChange={(e) => {
                                setFormData({ ...formData, modId: e.target.value ? parseInt(e.target.value) : '' });
                                if (errors.model) setErrors(prev => ({ ...prev, model: undefined }));
                            }}
                            disabled={!formData.brandId || loadingModels}
                            className={`w-full px-4 py-3 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100 ${errors.model ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            <option value="">{loadingModels ? 'Loading models...' : !formData.brandId ? 'Select brand first...' : 'Select model...'}</option>
                            {models.map((model) => (
                                <option key={model.id} value={model.id}>
                                    {model.modelName}
                                </option>
                            ))}
                        </select>
                        {errors.model && <p className="mt-1 text-xs text-red-500">{errors.model}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Wheel Base <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.wheelBase || ''}
                            onChange={(e) => {
                                setFormData({ ...formData, wheelBase: e.target.value });
                                if (errors.wheelBase) setErrors(prev => ({ ...prev, wheelBase: undefined }));
                            }}
                            placeholder="e.g., Fanatec DD Pro (8Nm)"
                            className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.wheelBase ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.wheelBase && <p className="mt-1 text-xs text-red-500">{errors.wheelBase}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Pedals <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.pedals || ''}
                            onChange={(e) => {
                                setFormData({ ...formData, pedals: e.target.value });
                                if (errors.pedals) setErrors(prev => ({ ...prev, pedals: undefined }));
                            }}
                            placeholder="e.g., Heusinkveld Sprint"
                            className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.pedals ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.pedals && <p className="mt-1 text-xs text-red-500">{errors.pedals}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Screen Setup <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.screenSetup || ''}
                            onChange={(e) => {
                                setFormData({ ...formData, screenSetup: e.target.value });
                                if (errors.screenSetup) setErrors(prev => ({ ...prev, screenSetup: undefined }));
                            }}
                            className={`w-full px-4 py-3 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.screenSetup ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            <option value="">Select screen setup...</option>
                            <option value="Single">Single Monitor</option>
                            <option value="Triple">Triple Monitors</option>
                            <option value="VR">VR Headset</option>
                        </select>
                        {errors.screenSetup && <p className="mt-1 text-xs text-red-500">{errors.screenSetup}</p>}
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
                    onClick={handleNext}
                    className="px-10 py-2.5 rounded-lg text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 transition"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}