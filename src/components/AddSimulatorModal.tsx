'use client'

import React, { useState } from 'react';
import { toast } from 'sonner';
import { axiosInstance, axiosJWTInstance } from '@/lib/http';
import Step1GeneralInfo from './forms/Step1GeneralInfo';
import Step2HardwareSpecs from './forms/Step2HardwareSpecs';
import Step3PhotosPricing from './forms/Step3PhotosPricing';
import Step4ScheduleTemplate from './forms/Step4ScheduleTemplate';

interface UploadedImage {
  file: File;
  preview: string;
  objectKey?: string;
}

interface AddSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddSimulatorModal({ isOpen, onClose, onSuccess }: AddSimulatorModalProps) {
  //  State to track current step
  const [currentStep, setCurrentStep] = useState(1);

  // State to store all form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    platform: '',
    wheelBase: '',
    pedals: '',
    screenSetup: '',
    price: '',
    simId: null as number | null,
    latitude: 13.73569,
    longitude: 100.565727,
    simtypeid: [1] as number[],
    modid: null as number | null,
    wheelBaseModelId: null as number | null,
    pedalModelId: null as number | null,
    cityId: 106448,
  });

  // Upload state
  const [uploadProgress, setUploadProgress] = useState<{ [key: number]: number }>({});

  //If isOpen is false, don't render anything
  if (!isOpen) return null;

  const nextStep = () => setCurrentStep(prev => prev + 1);

  const backStep = () => setCurrentStep(prev => prev - 1);

  // ─── Backend API Functions ───────────────────────────────────────────

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

  const finalizeSimulatorWithSchedule = async (
    uploadedImages: UploadedImage[],
    daysOfWeek: number[],
    startTime: string,
    endTime: string
  ): Promise<void> => {
    // Validation
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Price per hour is required and must be greater than 0.');
      throw new Error('Invalid price');
    }

    if (uploadedImages.length === 0) {
      toast.error('Please upload at least one image');
      throw new Error('No images');
    }

    if (daysOfWeek.length === 0) {
      toast.error('Please select at least one day');
      throw new Error('No days selected');
    }

    try {
      // Step 1: Create simulator
      const payload = {
        simlistname: formData.name,
        listdescription: formData.description,
        priceperhour: parseFloat(formData.price),
        addressdetail: formData.location || 'Not specified',
        latitude: formData.latitude || 13.73569,
        longitude: formData.longitude || 100.565727,
        simtypeid: formData.simtypeid || [1],
        modid: formData.modid || formData.wheelBaseModelId || 2,
        pedalid: formData.pedalModelId,
        platformid: formData.platform,
        screensetup: formData.screenSetup,
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

      // Step 2: Upload images to S3 and collect object keys
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

      // Step 3: Confirm simulator images (validates S3 keys and saves CDN URLs)
      if (Object.keys(imageUpdates).length > 0) {
        console.log("Confirming simulator images with keys:", imageUpdates);
        const updateResponse = await axiosJWTInstance.patch(
          `/host/simulator/${simId}/images/confirm`,
          imageUpdates
        );
        console.log("Simulator updated with images:", updateResponse.data);
        toast.success("Simulator images updated successfully!");
      }

      // Step 4: Create schedule templates
      const schedulePayload = {
        daysOfWeek,
        startTime,
        endTime,
        pricePerHour: parseFloat(formData.price),
      };

      console.log('Creating schedule templates:', schedulePayload);

      await axiosJWTInstance.post(
        `/host/simulator/${simId}/schedule-template/bulk`,
        schedulePayload
      );

      toast.success('Schedule templates created successfully! 🎉');
    } catch (error: any) {
      console.error("Error in simulator creation workflow:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to create simulator";
      toast.error(`Error: ${errorMessage}`);
      throw error;
    }
  };

  // Select form page to render
  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1GeneralInfo formData={formData} setFormData={setFormData} next={nextStep} onClose={onClose} />;
      case 2:
        return <Step2HardwareSpecs formData={formData} setFormData={setFormData} next={nextStep} back={backStep} />;
      case 3:
        return <Step3PhotosPricing
          formData={formData}
          setFormData={setFormData}
          next={nextStep}
          back={backStep}
        />;
      case 4:
        const handleScheduleSubmit = () => {
          onSuccess?.();
          onClose();
          setCurrentStep(1); // Reset back to page 1
        };
        return <Step4ScheduleTemplate
          formData={formData}
          setFormData={setFormData}
          back={backStep}
          submit={handleScheduleSubmit}
          finalizeSimulatorWithSchedule={finalizeSimulatorWithSchedule}
        />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>

      {/* stopPropagation to prevent closing when clicking inside */}
      <div className="relative bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>

        <div className="border-b border-gray-200 py-6 px-10">
          <div className="w-full bg-gray-100 rounded-full h-2.5 flex items-center gap-1">
            <div className={`h-full rounded-full transition-all duration-300 ${currentStep >= 1 ? 'flex-1 bg-orange-500' : 'flex-1'}`}></div>
            <div className={`h-full rounded-full transition-all duration-300 ${currentStep >= 2 ? 'flex-1 bg-orange-500' : 'flex-1'}`}></div>
            <div className={`h-full rounded-full transition-all duration-300 ${currentStep >= 3 ? 'flex-1 bg-orange-500' : 'flex-1'}`}></div>
            <div className={`h-full rounded-full transition-all duration-300 ${currentStep >= 4 ? 'flex-1 bg-orange-500' : 'flex-1'}`}></div>
          </div>
        </div>

        <div className="py-8 px-10">
          {renderFormStep()}
        </div>

      </div>
    </div>
  );
}