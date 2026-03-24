'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { axiosJWTInstance } from '@/lib/http';
import { toast } from 'sonner';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import { MdCancel, MdPending } from 'react-icons/md';
import Image from 'next/image';
import { FaUserCircle } from 'react-icons/fa';
import Link from 'next/link';

interface Schedule {
    date: string;
    startTime: string;
    endTime: string;
}

interface Customer {
    id: number;
    username: string;
    email: string;
}

interface Simulator {
    id: number;
    simListName: string;
    pricePerHour: number;
    firstImage: string;
    addressDetail: string;
    latitude: number;
    longitude: number;
}

interface BookingStatus {
    id: number;
    statusName: string;
}

interface HostBookingDetail {
    id: number;
    bookingDate: string;
    totalPrice: string;
    statusId: number;
    customerId: number;
    simId: number;
    bookingStatus: BookingStatus;
    customer: Customer;
    simulator: Simulator;
}

export default function HostBookingDetailPage() {
    const params = useParams();
    const bookingId = params.id as string;

    const [booking, setBooking] = useState<HostBookingDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isConfirming, setIsConfirming] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false);

    useEffect(() => {
        const fetchBookingDetail = async () => {
            try {
                setIsLoading(true);
                const { data: allBookings } = await axiosJWTInstance.get<HostBookingDetail[]>('/host/booking');
                const foundBooking = (Array.isArray(allBookings) ? allBookings : allBookings.data || []).find(
                    (b) => b.id.toString() === bookingId
                );

                if (!foundBooking) {
                    toast.error('Booking not found');
                    setBooking(null);
                } else {
                    setBooking(foundBooking);
                }
            } catch (error) {
                console.error('Failed to fetch booking details:', error);
                toast.error('Failed to load booking details');
            } finally {
                setIsLoading(false);
            }
        };

        if (bookingId) {
            fetchBookingDetail();
        }
    }, [bookingId]);

    const handleConfirmBooking = async () => {
        if (!booking) return;
        setIsConfirming(true);
        try {
            await axiosJWTInstance.patch(`/host/booking/${booking.id}`, { statusId: 2 });
            toast.success('Booking confirmed! ✅');
            setBooking({ ...booking, statusId: 2, bookingStatus: { id: 2, statusName: 'CONFIRM' } });
        } catch (error: any) {
            console.error('Failed to confirm booking:', error);
            toast.error(error.response?.data?.message || 'Failed to confirm booking');
        } finally {
            setIsConfirming(false);
        }
    };

    const handleCancelBooking = async () => {
        if (!booking) return;
        setIsCanceling(true);
        try {
            await axiosJWTInstance.patch(`/host/booking/${booking.id}`, { statusId: 0 });
            toast.success('Booking canceled ✅');
            setBooking({ ...booking, statusId: 0, bookingStatus: { id: 0, statusName: 'CANCELED' } });
        } catch (error: any) {
            console.error('Failed to cancel booking:', error);
            toast.error(error.response?.data?.message || 'Failed to cancel booking');
        } finally {
            setIsCanceling(false);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto my-6">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="max-w-6xl mx-auto my-6">
                <div className="text-center">
                    <p className="text-gray-600 text-lg mb-4">Booking not found</p>
                    <Link href="/hosting/bookings" className="text-orange-600 underline">
                        Back to Bookings
                    </Link>
                </div>
            </div>
        );
    }

    const formattedTel = booking.customer.email;
    const bookingDate = new Date(booking.bookingDate);
    const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = bookingDate.getDay();
    const dateStr = bookingDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    const getStatusIndicator = () => {
        const status = booking.bookingStatus.statusName.toUpperCase();
        if (status === 'PENDING') {
            return (
                <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <MdPending className="text-yellow-500 text-xl" />
                    <span className="text-yellow-800 font-medium">This reservation is waiting for your confirmation.</span>
                </div>
            );
        } else if (status === 'CONFIRM' || status === 'CONFIRMED') {
            return (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <IoIosCheckmarkCircle className="text-green-500 text-xl" />
                    <span className="text-green-800 font-medium">This reservation is confirmed.</span>
                </div>
            );
        } else if (status === 'CANCELED' || status === 'CANCELLED') {
            return (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <MdCancel className="text-red-500 text-xl" />
                    <span className="text-red-800 font-medium">This reservation is canceled.</span>
                </div>
            );
        }
    };

    return (
        <div className="max-w-6xl mx-auto my-6">
            <div className="py-2">
                {getStatusIndicator()}

                <div className="grid grid-cols-3 gap-x-20 gap-y-8 mt-10">
                    {/* Left Column - Simulator Image and Host Info */}
                    <div className="flex flex-col gap-6 col-span-2 overflow-hidden">
                        <Image
                            src={booking.simulator.firstImage || '/noimage.webp'}
                            width={500}
                            height={400}
                            alt={booking.simulator.simListName}
                            className="w-full object-cover rounded-2xl"
                        />

                        {/* Simulator and Customer Info */}
                        <div className="flex flex-row justify-start gap-4">
                            <div className="mr-auto">
                                <h1 className="text-xl font-medium">{booking.simulator.simListName}</h1>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${booking.simulator.latitude}%2C${booking.simulator.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex gap-1 text-blue-600 underline text-sm mt-1"
                                >
                                    View on Maps →
                                </a>
                            </div>
                            <div>
                                <FaUserCircle size={48} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h1 className="text-base font-normal flex gap-2 items-start leading-5">
                                    Customer: {booking.customer.username}
                                </h1>
                                <p className="text-sm text-gray-500 font-light">
                                    Email: {booking.customer.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Booking Details */}
                    <div className="flex flex-col gap-6">
                        {/* Address */}
                        <div className="flex flex-col gap-2">
                            <h1 className="text-xl font-medium">Address</h1>
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${booking.simulator.latitude}%2C${booking.simulator.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-base font-base underline text-blue-600"
                            >
                                {booking.simulator.addressDetail}
                            </a>
                        </div>

                        <hr />

                        {/* Date/Time */}
                        <div className="flex flex-col gap-2">
                            <h1 className="text-xl font-medium">Date/Time</h1>
                            <div className="flex-row flex justify-between">
                                <div className="text-base font-light h-full flex flex-col">
                                    <p>{weekday[day]}</p>
                                    <p>{dateStr}</p>
                                    <p className="mt-auto text-xs text-gray-500 pb-1">
                                        Please ensure simulator is ready 10 minutes before.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <hr />

                        {/* Amount */}
                        <div className="flex flex-col gap-2">
                            <h1 className="text-xl font-medium">Amount</h1>
                            <div className="flex-row flex text-base justify-between">
                                <ul className="text-left font-light w-1/2">
                                    <li>${booking.simulator.pricePerHour}/hour</li>
                                </ul>
                                <ul className="text-right font-light w-1/2">
                                    <li>${booking.totalPrice}</li>
                                </ul>
                            </div>
                        </div>

                        <hr />

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3">
                            {booking.statusId === 1 || booking.bookingStatus.statusName.toUpperCase() === 'PENDING' ? (
                                <>
                                    <button
                                        onClick={handleConfirmBooking}
                                        disabled={isConfirming}
                                        className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition"
                                    >
                                        {isConfirming ? 'Confirming...' : 'Confirm Reservation'}
                                    </button>
                                    <button
                                        onClick={handleCancelBooking}
                                        disabled={isCanceling}
                                        className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 hover:text-gray-900 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed font-medium py-2 px-4 rounded-lg transition text-sm"
                                    >
                                        {isCanceling ? 'Canceling...' : 'Cancel Reservation'}
                                    </button>
                                </>
                            ) : booking.statusId === 2 || booking.bookingStatus.statusName.toUpperCase() === 'CONFIRM' ? (
                                <>
                                    <button disabled className="w-full bg-green-100 border border-green-300 text-green-700 font-semibold py-3 px-4 rounded-lg cursor-default">
                                        ✓ Confirmed
                                    </button>
                                    <button
                                        onClick={handleCancelBooking}
                                        disabled={isCanceling}
                                        className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 hover:text-gray-900 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed font-medium py-2 px-4 rounded-lg transition text-sm"
                                    >
                                        {isCanceling ? 'Canceling...' : 'Cancel Reservation'}
                                    </button>
                                </>
                            ) : (
                                <button disabled className="w-full bg-gray-100 border border-gray-200 text-gray-500 font-medium py-3 px-4 rounded-lg cursor-not-allowed">
                                    Canceled
                                </button>
                            )}
                        </div>

                        <hr />

                        {/* Back Link */}
                        <div className="text-center">
                            <Link href="/hosting/bookings" className="text-orange-600 hover:text-orange-700 text-sm font-medium underline">
                                ← Back to Bookings
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
