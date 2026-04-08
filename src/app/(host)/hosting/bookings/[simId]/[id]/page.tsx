'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { axiosJWTInstance } from '@/lib/http';
import { toast } from 'sonner';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import { MdCancel, MdPending } from 'react-icons/md';
import Image from 'next/image';
import Link from 'next/link';

interface Customer {
    id: number;
    username: string;
    email: string;
}

interface Schedule {
    id: number;
    price: string;
    date: string;
    startTime: string;
    endTime: string;
    available: boolean;
    simId: number;
    templateId: number;
}

interface BookingListItem {
    bookingId: number;
    scheduleId: number;
    schedule: Schedule;
}

interface Simulator {
    id: number;
    simListName: string;
    pricePerHour?: string;
    firstImage?: string;
    secondImage?: string;
    thirdImage?: string;
    listDescription?: string;
    addressDetail?: string;
    cityId?: number;
    latitude?: string;
    longitude?: string;
    hostId?: number;
    modId?: number;
}

interface BookingStatus {
    id: number;
    statusName: string;
}

interface CustomerReview {
    id: number;
    rating: number;
    comment?: string;
    createdAt: string;
}

interface HostBookingDetail {
    id: number;
    bookingDate: string;
    totalPrice: string;
    statusId: number;
    customerId: number;
    simId: number;
    bookingList: BookingListItem[];
    bookingStatus: BookingStatus;
    customer: Customer;
    simulator: Simulator;
    customerReviews: CustomerReview[];
}

