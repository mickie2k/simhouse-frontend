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

interface Pedal {
    id: number;
    modelName: string;
    brandId: number;
}

interface SimulatorType {
    id: number;
    typeName: string;
}

export default function Step2HardwareSpecs({ formData, setFormData, next, back }: Step2Props) {
    const [errors, setErrors] = useState<{ platform?: string; wheelBaseBrandId?: string; wheelBaseModelId?: string; pedalBrandId?: string; pedalModelId?: string; screenSetup?: string; simtypeid?: string }>({});
    const [brands, setBrands] = useState<Brand[]>([]);
    const [wheelBaseModels, setWheelBaseModels] = useState<Model[]>([]);
    const [pedalBrands, setPedalBrands] = useState<Brand[]>([]);
    const [pedals, setPedals] = useState<Pedal[]>([]);
    const [simulatorTypes, setSimulatorTypes] = useState<SimulatorType[]>([]);
    const [loadingBrands, setLoadingBrands] = useState(true);
    const [loadingWheelBaseModels, setLoadingWheelBaseModels] = useState(false);
    const [loadingPedals, setLoadingPedals] = useState(false);
    const [loadingTypes, setLoadingTypes] = useState(true);

    useEffect(() => {
        // Fetch brands, pedal brands, and simulator types on component mount
        const fetchData = async () => {
            try {
                setLoadingBrands(true);
                setLoadingTypes(true);
                const [brandsRes, typesRes] = await Promise.all([
                    axiosInstance.get('/simulator/brands/list'),
                    axiosInstance.get('/simulator/types/list'),
                ]);
                setBrands(brandsRes.data || []);
                setPedalBrands(brandsRes.data || []);
                setSimulatorTypes(typesRes.data || []);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                setErrors(prev => ({ ...prev, wheelBaseBrandId: 'Failed to load brands' }));
            } finally {
                setLoadingBrands(false);
                setLoadingTypes(false);
            }
        };
        fetchData();
    }, []);

    // Fetch wheel base models when brand is selected
    useEffect(() => {
        const fetchWheelBaseModels = async () => {
            if (!formData.wheelBaseBrandId) {
                setWheelBaseModels([]);
                return;
            }
            try {
                setLoadingWheelBaseModels(true);
                const response = await axiosInstance.get('/simulator/models/list');
                const filtered = (response.data || []).filter((m: Model) => m.brandId === parseInt(formData.wheelBaseBrandId));
                setWheelBaseModels(filtered);
            } catch (error) {
                console.error('Failed to fetch models:', error);
                setErrors(prev => ({ ...prev, wheelBaseModelId: 'Failed to load models' }));
            } finally {
                setLoadingWheelBaseModels(false);
            }
        };
        fetchWheelBaseModels();
    }, [formData.wheelBaseBrandId]);

    // Fetch pedals when pedal brand is selected
    useEffect(() => {
        const fetchPedals = async () => {
            if (!formData.pedalBrandId) {
                setPedals([]);
                return;
            }
            try {
                setLoadingPedals(true);
                const response = await axiosInstance.get('/simulator/pedals/list');
                const filtered = (response.data || []).filter((p: Pedal) => p.brandId === parseInt(formData.pedalBrandId));
                setPedals(filtered);
            } catch (error) {
                console.error('Failed to fetch pedals:', error);
                setErrors(prev => ({ ...prev, pedalModelId: 'Failed to load pedals' }));
            } finally {
                setLoadingPedals(false);
            }
        };
        fetchPedals();
    }, [formData.pedalBrandId]);

    const handleNext = () => {
        const newErrors: typeof errors = {};
        if (!formData.platform) newErrors.platform = 'Platform is required.';
        if (!formData.wheelBaseBrandId) newErrors.wheelBaseBrandId = 'Wheel base brand is required.';
        if (!formData.wheelBaseModelId) newErrors.wheelBaseModelId = 'Wheel base model is required.';
        if (!formData.pedalBrandId) newErrors.pedalBrandId = 'Pedal brand is required.';
        if (!formData.pedalModelId) newErrors.pedalModelId = 'Pedal model is required.';
        if (!formData.screenSetup) newErrors.screenSetup = 'Screen setup is required.';
        if (!formData.simtypeid || formData.simtypeid.length === 0) newErrors.simtypeid = 'At least one simulator type is required.';

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
                <span className="text-sm font-semibold text-orange-600">Step 2 of 4</span>
                <span className="text-sm text-gray-400">Hardware Specifications</span>
            </div>

            <h2 className="text-3xl font-bold mb-3">Hardware Details</h2>
            <p className="text-gray-500 mb-10">Tell us about the equipment included in your setup.</p>

            {/* Data entry form */}
            <form className="space-y-8">
                {/* Simulator Type Section */}
                <div>
                    <h4 className="text-sm font-bold text-gray-700 mb-4">Simulator Type</h4>
                    {loadingTypes ? (
                        <div className="text-sm text-gray-500">Loading simulator types...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {simulatorTypes.map((type) => (
                                <label
                                    key={type.id}
                                    className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-orange-300 cursor-pointer transition"
                                >
                                    <input
                                        type="checkbox"
                                        checked={(formData.simtypeid || []).includes(type.id)}
                                        onChange={(e) => {
                                            const newTypes = e.target.checked
                                                ? [...(formData.simtypeid || []), type.id]
                                                : (formData.simtypeid || []).filter((id: number) => id !== type.id);
                                            setFormData({ ...formData, simtypeid: newTypes });
                                            if (errors.simtypeid) setErrors(prev => ({ ...prev, simtypeid: undefined }));
                                        }}
                                        className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500 cursor-pointer"
                                    />
                                    <div className="ml-3">
                                        <p className="font-medium text-gray-700">{type.typeName}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}
                    {errors.simtypeid && <p className="mt-2 text-xs text-red-500">{errors.simtypeid}</p>}
                </div>

                {/* Platform Section */}
                <div>
                    <h4 className="text-sm font-bold text-gray-700 mb-4">Platform</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { id: 1, name: 'PC', desc: 'Windows / Linux' },
                            { id: 2, name: 'PlayStation', desc: 'Console Ready' },
                            { id: 3, name: 'Xbox Series', desc: 'Support' },
                        ].map((option) => (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => {
                                    setFormData({ ...formData, platform: option.id });
                                    if (errors.platform) setErrors(prev => ({ ...prev, platform: undefined }));
                                }}
                                className={`p-4 rounded-2xl border-2 transition ${formData.platform === option.id
                                    ? 'border-orange-500 bg-orange-50'
                                    : 'border-gray-200 bg-gray-50 hover:border-orange-300'
                                    }`}
                            >
                                <div className="text-center">
                                    <p className="font-semibold text-gray-900">{option.name}</p>
                                    <p className="text-xs text-gray-500">{option.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                    {errors.platform && <p className="mt-2 text-xs text-red-500">{errors.platform}</p>}
                </div>

                {/* Wheel Base Section */}
                <div>
                    <h4 className="text-sm font-bold text-gray-700 mb-4">Wheel Base</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-2">BRAND</label>
                            <select
                                value={formData.wheelBaseBrandId || ''}
                                onChange={(e) => {
                                    const brandId = e.target.value ? parseInt(e.target.value) : '';
                                    setFormData({ ...formData, wheelBaseBrandId: brandId, wheelBaseModelId: '' });
                                    if (errors.wheelBaseBrandId) setErrors(prev => ({ ...prev, wheelBaseBrandId: undefined }));
                                }}
                                disabled={loadingBrands}
                                className={`w-full p-3 bg-white border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-sm disabled:bg-gray-100 ${errors.wheelBaseBrandId ? 'border-red-500' : 'border-gray-200'}`}
                            >
                                <option value="">{loadingBrands ? 'Loading brands...' : 'Select brand...'}</option>
                                {brands.map((brand) => (
                                    <option key={brand.id} value={brand.id}>{brand.brandName}</option>
                                ))}
                            </select>
                            {errors.wheelBaseBrandId && <p className="mt-1 text-xs text-red-500">{errors.wheelBaseBrandId}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-2">MODEL</label>
                            <select
                                value={formData.wheelBaseModelId || ''}
                                onChange={(e) => {
                                    setFormData({ ...formData, wheelBaseModelId: e.target.value ? parseInt(e.target.value) : '' });
                                    if (errors.wheelBaseModelId) setErrors(prev => ({ ...prev, wheelBaseModelId: undefined }));
                                }}
                                disabled={!formData.wheelBaseBrandId || loadingWheelBaseModels}
                                className={`w-full p-3 bg-white border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-sm disabled:bg-gray-100 ${errors.wheelBaseModelId ? 'border-red-500' : 'border-gray-200'}`}
                            >
                                <option value="">{loadingWheelBaseModels ? 'Loading models...' : !formData.wheelBaseBrandId ? 'Select brand first...' : 'Select model...'}</option>
                                {wheelBaseModels.map((model) => (
                                    <option key={model.id} value={model.id}>{model.modelName}</option>
                                ))}
                            </select>
                            {errors.wheelBaseModelId && <p className="mt-1 text-xs text-red-500">{errors.wheelBaseModelId}</p>}
                        </div>
                    </div>
                </div>

                {/* Pedals Section */}
                <div>
                    <h4 className="text-sm font-bold text-gray-700 mb-4">Pedals</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-2">BRAND</label>
                            <select
                                value={formData.pedalBrandId || ''}
                                onChange={(e) => {
                                    const brandId = e.target.value ? parseInt(e.target.value) : '';
                                    setFormData({ ...formData, pedalBrandId: brandId, pedalModelId: '' });
                                    if (errors.pedalBrandId) setErrors(prev => ({ ...prev, pedalBrandId: undefined }));
                                }}
                                disabled={loadingBrands}
                                className={`w-full p-3 bg-white border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-sm disabled:bg-gray-100 ${errors.pedalBrandId ? 'border-red-500' : 'border-gray-200'}`}
                            >
                                <option value="">{loadingBrands ? 'Loading brands...' : 'Select brand...'}</option>
                                {pedalBrands.map((brand) => (
                                    <option key={brand.id} value={brand.id}>{brand.brandName}</option>
                                ))}
                            </select>
                            {errors.pedalBrandId && <p className="mt-1 text-xs text-red-500">{errors.pedalBrandId}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-2">MODEL</label>
                            <select
                                value={formData.pedalModelId || ''}
                                onChange={(e) => {
                                    setFormData({ ...formData, pedalModelId: e.target.value ? parseInt(e.target.value) : '' });
                                    if (errors.pedalModelId) setErrors(prev => ({ ...prev, pedalModelId: undefined }));
                                }}
                                disabled={!formData.pedalBrandId || loadingPedals}
                                className={`w-full p-3 bg-white border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-sm disabled:bg-gray-100 ${errors.pedalModelId ? 'border-red-500' : 'border-gray-200'}`}
                            >
                                <option value="">{loadingPedals ? 'Loading models...' : !formData.pedalBrandId ? 'Select brand first...' : 'Select model...'}</option>
                                {pedals.map((pedal) => (
                                    <option key={pedal.id} value={pedal.id}>{pedal.modelName}</option>
                                ))}
                            </select>
                            {errors.pedalModelId && <p className="mt-1 text-xs text-red-500">{errors.pedalModelId}</p>}
                        </div>
                    </div>
                </div>

                {/* Screen Setup Section */}
                <div>
                    <h4 className="text-sm font-bold text-gray-700 mb-4">Screen Setup</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[
                            { id: 1, name: 'Single' },
                            { id: 2, name: 'Triple' },
                            { id: 3, name: 'Ultrawide' },
                            { id: 4, name: 'VR Headset' },
                        ].map((option) => (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => {
                                    setFormData({ ...formData, screenSetup: option.id });
                                    if (errors.screenSetup) setErrors(prev => ({ ...prev, screenSetup: undefined }));
                                }}
                                className={`p-4 rounded-2xl border-2 transition text-center ${formData.screenSetup === option.id
                                    ? 'border-orange-500 bg-orange-50'
                                    : 'border-gray-200 bg-gray-50 hover:border-orange-300'
                                    }`}
                            >
                                <p className="font-semibold text-gray-900 text-sm">{option.name}</p>
                            </button>
                        ))}
                    </div>
                    {errors.screenSetup && <p className="mt-2 text-xs text-red-500">{errors.screenSetup}</p>}
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