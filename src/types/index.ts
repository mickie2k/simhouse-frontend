import { Key } from "react";

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
    SimID?: Key | null;
    SimListName?: string;
    PricePerHour?: number;
    Lat?: number;
    Long?: number;
    id: number;
    simListName: string;
    pricePerHour: number;
    listDescription: string | null;
    addressDetail: string;
    cityId: number;
    latitude: number;
    longitude: number;
    firstImage: string;
    secondImage: string;
    thirdImage: string;
    hostId: number;
    modId: number;
    // Included relations (present when fetched via findOne with includes)
    mod?: SimulatorMod;
    host?: {
        id: number;
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
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

export type BookingDetail = {
    id: number;
    bookingDate: string;
    totalPrice: number;
    statusId: number;
    customerId: number;
    simId: number;
    bookingList: BookingListItem[];
    simulator: {
        id: number;
        simListName: string;
        pricePerHour: number;
        listDescription: string | null;
        addressDetail: string;
        latitude: number;
        longitude: number;
        firstImage: string;
        secondImage: string;
        thirdImage: string;
        hostId: number;
        host: {
            id: number;
            firstName: string;
            lastName: string;
            phone: string;
            email: string;
        };
    };
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

// Keep for backward compatibility — alias the old name
export type BookingDetailSchedule = BookingDetail;
