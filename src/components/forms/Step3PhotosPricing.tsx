"use client";
import React, { useState } from 'react';

export default function Step3PricingAndPhotos({ formData, setFormData, prevStep, submit }: any) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePublish = async () => {
        setIsSubmitting(true);
        
        const payload = {
            // ข้อมูลจาก Form (Step 1 & 3)
            simlistname: formData.simulatorName || 'New Simulator', 
            listdescription: formData.description || 'ไม่มีรายละเอียด', 
            priceperhour: parseFloat(formData.price) || 0, 
            addressdetail: formData.location || 'ไม่ได้ระบุ', 
                       
            latitude: 13.73569,   // มั่วพิกัดไปก่อน
            longitude: 100.565727, 
            
            //เพิ่ม simtypeid ที่ขาดไป (Backend บังคับว่าเป็น Array ของตัวเลข)
            simtypeid: [1], // สมมติรหัสประเภทเครื่องคือ 1            
            modid: 2,       // สมมติรหัสรุ่นเครื่องคือ 2           
            cityId: 106448, // รหัสเมือง 
        };

        console.log("กำลังส่งข้อมูลไป API:", payload);

        try {            
            const response = await fetch('http://localhost:3000/host/simulator', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',                    
                },
                // สั่งให้ fetch แนบ Cookie/Session ไปด้วยเพื่อให้ผ่านการตรวจ Login
                credentials: 'include', 
                body: JSON.stringify(payload), // แปลงก้อนข้อมูลเป็น JSON string
            });

            // ตรวจสอบว่า Backend ตอบกลับมาเป็น JSON ไหม
            const contentType = response.headers.get("content-type");
            let responseData;
            if (contentType && contentType.indexOf("application/json") !== -1) {
                responseData = await response.json();
            } else {
                responseData = await response.text(); // กรณีหลังบ้านไม่ตอบกลับเป็น JSON
            }

            if (response.ok) {
                // ข้อมูลเข้า Databaseแล้ว
                console.log("บันทึกข้อมูลสำเร็จ:", responseData);
                alert("บันทึกข้อมูลลง Database สำเร็จแล้ว! 🎉");
                
                // สั่งปิด Popup และรีเฟรชหน้าหลัก 
                if (submit) {
                    submit(); 
                }
            } else {
                // ล้มเหลว (เช่น ข้อมูลไม่ครบ, Error จาก Data Validation)
                console.error("เซิร์ฟเวอร์ตอบกลับ Error:", responseData);
                // พยายามโชว์ข้อความ Error ให้ละเอียดที่สุด
                const errorMessage = typeof responseData === 'object' 
                    ? JSON.stringify(responseData.message || responseData, null, 2)
                    : responseData;
                alert(`เกิดข้อผิดพลาดจากหลังบ้าน:\n${errorMessage}`);
            }

        } catch (error) {
            // เชื่อมต่อไม่ได้ (Backend ปิดอยู่, พอร์ตผิด)
            console.error("เกิดข้อผิดพลาดในการเชื่อมต่อ API:", error);
            alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์หลังบ้านได้ กรุณาตรวจสอบว่า Backend ทำงานอยู่หรือไม่");
        } finally {
            // ไม่ว่าจะสำเร็จหรือล้มเหลว ให้ปิดสถานะ Loading ของปุ่ม
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-2">
            <h2 className="text-2xl font-bold mb-6">Step 3: Photos & Pricing</h2>
            
            {/* กล่องจำลองอัปโหลดรูปภาพ */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Photo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition">
                    <span className="text-3xl mb-2">📷</span>
                    <p>Click to upload or drag and drop</p>
                    <p className="text-xs mt-1">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                </div>
            </div>

            {/* ช่องกรอกราคา */}
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
                    className={`px-6 py-2 rounded-lg text-white font-medium transition ${
                        isSubmitting ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'
                    }`}
                >
                    {isSubmitting ? 'Publishing...' : 'Finish & Publish'}
                </button>
            </div>
        </div>
    );
}