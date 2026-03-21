export type SelectedPlace = {
    name: string;
    address?: string;
    lat: number;
    lng: number;
};

// Simulator (Product) — matches GET /simulator/:id (with mod+brand+host included)
export type SimulatorMod = {
    id: number;
    modelName: string;
    description: string | null;
    brandId: number;
    brand: {
        id: number;
        brandName: string;
    };
};

export type Product = {
    id: number;
    simListName: string;
    pricePerHour: number;
    listDescription?: string | null;
    addressDetail?: string;
    cityId: number;
    latitude: number;
    longitude: number;
    firstImage: string;
    secondImage: string;
    thirdImage: string;
    hostId: number;
    modId: number;
    city: string;
    province?: string;
    country: string;
    distanenceKm?: number;
    // Included relations (present when fetched via findOne with includes)
    mod?: SimulatorMod;
    host?: {
        id: number;
        firstName: string;
        lastName: string;
        phone?: string;
        email?: string;
    };
    typeList?: {
        simTypeId: number;
        simId: number;
        simType: {
            id: number;
            typeName: string;
        };
    }[];
};

// Schedule slot — matches GET /simulator/:id/schedule
export type Schedule = {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    price: number;
};

// Booking — matches GET /booking (list)
export type BookingStatus = {
    id: number;
    statusName: string;
};

export type Booking = {
    id: number;
    bookingDate: string;
    totalPrice: number;
    statusId: number;
    customerId: number;
    simId: number;
    bookingStatus: BookingStatus;
};

// Booking detail — matches GET /booking/:id/schedule (nested Prisma response)
export type BookingListItem = {
    bookingId: number;
    scheduleId: number;
    schedule: {
        id: number;
        price: number;
        date: string;
        startTime: string;
        endTime: string;
        available: boolean;
        simId: number;
    };
};

export type BookingReview = {
    id: number;
    overallRating: number;
    comment: string;
};

export type ReviewDetail = {
    typeId: number;
    rating: number;
};

export type ReviewSubmissionPayload = {
    bookingId: number;
    overallRating: number;
    comment: string;
    reviewDetails: ReviewDetail[];
};

export type BookingDetail = {
    id: number;
    bookingDate: string;
    totalPrice: number;
    statusId: number;
    customerId: number;
    simId: number;
    bookingList: BookingListItem[];
    simulator: Product;
    review?: BookingReview | null;
};

// Paginated response wrapper — matches GET /simulator (list)
export type PaginatedResponse<T> = {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
};

export interface User {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
}

export type ProductReviewResponse = {
    simulatorId: number;
    totalReviews: number;
    averageRating: number;
    ratingCategories: {
        label: string;
        value: number;
    }[];
    reviewItems: {
        id: number;
        reviewerName: string;
        reviewDate: string;
        comment: string;
    }[];
};
export interface Customer extends User {}
export interface Host extends User {}
export interface Admin extends User {}
