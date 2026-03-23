import { PaginatedResponse, Product } from "@/types";

export type ProductApiResponse = {
    id: number;
    simListName: string;
    pricePerHour: number | string;
    listDescription: string | null;
    addressDetail: string;
    cityId: number;
    latitude: number | string;
    longitude: number | string;
    firstImage: string;
    secondImage: string;
    thirdImage: string;
    hostId: number;
    modId: number;
    mod?: Product["mod"];
    host?: Product["host"];
    typeList?: Product["typeList"];
    city: string;
    province?: string;
    country: string;
    distanenceKm?: number;
};

function toNumber(value: number | string) {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : 0;
}

export function normalizeImagePath(imagePath: string) {
    return formatImageUrl(imagePath);
}

export function normalizeProduct(
    product: ProductApiResponse | Product,
): Product {
    return {
        id: product.id,
        simListName: product.simListName,
        pricePerHour: toNumber(product.pricePerHour),
        listDescription: product.listDescription,
        addressDetail: product.addressDetail,
        cityId: product.cityId,
        latitude: toNumber(product.latitude),
        longitude: toNumber(product.longitude),
        firstImage: normalizeImagePath(product.firstImage),
        secondImage: normalizeImagePath(product.secondImage),
        thirdImage: normalizeImagePath(product.thirdImage),
        hostId: product.hostId,
        modId: product.modId,
        city: product.city,
        province: product.province,
        country: product.country,
        mod: product.mod,
        host: product.host,
        typeList: product.typeList,
    };
}

export function normalizePaginatedProducts(
    payload: PaginatedResponse<ProductApiResponse>,
): PaginatedResponse<Product> {
    return {
        ...payload,
        data: payload.data.map(normalizeProduct),
    };
}

export function formatImageUrl(imagePath: string): string {
    if (!imagePath.startsWith("http") && !imagePath.startsWith("/")) {
        imagePath = `/${imagePath}`;
    }
    return imagePath;
}
