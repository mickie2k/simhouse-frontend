"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditSimulatorPage() {
  const router = useRouter();
  const params = useParams(); 
  const simulatorId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState('general');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  const cleanBaseUrl = API_BASE_URL.replace(/\/$/, '');
  
  const [formData, setFormData] = useState({
    simulatorName: '',
    description: '',
    location: '',
    price: '',
    platform: '',
    wheelBase: '',
    pedals: '',
    screenSetup: '',
  });

  const menuItems = [
    { id: 'general', label: 'General Information' },
    { id: 'hardware', label: 'Hardware Specifications' },
    { id: 'pricing', label: 'Pricing & Photos' },
  ];
 
  useEffect(() => {
    const fetchSimulatorDetails = async () => {
      if (!simulatorId || simulatorId === 'undefined') {
        setIsLoadingData(false);
        return;
      }

      try {
        const token = localStorage.getItem('host_token') || localStorage.getItem('token');
        const response = await fetch(`${cleanBaseUrl}/simulator/${simulatorId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        });

        if (response.ok) {
          const data = await response.json();
          const sim = data.data || data; 
          
          setFormData({
            simulatorName: sim.SimListName || sim.simListName || sim.simlistname || '',
            description: sim.ListDescription || sim.listDescription || sim.listdescription || '',
            location: sim.AddressDetail || sim.addressDetail || sim.addressdetail || '',
            price: (sim.PricePerHour || sim.pricePerHour || sim.priceperhour || '').toString(),            
            platform: sim.Platform || sim.platform || '',
            wheelBase: sim.WheelBase || sim.wheelBase || '',
            pedals: sim.Pedals || sim.pedals || '',
            screenSetup: sim.ScreenSetup || sim.screenSetup || '',
          });
        } else {
          console.error("ดึงข้อมูลไม่สำเร็จ");
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการโหลดข้อมูล:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchSimulatorDetails();
  
  }, [simulatorId]);

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
 
  }, [isLoadingData]);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

 
  const handleUpdate = async () => {
    if (!simulatorId || simulatorId === 'undefined') return;

    const safeSimulatorId = String(simulatorId).trim();

    const newErrors: Record<string, string> = {};
    if (!formData.simulatorName?.trim()) newErrors.simulatorName = 'กรุณาระบุชื่อ Simulator';
    if (!formData.price || parseFloat(formData.price.toString()) <= 0) newErrors.price = 'กรุณาระบุราคาที่ถูกต้อง';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return; 
    }

    setIsSubmitting(true);
    

    const payload = {
        SimListName: formData.simulatorName?.trim(), 
        ListDescription: formData.description?.trim() || '', 
        PricePerHour: formData.price.toString(), 
        AddressDetail: formData.location?.trim() || '',
        Platform: formData.platform,
        WheelBase: formData.wheelBase?.trim() || '',
        Pedals: formData.pedals?.trim() || '',
        ScreenSetup: formData.screenSetup,
    };

    try {
        const token = localStorage.getItem('host_token') || localStorage.getItem('token');
        const response = await fetch(`${cleanBaseUrl}/host/simulator/${safeSimulatorId}`, { 
            method: 'PATCH',
            headers: { 
              'Content-Type': 'application/json',
              ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            alert("อัปเดตข้อมูลเรียบร้อยแล้ว! 🎉");
            router.refresh(); 
        } else {
            const errText = await response.text();
            console.error("Backend Error:", errText);
            alert(`ไม่สามารถบันทึกข้อมูลได้ (${response.status}) ลองเช็คที่ Console ดูครับ`);
        }
    } catch (error) {
        console.error("API Error:", error);
        alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <span className="text-xl font-semibold text-gray-600">กำลังโหลดข้อมูล...</span>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-gray-900">
      
     
      <aside className="w-full md:w-72 border-r border-gray-200 bg-white z-10 md:sticky md:top-0 md:h-screen overflow-y-auto">
        <div className="p-8">
            <button onClick={() => router.push('/hosting')} className="text-sm text-gray-500 hover:text-black mb-8 flex items-center gap-2 transition font-medium">
                ← Back to Simulators
            </button>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Edit Settings</h2>
            <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
                <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between ${
                    activeSection === item.id 
                    ? 'bg-gray-100 text-black font-bold' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'
                }`}
                >
                {item.label}
                {activeSection === item.id && (
                    <div className="w-2 h-2 rounded-full bg-black shadow-sm"></div>
                )}
                </button>
            ))}
            </nav>
        </div>
      </aside>

    
      <main className="flex-1 p-8 md:p-12 lg:p-16 overflow-y-auto">
        <div className="max-w-3xl">
          
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight">Edit Simulator #{simulatorId}</h1>
            <p className="text-gray-500 mt-2">อัปเดตข้อมูลและรายละเอียดเครื่องจำลองของคุณ</p>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-200 shadow-sm space-y-16">
            
           
            <section id="general" className="scroll-mt-10">
              <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-gray-100 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">1</span>
                General Information
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Simulator Name</label>
                  <input 
                    type="text" 
                    value={formData.simulatorName}
                    onChange={(e) => handleChange('simulatorName', e.target.value)}
                    className={`w-full p-4 bg-gray-50 border ${errors.simulatorName ? 'border-red-500' : 'border-gray-200'} rounded-2xl focus:ring-2 focus:ring-black focus:border-black outline-none transition`}
                    placeholder="เช่น Pro Racing Rig V2"
                  />
                  {errors.simulatorName && <p className="text-red-500 text-sm mt-1.5">{errors.simulatorName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={4}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black focus:border-black outline-none transition resize-y"
                    placeholder="อธิบายรายละเอียดของ Simulator..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location / Address</label>
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                    placeholder="สถานที่ตั้ง เช่น สุขุมวิท 71..."
                  />
                </div>
              </div>
            </section>

            
            <section id="hardware" className="scroll-mt-10">
              <h3 className="text-2xl font-bold mb-2 pb-4 border-b border-gray-100 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">2</span>
                Hardware Details
              </h3>
              <p className="text-gray-500 text-sm mb-6">Tell us about the equipment included in your setup.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Platform</label>
                  <select 
                    value={formData.platform}
                    onChange={(e) => handleChange('platform', e.target.value)}
                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition appearance-none"
                  >
                    <option value="" disabled>Select platform...</option>
                    <option value="PC">PC</option>
                    <option value="PlayStation 5">PlayStation 5</option>
                    <option value="Xbox Series X/S">Xbox Series X/S</option>
                  </select>
                </div>

               
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Wheel Base</label>
                  <input 
                    type="text" 
                    value={formData.wheelBase}
                    onChange={(e) => handleChange('wheelBase', e.target.value)}
                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                    placeholder="e.g., Fanatec DD Pro (8Nm)"
                  />
                </div>

               
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Pedals</label>
                  <input 
                    type="text" 
                    value={formData.pedals}
                    onChange={(e) => handleChange('pedals', e.target.value)}
                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                    placeholder="e.g., Heusinkveld Sprint"
                  />
                </div>

               
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Screen Setup</label>
                  <select 
                    value={formData.screenSetup}
                    onChange={(e) => handleChange('screenSetup', e.target.value)}
                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition appearance-none"
                  >
                    <option value="" disabled>Select screen setup...</option>
                    <option value="Single Monitor">Single Monitor</option>
                    <option value="Triple Monitors">Triple Monitors</option>
                    <option value="VR Headset">VR Headset</option>
                  </select>
                </div>
              </div>
            </section>

            
            <section id="pricing" className="scroll-mt-10">
              <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-gray-100 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">3</span>
                Pricing
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
                      className={`w-full pl-12 p-4 text-lg bg-gray-50 border ${errors.price ? 'border-red-500' : 'border-gray-200'} rounded-2xl focus:ring-2 focus:ring-black focus:border-black outline-none transition font-semibold`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.price && <p className="text-red-500 text-sm mt-1.5">{errors.price}</p>}
                </div>
              </div>
            </section>

          </div>

         
          <div className="mt-8 flex justify-end gap-3 pb-20 md:pb-0">
            <button 
              onClick={() => router.push('/hosting')} 
              className="px-6 py-3.5 rounded-2xl text-sm font-bold text-gray-600 hover:bg-white hover:text-gray-900 transition shadow-sm border border-transparent hover:border-gray-200"
            >
                Cancel
            </button>
            <button 
              onClick={handleUpdate} 
              disabled={isSubmitting}
              className={`px-10 py-3.5 rounded-2xl text-sm font-bold text-white transition-all shadow-lg ${
                  isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800 hover:-translate-y-1 hover:shadow-xl'
              }`}
            >
                {isSubmitting ? 'Saving...' : 'Save Changes'} 
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}