export default function HostBookingDetailPage() {
    const params = useParams();
    const bookingId = params.id as string;
    const simId = params.simId as string;

    const [booking, setBooking] = useState<HostBookingDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isConfirming, setIsConfirming] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false);
    const [reviewRating, setReviewRating] = useState<number>(0);
    const [reviewComment, setReviewComment] = useState<string>('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [reviewSubmitted, setReviewSubmitted] = useState(false);
    const [customerReviews, setCustomerReviews] = useState<any>(null);
    const [isLoadingReviews, setIsLoadingReviews] = useState(false);

    useEffect(() => {
        const fetchBookingDetail = async () => {
            try {
                setIsLoading(true);

                // If we have both simId and bookingId, use the specific endpoint
                if (simId) {
                    const { data } = await axiosJWTInstance.get<HostBookingDetail>(
                        `/host/booking/${simId}/${bookingId}/schedule`
                    );
                    console.log(data)
                    setBooking(data);
                    if (data.customerReviews && data.customerReviews.length > 0) {
                        setReviewSubmitted(true);
                    }
                } else {
                    toast.error('Booking not found');
                    setBooking(null);
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
    }, [bookingId, simId]);

    // Fetch customer reviews
    useEffect(() => {
        const fetchCustomerReviews = async () => {
            if (!booking) return;
            try {
                setIsLoadingReviews(true);
                const { data } = await axiosJWTInstance.get(
                    `/user/${booking.customerId}/reviews`
                );
                setCustomerReviews(data);
            } catch (error) {
                console.error('Failed to fetch customer reviews:', error);
                // Don't show error toast for reviews - it's optional data
            } finally {
                setIsLoadingReviews(false);
            }
        };

        if (booking) {
            fetchCustomerReviews();
        }
    }, [booking]);

    const handleConfirmBooking = async () => {
        if (!booking) return;
        setIsConfirming(true);
        try {
            await axiosJWTInstance.post(`/host/booking/${simId}/${booking.id}/confirm`);
            toast.success('Booking confirmed');
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
            await axiosJWTInstance.post(`/host/booking/${simId}/${booking.id}/cancel`);
            toast.success('Booking canceled');
            setBooking({ ...booking, statusId: 0, bookingStatus: { id: 0, statusName: 'CANCELED' } });
        } catch (error: any) {
            console.error('Failed to cancel booking:', error);
            toast.error(error.response?.data?.message || 'Failed to cancel booking');
        } finally {
            setIsCanceling(false);
        }
    };

    const handleSubmitReview = async () => {
        if (!booking || reviewRating === 0) {
            toast.error('Please select a rating');
            return;
        }

        setIsSubmittingReview(true);
        try {
            await axiosJWTInstance.post(`/host/booking/${booking.id}/review`, {
                bookingId: booking.id,
                rating: reviewRating,
                comment: reviewComment || undefined,
            });
            toast.success('Review submitted successfully');
            setReviewSubmitted(true);
            setReviewRating(0);
            setReviewComment('');
        } catch (error: any) {
            console.error('Failed to submit review:', error);
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setIsSubmittingReview(false);
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
        <div className="max-w-6xl mx-auto my-6 px-4">
            <div className="py-2">
                {getStatusIndicator()}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    {/* Left Column - Simulator Image and Info */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* Product Image */}
                        {booking.simulator.firstImage && (
                            <div className="w-full rounded-xl overflow-hidden">
                                <Image
                                    src={booking.simulator.firstImage}
                                    width={600}
                                    height={450}
                                    alt={booking.simulator.simListName}
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        )}

                        {/* Product Info */}
                        <div className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">{booking.simulator.simListName}</h2>
                            <p className="text-gray-600 text-sm">Fanatec Brand • Full Cockpit • 3 monitor</p>
                            {booking.simulator.latitude && booking.simulator.longitude && booking.simulator.addressDetail && (
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${booking.simulator.latitude}%2C${booking.simulator.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline text-sm mt-2 hover:text-blue-700"
                                >
                                    {booking.simulator.addressDetail}
                                </a>
                            )}
                        </div>

                        {/* Customer Reviews/Ratings History */}
                        <div className="flex flex-col gap-3">
                            <h3 className="text-lg font-semibold">Customer History</h3>
                            {isLoadingReviews ? (
                                <div className="flex items-center justify-center py-4">
                                    <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : customerReviews && customerReviews.totalReviews > 0 ? (
                                <div className="space-y-4">
                                    {/* Average Rating */}
                                    <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span
                                                        key={star}
                                                        className={`text-lg ${star <= Math.round(customerReviews.averageRating)
                                                            ? 'text-yellow-400'
                                                            : 'text-gray-300'
                                                            }`}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="text-xs text-gray-600 mt-1">
                                                {customerReviews.averageRating} from {customerReviews.totalReviews} review{customerReviews.totalReviews > 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Reviews List */}
                                    <div className="space-y-3 max-h-64 overflow-y-auto">
                                        {customerReviews.reviews.map((review: any, index: number) => (
                                            <div
                                                key={index}
                                                className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                                            >
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <div className="flex-1">
                                                        <p className="text-xs font-semibold text-gray-700">
                                                            {review.booking.simulator.host.firstName} {review.booking.simulator.host.lastName}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {review.booking.simulator.simListName}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 mb-2">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <span
                                                            key={star}
                                                            className={`text-sm ${star <= review.rating
                                                                ? 'text-yellow-400'
                                                                : 'text-gray-300'
                                                                }`}
                                                        >
                                                            ★
                                                        </span>
                                                    ))}
                                                </div>
                                                {review.comment && (
                                                    <p className="text-xs text-gray-700 mb-2">
                                                        {review.comment.length > 100
                                                            ? review.comment.substring(0, 100) + '...'
                                                            : review.comment}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-500">
                                                    {new Date(review.booking.bookingDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-3">
                                    No reviews yet for this customer
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Booking Details */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        {/* Customer Information */}
                        <div className="flex flex-col gap-3">
                            <h3 className="text-lg font-semibold">Customer Information</h3>
                            <div className="space-y-2">
                                <p className="text-base font-medium">{booking.customer.username}</p>
                                <p className="text-sm text-gray-600">Tel: {formattedTel}</p>
                            </div>
                        </div>

                        <hr className="border-gray-200" />

                        {/* Date/Time */}
                        <div className="flex flex-col gap-3">
                            <h3 className="text-lg font-semibold">Date/Time</h3>
                            <div className="flex justify-between gap-6">
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-700">{weekday[day]}</p>
                                    <p className="text-sm text-gray-700">{dateStr}</p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Please check in at least 10 minutes prior.
                                    </p>
                                </div>

                                {/* Time Slots */}
                                <div className="space-y-1 text-right">
                                    {booking.bookingList && booking.bookingList.length > 0 ? (
                                        booking.bookingList.map((item, index) => {
                                            const startTime = new Date(item.schedule.startTime);
                                            const endTime = new Date(item.schedule.endTime);
                                            const startStr = startTime.toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: false,
                                            });
                                            const endStr = endTime.toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: false,
                                            });
                                            return (
                                                <p key={index} className="text-sm text-gray-700">
                                                    {startStr}-{endStr}
                                                </p>
                                            );
                                        })
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-200" />

                        {/* Amount */}
                        <div className="flex flex-col gap-3">
                            <h3 className="text-lg font-semibold">Amount</h3>
                            <div className="flex justify-between items-end gap-6">
                                {booking.bookingList && booking.bookingList.length > 0 && (
                                    <div className="text-sm text-gray-600">
                                        <p>
                                            ฿{booking.bookingList[0].schedule.price} x {booking.bookingList.length} hrs
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <span className="text-2xl font-semibold">฿{booking.totalPrice}</span>
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-200" />
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
                                        className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 hover:text-gray-900 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed font-medium py-3 px-4 rounded-lg transition"
                                    >
                                        {isCanceling ? 'Canceling...' : 'Cancel Reservation'}
                                    </button>
                                </>
                            ) : booking.statusId === 2 || booking.bookingStatus.statusName.toUpperCase() === 'CONFIRM' ? (
                                <>
                                    <button disabled className="w-full bg-green-100 border border-green-300 text-green-700 font-semibold py-3 px-4 rounded-lg cursor-default">
                                        Confirmed
                                    </button>
                                    <button
                                        onClick={handleCancelBooking}
                                        disabled={isCanceling}
                                        className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 hover:text-gray-900 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed font-medium py-3 px-4 rounded-lg transition"
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

                        {/* Review Form - Show when booking is confirmed */}
                        {(booking.statusId === 2 || booking.bookingStatus.statusName.toUpperCase() === 'CONFIRM') && !reviewSubmitted && (
                            <>
                                <hr className="border-gray-200" />
                                <div className="flex flex-col gap-4">
                                    <h3 className="text-lg font-semibold">Rate This Customer</h3>

                                    {/* Star Rating */}
                                    <div className="flex flex-col gap-2">
                                        <p className="text-sm text-gray-600">Rating</p>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => setReviewRating(star)}
                                                    className={`text-3xl transition ${star <= reviewRating
                                                        ? 'text-yellow-400'
                                                        : 'text-gray-300 hover:text-yellow-200'
                                                        }`}
                                                >
                                                    ★
                                                </button>
                                            ))}
                                        </div>
                                        {reviewRating > 0 && (
                                            <p className="text-sm text-gray-600">{reviewRating} out of 5 stars</p>
                                        )}
                                    </div>

                                    {/* Comment Textarea */}
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="comment" className="text-sm text-gray-600">
                                            Comment (Optional)
                                        </label>
                                        <textarea
                                            id="comment"
                                            value={reviewComment}
                                            onChange={(e) =>
                                                setReviewComment(e.target.value.slice(0, 1000))
                                            }
                                            placeholder="Share your experience with this customer..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                                            rows={4}
                                        />
                                        <p className="text-xs text-gray-500">
                                            {reviewComment.length}/1000 characters
                                        </p>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        onClick={handleSubmitReview}
                                        disabled={isSubmittingReview || reviewRating === 0}
                                        className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition"
                                    >
                                        {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Review Submitted / Already Reviewed */}
                        {reviewSubmitted && (
                            <>
                                <hr className="border-gray-200" />
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2">
                                        <IoIosCheckmarkCircle className="text-green-500 text-xl flex-shrink-0" />
                                        <h3 className="text-lg font-semibold ">Review Complete</h3>
                                    </div>
                                    {(() => {
                                        const review = booking.customerReviews?.[0];
                                        if (!review) return null;
                                        return (
                                            <div className="bg-background border border-borderColor1 rounded-lg p-4 flex flex-col gap-2">
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <span
                                                            key={star}
                                                            className={`text-lg ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                        >
                                                            ★
                                                        </span>
                                                    ))}
                                                    <span className="text-sm text-gray-600 ml-1 self-center">{review.rating}/5</span>
                                                </div>
                                                {review.comment && (
                                                    <p className="text-sm text-gray-700">{review.comment}</p>
                                                )}
                                                <p className="text-xs text-gray-500">
                                                    Reviewed on {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </p>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
