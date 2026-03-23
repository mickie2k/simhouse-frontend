"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa';
import AddSimulatorModal from '@/components/AddSimulatorModal'; 

export default function MySimulatorsPage() {
    const [simulators, setSimulators] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

    const fetchSimulators = async () => {
        setIsLoading(true);
        try {
            const cleanBaseUrl = API_BASE_URL.replace(/\/$/, '');
            const token = localStorage.getItem('host_token') || localStorage.getItem('token'); 

            const response = await fetch(`${cleanBaseUrl}/simulator`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            });

            if (!response.ok) {
                console.error("API Error Response:", await response.text());
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            const fetchedSimulators = Array.isArray(data) ? data : data.data || [];
            setSimulators(fetchedSimulators);

        } catch (error) {
            console.error('Failed to fetch simulators:', error);
            setSimulators([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSimulators();
    }, []);

    const refreshData = () => {
        fetchSimulators();
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 relative">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Simulators</h1>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-[320px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                        <span className="ml-4 text-gray-500 font-medium">กำลังโหลดข้อมูล...</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div 
                            onClick={() => setIsModalOpen(true)}
                            className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col justify-center items-center h-[320px] hover:bg-gray-100 hover:border-gray-400 transition cursor-pointer bg-white group"
                        >
                            <div className="text-5xl text-gray-300 group-hover:text-gray-500 mb-4 transition">+</div>
                            <h3 className="font-bold text-lg text-gray-700 group-hover:text-gray-900 transition">Add New Simulator</h3>
                            <p className="text-gray-400 text-sm text-center px-6 mt-2">List a new simulator to earn more.</p>
                        </div>

                        {simulators.map((sim, index) => {                           
                            const simId = sim.SimID || sim.simid || sim.simId || sim.id;

                            return (
                                <Link 
                                    href={`/hosting/simulator/${simId}/edit`} 
                                    key={simId || index} 
                                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col h-[320px] cursor-pointer"
                                >
                                    <div className="h-44 bg-gray-200 relative flex justify-center items-center text-gray-400 text-sm overflow-hidden">
                                        {sim.firstimage || sim.firstImage ? (
                                            <img src={sim.firstimage || sim.firstImage} alt={sim.SimListName || sim.simListName} className="w-full h-full object-cover" />
                                        ) : (
                                            "[ ภาพ Simulator ]"
                                        )}
                                    </div>
                                    <div className="p-5 flex flex-col flex-grow justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                                                    {sim.SimListName || sim.simListName || 'No Name'}
                                                </h3>
                                                <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                                                    <FaStar className="text-yellow-400" /> {sim.AverageRating || sim.rating || "5.0"}
                                                </div>
                                            </div>                                        
                                            <p className="text-gray-500 text-sm line-clamp-2">
                                                {sim.ListDescription || sim.listDescription || sim.ListDescripion || sim.description || 'ไม่มีคำอธิบาย'}
                                            </p>
                                        </div>
                                        <div className="mt-4 font-bold text-lg text-gray-900">
                                            ฿{sim.PricePerHour || sim.pricePerHour || sim.priceperhour || 0} <span className="text-sm font-normal text-gray-500">/hr</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </main>

            {isModalOpen && (
                <AddSimulatorModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    onSuccess={() => {
                        setIsModalOpen(false);
                        refreshData(); 
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 3000); 
                    }}
                />
            )}

            {showToast && (
                <div className="fixed bottom-10 right-10 bg-gray-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-fade-in-up">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex justify-center items-center text-white text-sm font-bold">✓</div>
                    <span className="font-medium">เพิ่ม Simulator สำเร็จ!</span>
                </div>
            )}
        </div>
    );
}