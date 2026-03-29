"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useRouter, useParams } from 'next/navigation';
import { axiosJWTInstance } from '@/lib/http';
import Link from 'next/link';
import LocationPicker from '@/components/location-picker/LocationPicker';
import ScheduleSlotManager from '@/components/host/ScheduleSlotManager';

export default function EditSimulatorPage() {
  const router = useRouter();
  const params = useParams();
  const simulatorId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState('general');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    simulatorName: '',
    description: '',
    location: '',
    latitude: 13.73569,
    longitude: 100.565727,
    countryId: '',
    stateId: '',
    cityId: '',
    price: '',
    modId: '',
    platformId: '',
    wheelBaseBrandId: '',
    wheelBaseModelId: '',
    pedalBrandId: '',
    pedalModelId: '',
    screenSetupId: '',
  });

  const [options, setOptions] = useState({
    simulatorBrands: [] as any[],
    simulatorMods: [] as any[],
    pedals: [] as any[],
  });

  const [currentSimulator, setCurrentSimulator] = useState<any>(null);
  const [uploadingImages, setUploadingImages] = useState<Record<string, boolean>>({});
  const [imageUrls, setImageUrls] = useState({
    firstImage: '',
    secondImage: '',
    thirdImage: '',
  });
  const [imageFiles, setImageFiles] = useState<Record<string, File | null>>({
    firstImage: null,
    secondImage: null,
    thirdImage: null,
  });

  const firstImageRef = React.useRef<HTMLInputElement>(null);
  const secondImageRef = React.useRef<HTMLInputElement>(null);
  const thirdImageRef = React.useRef<HTMLInputElement>(null);
  const fileInputRefs = {
    firstImage: firstImageRef,
    secondImage: secondImageRef,
    thirdImage: thirdImageRef,
  };

  const menuItems = useMemo(() => [
    { id: 'general', label: 'General Info' },
    { id: 'location', label: 'Location' },
    { id: 'photos', label: 'Photos' },
    { id: 'hardware', label: 'Hardware Space' },
    { id: 'pricing', label: 'Pricing & Availability' },
    { id: 'schedule', label: 'Manage Slots' },
  ], []);

  useEffect(() => {
    const fetchSimulatorDetails = async () => {
      if (!simulatorId || simulatorId === 'undefined') {
        setIsLoadingData(false);
        return;
      }

      try {
        const { data } = await axiosJWTInstance.get(`/simulator/${simulatorId}`);
        const sim = data.data || data;

        setCurrentSimulator(sim);
        setImageUrls({
          firstImage: sim.firstImage || '',
          secondImage: sim.secondImage || '',
          thirdImage: sim.thirdImage || '',
        });

        setFormData({
          simulatorName: sim.simListName || '',
          description: sim.listDescription || '',
          location: sim.addressDetail || '',
          latitude: typeof sim.latitude === 'number' ? sim.latitude : parseFloat(sim.latitude) || 13.73569,
          longitude: typeof sim.longitude === 'number' ? sim.longitude : parseFloat(sim.longitude) || 100.565727,
          countryId: (sim.countryId || '').toString(),
          stateId: (sim.stateId || '').toString(),
          cityId: (sim.cityId || '').toString(),
          price: (sim.pricePerHour || '').toString(),
          modId: (sim.modId || '').toString(),
          platformId: (sim.platformId || '').toString(),
          wheelBaseBrandId: (sim.mod?.brandId || '').toString(),
          wheelBaseModelId: (sim.modId || '').toString(),
          pedalBrandId: (sim.pedal?.brandId || '').toString(),
          pedalModelId: (sim.pedalId || '').toString(),
          screenSetupId: (sim.screenSetupId || '').toString(),
        });
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchSimulatorDetails();

  }, [simulatorId]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [brandsRes, modsRes, pedalsRes] = await Promise.all([
          axiosJWTInstance.get('/simulator/brands/list'),
          axiosJWTInstance.get('/simulator/models/list'),
          axiosJWTInstance.get('/simulator/pedals/list'),
        ]);
        setOptions({
          simulatorBrands: brandsRes.data || [],
          simulatorMods: modsRes.data || [],
          pedals: pedalsRes.data || [],
        });
      } catch (error) {
        console.error('Error loading options:', error);
      }
    };

    fetchOptions();
  }, [currentSimulator]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 40;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (const item of [...menuItems].reverse()) {
        const element = document.getElementById(item.id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(item.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);

  }, [menuItems]);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };


  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>, imageType: 'firstImage' | 'secondImage' | 'thirdImage') => {
    const file = e.target.files?.[0];
    if (file) {
      // Store the file in state instead of uploading immediately
      setImageFiles({ ...imageFiles, [imageType]: file });
      // Create a preview URL for the selected file
      const previewUrl = URL.createObjectURL(file);
      setImageUrls({ ...imageUrls, [imageType]: previewUrl });
    }
  };

  const uploadAllImages = async (): Promise<Record<string, string>> => {
    const uploadedFileKeys: Record<string, string> = {};
    const imagesToUpload = Object.entries(imageFiles).filter(([_, file]) => file !== null);

    for (const [imageType, file] of imagesToUpload) {
      if (!file) continue;

      try {
        setUploadingImages(prev => ({ ...prev, [imageType]: true }));

        // Validate and get content type
        const supportedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const contentType = file.type && supportedTypes.includes(file.type)
          ? file.type
          : 'image/jpeg';

        console.log(`Uploading ${imageType}:`, { fileName: file.name, fileSize: file.size, contentType });

        // Step 1: Get presigned URL from backend
        const { data: response } = await axiosJWTInstance.post(
          `/host/simulator/${simulatorId}/image-upload`,
          { contentType }
        );

        // Map backend response fields to what we need
        const presignedUrl = response.uploadUrl;
        const fileKey = response.objectKey;

        if (!presignedUrl || !fileKey) {
          throw new Error('Invalid response: missing uploadUrl or objectKey');
        }

        console.log(`Got presigned URL for ${imageType}:`, { fileKey, urlLength: presignedUrl.length });

        // Step 2: Upload file to S3 using presigned URL
        const uploadResponse = await fetch(presignedUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': contentType,
          },
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error(`S3 upload failed for ${imageType}:`, uploadResponse.status, errorText);
          throw new Error(`S3 upload failed with status ${uploadResponse.status}`);
        }

        console.log(`Successfully uploaded ${imageType} to S3`);
        uploadedFileKeys[imageType] = fileKey;
        toast.success(`${imageType} uploaded successfully!`);
      } catch (error: any) {
        console.error(`Error uploading ${imageType}:`, error);
        const errorMessage = error.response?.data?.message || error.message || `Failed to upload ${imageType}`;
        toast.error(errorMessage);
        throw error;
      } finally {
        setUploadingImages(prev => ({ ...prev, [imageType]: false }));
      }
    }

    return uploadedFileKeys;
  };

  const handleUpdate = async () => {
    if (!simulatorId || simulatorId === 'undefined') return;

    const safeSimulatorId = String(simulatorId).trim();

    const newErrors: Record<string, string> = {};
    if (!formData.simulatorName?.trim()) newErrors.simulatorName = 'Please specify simulator name';
    if (!formData.price || parseFloat(formData.price.toString()) <= 0) newErrors.price = 'Please specify correct price';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Upload all selected images to S3
      const uploadedFileKeys = await uploadAllImages();

      // Step 2: Prepare payload with image file keys
      const latValue = typeof formData.latitude === 'number' ? formData.latitude : parseFloat(String(formData.latitude)) || 13.73569;
      const longValue = typeof formData.longitude === 'number' ? formData.longitude : parseFloat(String(formData.longitude)) || 100.565727;

      const payload: Record<string, any> = {
        simlistname: formData.simulatorName?.trim(),
        listdescription: formData.description?.trim() || '',
        priceperhour: parseFloat(formData.price),
        addressdetail: formData.location?.trim() || '',
        latitude: latValue,
        longitude: longValue,
        cityId: formData.cityId ? parseInt(formData.cityId) : null,
        modId: formData.wheelBaseModelId ? parseInt(formData.wheelBaseModelId) : null,
        platformId: formData.platformId ? parseInt(formData.platformId) : null,
        pedalId: formData.pedalModelId ? parseInt(formData.pedalModelId) : null,
        screenSetupId: formData.screenSetupId ? parseInt(formData.screenSetupId) : null,
      };

      // Add uploaded image keys to payload
      if (uploadedFileKeys.firstImage) payload.firstImageKey = uploadedFileKeys.firstImage;
      if (uploadedFileKeys.secondImage) payload.secondImageKey = uploadedFileKeys.secondImage;
      if (uploadedFileKeys.thirdImage) payload.thirdImageKey = uploadedFileKeys.thirdImage;

      // Step 3: Update simulator with all data
      await axiosJWTInstance.patch(`/host/simulator/${safeSimulatorId}`, payload);

      // Clear uploaded images from state
      setImageFiles({ firstImage: null, secondImage: null, thirdImage: null });

      toast.success("Update successful! 🎉");
      router.refresh();
    } catch (error: any) {
      console.error("API Error:", error);
      const errorMessage = error.response?.data?.message || `Unable to save data. Please check Console.`;
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-xl font-semibold text-gray-600">Loading data...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row text-gray-900">


      <aside className="w-full md:w-72 border-r border-gray-200 bg-white z-50 md:fixed md:left-0 md:top-20 md:h-screen overflow-y-auto">
        <div className="p-8">
          <Link href="/hosting/simulator" className="text-sm text-gray-500 hover:text-gray-900 mb-8 flex items-center gap-2 transition font-medium">
            ← Back to Simulators
          </Link>

          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Management</h2>
          <nav className="flex flex-col gap-1.5 mb-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-left px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center justify-between ${activeSection === item.id
                  ? 'bg-orange-50 text-orange-600 font-bold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'
                  }`}
              >
                <span>{item.label}</span>
                {activeSection === item.id && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-orange-500 shadow-sm"></div>
                )}
              </button>
            ))}
          </nav>

          <div className="border-t border-gray-100 pt-6">
            {/* <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Simulator Page</h3> */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-700">Viewing Simulator</span>

              </div>
              <p className="text-xs text-gray-500 mb-4">Your listing is visible to renters in your area.</p>
              <Link href={`/product/${simulatorId}`} target='_blank' className="flex justify-center w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                Open Product Page
              </Link>
            </div>
          </div>
        </div>
      </aside>


      <main className="flex-1 p-8 md:p-12 lg:p-16 overflow-y-auto md:ml-72">
        <div className="w-full">

          <div className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight">Edit Simulator #{simulatorId}</h1>
            <p className="text-gray-500 mt-2">Update your simulator information and details</p>
          </div>

          <div className="bg-white rounded-3xl  space-y-16">


            <section id="general" className="scroll-mt-10">
              <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-gray-100 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-sm text-orange-600 font-bold">1</span>
                General Information
              </h3>
              <p className="text-gray-500 text-sm mb-6">Manage your name and description to attract professional races.</p>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Listing Name</label>
                  <input
                    type="text"
                    value={formData.simulatorName}
                    onChange={(e) => handleChange('simulatorName', e.target.value)}
                    className={`w-full p-4 bg-gray-50 border ${errors.simulatorName ? 'border-red-500' : 'border-gray-200'} rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition`}
                    placeholder="e.g. Pro Racing Rig V2"
                  />
                  {errors.simulatorName && <p className="text-red-500 text-sm mt-1.5">{errors.simulatorName}</p>}
                  <p className="text-xs text-gray-400 mt-2">Recommended: Include the wheelbrase or primary brand.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={4}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition resize-y"
                    placeholder="Describe the experience, the comfort, and the immersion levels..."
                  />
                </div>
              </div>
            </section>


            <section id="location" className="scroll-mt-10">
              <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-gray-100 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-sm text-orange-600 font-bold">2</span>
                Location
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location / Address</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="e.g. Berlin Facility - Room 302 or coordinates from map"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                  />
                </div>

                {/* Location Picker Map */}
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                  <LocationPicker
                    onLocationSelect={(location) => {
                      setFormData({
                        ...formData,
                        location: location.address || `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`,
                        latitude: location.lat,
                        longitude: location.lng,
                        cityId: location.cityId?.toString() || '',
                        stateId: location.stateId?.toString() || '',
                        countryId: location.countryId?.toString() || '',
                      });
                    }}
                    existingLat={typeof formData.latitude === 'number' ? formData.latitude : parseFloat(formData.latitude) || 13.73569}
                    existingLng={typeof formData.longitude === 'number' ? formData.longitude : parseFloat(formData.longitude) || 100.565727}
                    existingCountryId={parseInt(formData.countryId) || undefined}
                    existingStateId={parseInt(formData.stateId) || undefined}
                    existingCityId={parseInt(formData.cityId) || undefined}
                  />
                </div>
              </div>
            </section>


            <section id="photos" className="scroll-mt-10">
              <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-gray-100 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-sm text-orange-600 font-bold">3</span>
                Photos
              </h3>
              <p className="text-gray-500 text-sm mb-6">Show off your setup. Use high quality lighting. Click an image to replace it.</p>

              <div className="mb-8">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Images</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['firstImage', 'secondImage', 'thirdImage'].map((imageType, index) => (
                    <div key={imageType}>
                      <input
                        type="file"
                        ref={fileInputRefs[imageType as keyof typeof fileInputRefs]}
                        accept=".jpg, .jpeg, .png, .webp, image/jpeg, image/png, image/webp"
                        onChange={(e) => handleImageInputChange(e, imageType as 'firstImage' | 'secondImage' | 'thirdImage')}
                        className="hidden"
                      />
                      {imageUrls[imageType as keyof typeof imageUrls] ? (
                        <div
                          onClick={() => fileInputRefs[imageType as keyof typeof fileInputRefs].current?.click()}
                          className="relative w-full h-60 rounded-2xl overflow-hidden border-2 border-gray-200 bg-gray-50 cursor-pointer hover:border-orange-500 hover:shadow-lg transition group"
                        >
                          <img
                            src={imageUrls[imageType as keyof typeof imageUrls]}
                            alt={`Image ${index + 1}`}
                            className="w-full h-full object-cover group-hover:opacity-80 transition"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 transition">
                            <span className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition">Click to replace</span>
                          </div>
                          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">Image {index + 1}</div>
                        </div>
                      ) : (
                        <div
                          onClick={() => fileInputRefs[imageType as keyof typeof fileInputRefs].current?.click()}
                          className="w-full h-60 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-orange-500 cursor-pointer transition flex flex-col items-center justify-center group"
                        >
                          <svg className="w-8 h-8 text-gray-400 group-hover:text-orange-500 transition mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <p className="text-sm font-semibold text-gray-700">Image {index + 1}</p>
                          <p className="text-xs text-gray-500">Click to upload</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>


            <section id="hardware" className="scroll-mt-10">
              <h3 className="text-2xl font-bold mb-2 pb-4 border-b border-gray-100 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-sm text-orange-600 font-bold">4</span>
                Hardware Space
              </h3>
              <p className="text-gray-500 text-sm mb-6">Tell us about the equipment included in your setup.</p>

              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                    Platform
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { id: '1', name: 'PC', desc: 'Windows / Linux' },
                      { id: '2', name: 'PlayStation', desc: 'Greatfence Ready' },
                      { id: '3', name: 'Xbox Series', desc: 'Support' },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleChange('platformId', option.id)}
                        className={`p-4 rounded-2xl border-2 transition ${formData.platformId === option.id
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
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                    Wheel Base
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">BRAND</label>
                      <select
                        value={formData.wheelBaseBrandId}
                        onChange={(e) => handleChange('wheelBaseBrandId', e.target.value)}
                        className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-sm"
                      >
                        <option value="">Select brand...</option>
                        {options.simulatorBrands.map((brand: any) => (
                          <option key={brand.id} value={brand.id}>{brand.brandName}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">MODEL</label>
                      <select
                        value={formData.wheelBaseModelId}
                        onChange={(e) => handleChange('wheelBaseModelId', e.target.value)}
                        className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-sm"
                      >
                        <option value="">Select model...</option>
                        {options.simulatorMods
                          .filter((mod: any) => mod.brandId === parseInt(formData.wheelBaseBrandId))
                          .map((mod: any) => (
                            <option key={mod.id} value={mod.id}>{mod.modelName}</option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                    Pedals
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">BRAND</label>
                      <select
                        value={formData.pedalBrandId}
                        onChange={(e) => handleChange('pedalBrandId', e.target.value)}
                        className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-sm"
                      >
                        <option value="">Select brand...</option>
                        {options.simulatorBrands.map((brand: any) => (
                          <option key={brand.id} value={brand.id}>{brand.brandName}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">MODEL</label>
                      <select
                        value={formData.pedalModelId}
                        onChange={(e) => handleChange('pedalModelId', e.target.value)}
                        className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-sm"
                      >
                        <option value="">Select model...</option>
                        {options.pedals
                          .filter((pedal: any) => pedal.brandId === parseInt(formData.pedalBrandId))
                          .map((pedal: any) => (
                            <option key={pedal.id} value={pedal.id}>{pedal.modelName}</option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                    Screen Setup
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      { id: '1', name: 'Single' },
                      { id: '2', name: 'Triple' },
                      { id: '3', name: 'Ultrawide' },
                      { id: '4', name: 'VR Headset' },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleChange('screenSetupId', option.id)}
                        className={`p-4 rounded-2xl border-2 transition text-center ${formData.screenSetupId === option.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 bg-gray-50 hover:border-orange-300'
                          }`}
                      >
                        <p className="font-semibold text-gray-900 text-sm">{option.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>


            <section id="pricing" className="scroll-mt-10">
              <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-gray-100 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-sm text-orange-600 font-bold">5</span>
                Pricing & Availability
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price Per Hour (THB)</label>
                  <div className="relative max-w-sm">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-lg">฿</span>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleChange('price', e.target.value)}
                      className={`w-full pl-12 p-4 text-lg bg-gray-50 border ${errors.price ? 'border-red-500' : 'border-gray-200'} rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition font-semibold`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.price && <p className="text-red-500 text-sm mt-1.5">{errors.price}</p>}
                </div>

              </div>
            </section>

            <section id="schedule" className="scroll-mt-10">
              <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-gray-100 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-sm text-orange-600 font-bold">6</span>
                Manage Schedule Slots
              </h3>
              <p className="text-gray-500 text-sm mb-6">Edit individual time slots, adjust prices, and control availability for specific dates.</p>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" style={{ height: '600px' }}>
                {simulatorId && currentSimulator && (
                  <ScheduleSlotManager simulatorId={parseInt(simulatorId as string)} />
                )}
              </div>
            </section>

          </div>


          <div className="mt-8 flex justify-end gap-3 pb-20 md:pb-0">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3.5 rounded-lg text-sm font-bold text-gray-700 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition"
            >
              Discard
            </button>
            <button
              onClick={handleUpdate}
              disabled={isSubmitting}
              className={`px-10 py-3.5 rounded-lg text-sm font-bold text-white transition ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 border-2 border-orange-500'
                }`}
            >
              {isSubmitting ? 'Saving...' : 'Save & Exit'}
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}