import { PaginatedResponse, Product } from "@/types";

type ProductApiResponse = {
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
};

function toNumber(value: number | string) {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : 0;
}

export function normalizeProduct(product: ProductApiResponse): Product {
    const pricePerHour = toNumber(product.pricePerHour);
    const latitude = toNumber(product.latitude);
    const longitude = toNumber(product.longitude);

    if (
        !product.firstImage.startsWith("http") &&
        !product.firstImage.startsWith("/")
    ) {
        product.firstImage = `/${product.firstImage}`;
    }
    if (
        !product.secondImage.startsWith("http") &&
        !product.secondImage.startsWith("/")
    ) {
        product.secondImage = `/${product.secondImage}`;
    }
    if (
        !product.thirdImage.startsWith("http") &&
        !product.thirdImage.startsWith("/")
    ) {
        product.thirdImage = `/${product.thirdImage}`;
    }

    return {
        ...product,
        SimID: product.id,
        SimListName: product.simListName,
        PricePerHour: pricePerHour,
        Lat: latitude,
        Long: longitude,
        pricePerHour,
        latitude,
        longitude,
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
