'use client'

import React, { useState } from 'react';
import Step1GeneralInfo from './forms/Step1GeneralInfo'; 
import Step2HardwareSpecs from './forms/Step2HardwareSpecs';
import Step3PhotosPricing from './forms/Step3PhotosPricing';

interface AddSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddSimulatorModal({ isOpen, onClose }: AddSimulatorModalProps) {
  //  State สำหรับเก็บว่ากำลังอยู่ขั้นตอนไหน 
  const [currentStep, setCurrentStep] = useState(1);
  
  // State สำหรับเก็บข้อมูลทั้งหมดของแบบฟอร์ม
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    platform: '',
    wheelBase: '',
    pedals: '',
    screenSetup: '',
    price: '',
    // รอรูปภาพ
  });

  //ถ้า isOpen เป็น false ให้ไม่แสดงผลอะไรเลย
  if (!isOpen) return null;

  const nextStep = () => setCurrentStep(prev => prev + 1);
 
  const backStep = () => setCurrentStep(prev => prev - 1);

  // เลือกหน้าแบบฟอร์มเพื่อแสดงผล
  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1GeneralInfo formData={formData} setFormData={setFormData} next={nextStep} onClose={onClose} />;
        return <div className="p-10 text-center">เนื้อหาแบบฟอร์มหน้า 1</div>;
      case 2:
        return <Step2HardwareSpecs formData={formData} setFormData={setFormData} next={nextStep} back={backStep} />;
        return <div className="p-10 text-center">เนื้อหาแบบฟอร์มหน้า 2 (Hardware)</div>;
      case 3:
       const handleSubmit = () => {
          alert("สร้าง Simulator ใหม่เรียบร้อยแล้ว!");
          onClose(); 
          setCurrentStep(1); // รีเซ็ตกลับไปหน้า 1
        };
        return <Step3PhotosPricing formData={formData} setFormData={setFormData} submit={handleSubmit} back={backStep} />;
    }
  };

  return (    
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      
      {/* stopPropagation เพื่อไม่ให้คลิกด้านในแล้วมันปิดตัวเอง */}
      <div className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
              
        <div className="border-b border-gray-200 py-6 px-10">
          <div className="w-full bg-gray-100 rounded-full h-2.5 flex items-center gap-1">
             <div className={`h-full rounded-full transition-all duration-300 ${currentStep >= 1 ? 'w-1/3 bg-orange-500' : 'w-0'}`}></div>
             <div className={`h-full rounded-full transition-all duration-300 ${currentStep >= 2 ? 'w-1/3 bg-orange-500' : 'w-0'}`}></div>
             <div className={`h-full rounded-full transition-all duration-300 ${currentStep >= 3 ? 'w-1/3 bg-orange-500' : 'w-0'}`}></div>
          </div>
        </div>
                
        <div className="py-8 px-10">
          {renderFormStep()}
        </div>

      </div>
    </div>
  );
}