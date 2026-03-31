'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { axiosJWTInstance } from '@/lib/http';

interface Customer {
  id: number;
  username: string;
  email: string;
  ProfileImageUrl?: string;
}

interface Simulator {
  id: number;
  simListName: string;
}

interface BookingStatus {
  id: number;
  statusName: string;
}

interface ScheduleSlot {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  price: string;
}

interface BookingListItem {
  scheduleId: number;
  schedule: ScheduleSlot;
}

interface BookingResponse {
  id: number;
  bookingDate: string;
  totalPrice: string;
  statusId: number;
  customerId: number;
  simId: number;
  bookingStatus: BookingStatus;
  customer: Customer;
  simulator: Simulator;
  bookingList: BookingListItem[];
}

interface BookingTableData {
  id: number;
  simId: number;
  customer: string;
  sim: string;
  schedule: string;
  duration: string;
  price: number;
  status: string;
}

interface OverviewData {
  pendingRequests: number;
  newRequests: number;
  todayBookings: number;
  monthlyRevenue: number;
  rating: number;
  totalReviews: number;
}

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((segment) => segment[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return initials || '?';
}

export default function BookingsManagementPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState<BookingTableData[]>([]);
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch overview data
        const overviewResponse = await axiosJWTInstance.get<OverviewData>('/host/overview');
        if (overviewResponse.status === 200) {
          setOverview(overviewResponse.data);
        }

        // Fetch bookings data
        const response = await axiosJWTInstance.get<BookingResponse[]>('/host/booking');

        if (response.status !== 200) {
          throw new Error(`Failed to fetch bookings: ${response.statusText}`);
        }
        const { data } = response;

        console.log('Raw booking data:', data);
        const allRawBookings = Array.isArray(data) ? data : (data as any).data || [];

        const formattedData: BookingTableData[] = (allRawBookings as BookingResponse[]).map((raw) => ({
          id: raw.id,
          simId: raw.simId,
          customer: raw.customer?.username || 'Unknown',
          sim: raw.simulator?.simListName || 'Unknown Sim',
          schedule: (() => {
            const firstSlot = raw.bookingList?.[0]?.schedule;
            if (firstSlot) {
              const date = new Date(firstSlot.date);
              const startTime = new Date(firstSlot.startTime);
              date.setHours(startTime.getUTCHours(), startTime.getUTCMinutes());
              return date.toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
              });
            }
            return new Date(raw.bookingDate).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });
          })(),
          duration: (() => {
            if (!raw.bookingList?.length) return 'N/A';
            const totalMinutes = raw.bookingList.reduce((sum, item) => {
              const start = new Date(item.schedule.startTime);
              const end = new Date(item.schedule.endTime);
              return sum + (end.getUTCHours() * 60 + end.getUTCMinutes()) - (start.getUTCHours() * 60 + start.getUTCMinutes());
            }, 0);
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            return hours > 0 && minutes > 0
              ? `${hours}h ${minutes}m`
              : hours > 0 ? `${hours}h` : `${minutes}m`;
          })(),
          price: parseFloat(raw.totalPrice) || 0,
          status: raw.bookingStatus?.statusName || 'PENDING'
        }));

        formattedData.sort((a, b) => new Date(b.schedule).getTime() - new Date(a.schedule).getTime());
        setBookings(formattedData);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusUpper = status.toUpperCase();
    switch (statusUpper) {
      case 'PENDING':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Pending</span>;
      case 'CONFIRM':
      case 'CONFIRMED':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Confirmed</span>;
      case 'COMPLETED':
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Completed</span>;
      case 'CANCELED':
      case 'CANCELLED':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Canceled</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  return (
    <div className="h-full bg-white text-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 ">
            <p className="text-sm text-gray-500 font-medium mb-2">Pending Requests</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold">{overview?.pendingRequests ?? 0}</span>
              {overview && overview.newRequests > 0 && (
                <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-0.5 rounded mb-1">+{overview.newRequests} new</span>
              )}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 ">
            <p className="text-sm text-gray-500 font-medium mb-2">Today&apos;s Bookings</p>
            <span className="text-4xl font-bold">{overview?.todayBookings ?? 0}</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 ">
            <p className="text-sm text-gray-500 font-medium mb-2">Monthly Revenue</p>
            <span className="text-4xl font-bold">฿{(overview?.monthlyRevenue ?? 0).toFixed(2)}</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 ">
            <p className="text-sm text-gray-500 font-medium mb-2">Rating</p>
            <div className="flex items-center gap-1">
              <span className="text-4xl font-bold">{overview?.rating ?? 0}</span>
              <svg className="w-6 h-6 text-yellow-400 mb-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            </div>
          </div>
        </div>


        <div className="bg-white border border-gray-200 rounded-2xl  overflow-hidden">


          <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900">Bookings Management</h2>
            <div className="flex flex-wrap gap-3">
              <select className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block px-4 py-2">
                <option>All Status</option>
                <option>Pending</option>
                <option>Confirmed</option>
              </select>
              <select className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block px-4 py-2">
                <option>Last 30 Days</option>
                <option>Last 7 Days</option>
              </select>
              <button className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Export CSV
              </button>
            </div>
          </div>


          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Simulator</th>
                  <th className="px-6 py-4">Schedule</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white text-sm">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500 flex flex-col items-center justify-center">
                      <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                      Loading bookings...
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      onClick={() => router.push(`/hosting/bookings/${booking.simId}/${booking.id}`)}
                      className="hover:bg-gray-100 transition cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
                            {getInitials(booking.customer)}
                          </div>
                          <span className="font-semibold text-gray-900">{booking.customer}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{booking.sim}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{booking.schedule}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{booking.duration}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${booking.price.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(booking.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end items-center gap-2">

                        <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-1.5 rounded-md transition text-xs font-semibold">
                          Details
                        </button>

                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="text-gray-400 hover:text-gray-600 ml-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>


          <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
            <div>Showing results</div>
            <div className="flex gap-1">
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">&lt;</button>
              <button className="px-3 py-1 bg-orange-600 text-white rounded font-medium">1</button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">&gt;</button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}