"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import { axiosJWTInstance } from '@/lib/http';

export default function SimulatorDetailPage() {
  const params = useParams();
  const [simulator, setSimulator] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // สร้าง State สำหรับจัดการสถานะการจองและการโหลดปุ่ม
  const [bookingStatus, setBookingStatus] = useState<'pending' | 'completed'>('pending');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchSimulatorDetail = async () => {
      if (!params?.id) return;
      setIsLoading(true);
      try {
        const { data } = await axiosJWTInstance.get('/simulator');
        const allSimulators = Array.isArray(data) ? data : data.data || [];
        const found = allSimulators.find((sim: any) => sim.id?.toString() === params.id);
        setSimulator(found);
      } catch (error) {
        console.error('Failed to fetch simulator details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSimulatorDetail();
  }, [params]);

  // ฟังก์ชันกดยืนยันการจองและบันทึกลง Database
  const handleConfirmReservation = async () => {
    setIsUpdating(true); // ปรับปุ่มเป็นสถานะโหลด
    try {
      // จำลองการดีเลย์โหลด API 1 วินาที 
      await new Promise(resolve => setTimeout(resolve, 1000));

      //  UI สำเร็จเปลี่ยนเป็นสถานะ completed
      setBookingStatus('completed');

    } catch (error) {
      console.error("Error confirming reservation:", error);
      toast.error("Error confirming reservation. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center gap-3 text-xl font-bold text-gray-700">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        Loading data...
      </div>
    );
  }

  if (!simulator) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-4 bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800">Simulator data not found</h1>
        <Link href="/hosting" className="text-orange-600 hover:underline font-medium">Back to My Simulators</Link>
      </div>
    );
  }

  const simName = simulator.simListName;
  const simDesc = simulator.listDescription || simulator.description;
  const simPrice = simulator.pricePerHour || 0;
  const simImage = simulator.firstImage;

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col">
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">

        {/* ปรับแถบแจ้งเตือนด้านบนตามสถานะการจอง */}
        {bookingStatus === 'pending' ? (
          <div className="flex items-center gap-3 mb-8 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
            <h1 className="text-xl font-bold text-yellow-800">This reservation is waiting for your confirmation.</h1>
          </div>
        ) : (
          <div className="flex items-center gap-3 mb-8 bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <h1 className="text-xl font-bold text-green-800">Reservation Confirmed Successfully!</h1>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-[60%]">
            <div className="w-full h-[400px] bg-gray-200 rounded-2xl mb-6 flex justify-center items-center text-gray-400 overflow-hidden relative shadow-sm">
              {simImage ? (
                <img src={simImage} alt={simName} className="w-full h-full object-cover" />
              ) : (
                <span>[ ภาพจำลองของ {simName} ]</span>
              )}
            </div>
            <h2 className="text-3xl font-bold mb-4">{simName}</h2>
            <p className="text-gray-600 font-medium text-lg leading-relaxed whitespace-pre-wrap">
              {simDesc || 'ไม่มีคำอธิบาย'}
            </p>
          </div>

          <div className="lg:w-[40%]">
            <div className="border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3">Customer Information</h3>
                <p className="text-gray-600 text-sm mb-1">Name: Tanakorn Pookongmek</p>
                <p className="text-gray-600 text-sm">Tel: 091-1234-4567</p>
              </div>
              <hr className="my-6 border-gray-200" />
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3">Date/Time</h3>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Tuesday</span>
                  <span className="text-gray-900 font-medium">9:30-10:30</span>
                </div>
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-gray-600">Aug 12, 2026</span>
                  <span className="text-gray-900 font-medium flex flex-col items-end gap-1">
                    <span>10:30-11:30</span>
                    <span>13:30-14:30</span>
                  </span>
                </div>
              </div>
              <hr className="my-6 border-gray-200" />
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-3">Amount</h3>
                <div className="flex justify-between text-sm font-medium items-center">
                  <span className="text-gray-600">฿{simPrice} x 3 hrs</span>
                  <span className="text-2xl font-bold text-orange-600">฿{(simPrice * 3).toLocaleString()}</span>
                </div>
              </div>

              {/* เปลี่ยนปุ่มตามสถานะการจอง */}
              <div className="flex flex-col gap-3">
                {bookingStatus === 'pending' ? (
                  <>
                    <button
                      onClick={handleConfirmReservation}
                      disabled={isUpdating}
                      className="w-full bg-[#ff5a5f] hover:bg-[#e04e53] text-white rounded-lg py-3 font-semibold transition shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                      {isUpdating ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Confirming...
                        </>
                      ) : (
                        'Confirm Reservation'
                      )}
                    </button>
                    <button
                      disabled={isUpdating}
                      className="w-full border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-800 rounded-lg py-3 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel Reservation
                    </button>
                  </>
                ) : (
                  <button className="w-full bg-green-500 text-white rounded-lg py-3 font-semibold shadow-sm cursor-default flex justify-center items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Completed Reservation
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#f7f7f7] border-t border-gray-200 py-10 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-300 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p>© Simhouse. · Privacy · Terms · Sitemap</p>
          </div>
        </div>
      </footer>
    </div>
  );
}