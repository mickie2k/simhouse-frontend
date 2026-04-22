"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";
import { axiosJWTInstance } from "@/lib/http";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

type VerifyFormState = {
    citizenId: string;
    idCardAddress: string;
    bankName: string;
    bankAccountName: string;
    bankAccountNumber: string;
    idCardImage: File | null;
    portraitImage: File | null;
};

type VerifyFormErrors = Partial<Record<keyof VerifyFormState, string>>;

export default function HostVerifyPage() {
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<VerifyFormErrors>({});
    const [idCardPreview, setIdCardPreview] = useState<string | null>(null);
    const [portraitPreview, setPortraitPreview] = useState<string | null>(null);
    const [form, setForm] = useState<VerifyFormState>({
        citizenId: "",
        idCardAddress: "",
        bankName: "",
        bankAccountName: "",
        bankAccountNumber: "",
        idCardImage: null,
        portraitImage: null,
    });

    useEffect(() => {
        if (!form.idCardImage) {
            setIdCardPreview(null);
            return;
        }
        const nextPreview = URL.createObjectURL(form.idCardImage);
        setIdCardPreview(nextPreview);
        return () => URL.revokeObjectURL(nextPreview);
    }, [form.idCardImage]);

    useEffect(() => {
        if (!form.portraitImage) {
            setPortraitPreview(null);
            return;
        }
        const nextPreview = URL.createObjectURL(form.portraitImage);
        setPortraitPreview(nextPreview);
        return () => URL.revokeObjectURL(nextPreview);
    }, [form.portraitImage]);

    const updateField = <K extends keyof VerifyFormState>(
        key: K,
        value: VerifyFormState[K],
    ) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) {
            setErrors((prev) => ({ ...prev, [key]: undefined }));
        }
    };

    const validateImage = (file: File | null, label: string): string | undefined => {
        if (!file) return `${label} is required`;
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            return `${label} must be JPG, PNG, or WebP`;
        }
        if (file.size > MAX_IMAGE_SIZE) {
            return `${label} must be less than 10MB`;
        }
        return undefined;
    };

    const validate = (): VerifyFormErrors => {
        const nextErrors: VerifyFormErrors = {};

        if (!/^\d{13}$/.test(form.citizenId.trim())) {
            nextErrors.citizenId = "Thai citizen ID must be exactly 13 digits";
        }
        if (!form.idCardAddress.trim()) {
            nextErrors.idCardAddress = "Address on ID card is required";
        }
        if (!form.bankName.trim()) {
            nextErrors.bankName = "Bank name is required";
        }
        if (!form.bankAccountName.trim()) {
            nextErrors.bankAccountName = "Bank account name is required";
        }
        if (!/^\d{8,20}$/.test(form.bankAccountNumber.trim())) {
            nextErrors.bankAccountNumber = "Bank account number must be 8-20 digits";
        }

        const idCardImageError = validateImage(form.idCardImage, "ID card image");
        if (idCardImageError) {
            nextErrors.idCardImage = idCardImageError;
        }

        const portraitImageError = validateImage(form.portraitImage, "Portrait photo");
        if (portraitImageError) {
            nextErrors.portraitImage = portraitImageError;
        }

        return nextErrors;
    };

    const handleFileChange =
        (field: "idCardImage" | "portraitImage") =>
            (event: ChangeEvent<HTMLInputElement>) => {
                const file = event.target.files?.[0] ?? null;
                updateField(field, file);
            };

    const submitVerification = async (payload: FormData) => {
        // Primary endpoint for KYC verification submission.
        await axiosJWTInstance.post("/host/profile/verification", payload, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    };

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error("Please complete all required verification fields");
            return;
        }

        const payload = new FormData();
        payload.append("citizenId", form.citizenId.trim());
        payload.append("idCardAddress", form.idCardAddress.trim());
        payload.append("bankName", form.bankName.trim());
        payload.append("bankAccountName", form.bankAccountName.trim());
        payload.append("bankAccountNumber", form.bankAccountNumber.trim());
        payload.append("idCardImage", form.idCardImage as Blob);
        payload.append("portraitImage", form.portraitImage as Blob);

        setIsSubmitting(true);

        try {
            await submitVerification(payload);
            toast.success("Verification submitted. We will review your account soon.");
            router.push("/hosting");
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                toast.error(
                    "Verification endpoint is not ready yet. Please add backend route /host/profile/verification.",
                );
            } else if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Verification submission failed");
            } else {
                toast.error("Verification submission failed");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="bg-white mt-7">
            <div className="flex flex-col items-center px-6 py-0 mx-auto md:h-full lg:py-0">
                <div className="w-full bg-transparent border-[#E2E2E2] md:mt-0 sm:max-w-2xl xl:p-0">
                    <div className="p-6 space-y-5 md:space-y-6 sm:p-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Verify Hosting Account</h1>
                            <p className="text-sm text-gray-600 mt-2">
                                Submit your identity details to verify your host account.
                            </p>
                        </div>

                        <form className="space-y-5" onSubmit={onSubmit}>
                            <div>
                                <label htmlFor="citizenId" className="block mb-2 text-sm font-medium text-gray-900">
                                    Thai Citizen ID (บัตรประชาชน)
                                </label>
                                <input
                                    id="citizenId"
                                    name="citizenId"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={13}
                                    value={form.citizenId}
                                    onChange={(e) => updateField("citizenId", e.target.value.replace(/\D/g, ""))}
                                    placeholder="13 digits"
                                    className={`bg-gray-50 border text-gray-900 rounded-lg block w-full p-2.5 ${errors.citizenId ? "border-red-500" : "border-gray-300"
                                        }`}
                                    required
                                />
                                {errors.citizenId && <p className="mt-1 text-xs text-red-500">{errors.citizenId}</p>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="idCardImage" className="block mb-2 text-sm font-medium text-gray-900">
                                        ID Card Photo
                                    </label>
                                    <input
                                        id="idCardImage"
                                        name="idCardImage"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handleFileChange("idCardImage")}
                                        className={`block w-full text-sm text-gray-900 border rounded-lg cursor-pointer bg-gray-50 p-2 ${errors.idCardImage ? "border-red-500" : "border-gray-300"
                                            }`}
                                        required
                                    />
                                    {errors.idCardImage && <p className="mt-1 text-xs text-red-500">{errors.idCardImage}</p>}
                                    {idCardPreview && (
                                        <Image
                                            src={idCardPreview}
                                            alt="ID card preview"
                                            width={640}
                                            height={240}
                                            unoptimized
                                            className="mt-3 h-36 w-full rounded-lg object-cover border border-gray-200"
                                        />
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="portraitImage"
                                        className="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Portrait Photo (รูปถ่าย)
                                    </label>
                                    <input
                                        id="portraitImage"
                                        name="portraitImage"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handleFileChange("portraitImage")}
                                        className={`block w-full text-sm text-gray-900 border rounded-lg cursor-pointer bg-gray-50 p-2 ${errors.portraitImage ? "border-red-500" : "border-gray-300"
                                            }`}
                                        required
                                    />
                                    {errors.portraitImage && (
                                        <p className="mt-1 text-xs text-red-500">{errors.portraitImage}</p>
                                    )}
                                    {portraitPreview && (
                                        <Image
                                            src={portraitPreview}
                                            alt="Portrait preview"
                                            width={640}
                                            height={240}
                                            unoptimized
                                            className="mt-3 h-36 w-full rounded-lg object-cover border border-gray-200"
                                        />
                                    )}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="idCardAddress" className="block mb-2 text-sm font-medium text-gray-900">
                                    Address on ID Card (ที่อยู่ตามบัตรประชาชน)
                                </label>
                                <textarea
                                    id="idCardAddress"
                                    name="idCardAddress"
                                    rows={4}
                                    value={form.idCardAddress}
                                    onChange={(e) => updateField("idCardAddress", e.target.value)}
                                    placeholder="House number, road, subdistrict, district, province, postal code"
                                    className={`bg-gray-50 border text-gray-900 rounded-lg block w-full p-2.5 ${errors.idCardAddress ? "border-red-500" : "border-gray-300"
                                        }`}
                                    required
                                />
                                {errors.idCardAddress && <p className="mt-1 text-xs text-red-500">{errors.idCardAddress}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="bankName" className="block mb-2 text-sm font-medium text-gray-900">
                                        Bank Name (บัญชีธนาคาร)
                                    </label>
                                    <input
                                        id="bankName"
                                        name="bankName"
                                        type="text"
                                        value={form.bankName}
                                        onChange={(e) => updateField("bankName", e.target.value)}
                                        placeholder="e.g. Kasikornbank"
                                        className={`bg-gray-50 border text-gray-900 rounded-lg block w-full p-2.5 ${errors.bankName ? "border-red-500" : "border-gray-300"
                                            }`}
                                        required
                                    />
                                    {errors.bankName && <p className="mt-1 text-xs text-red-500">{errors.bankName}</p>}
                                </div>

                                <div>
                                    <label
                                        htmlFor="bankAccountName"
                                        className="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Account Name
                                    </label>
                                    <input
                                        id="bankAccountName"
                                        name="bankAccountName"
                                        type="text"
                                        value={form.bankAccountName}
                                        onChange={(e) => updateField("bankAccountName", e.target.value)}
                                        placeholder="Account holder name"
                                        className={`bg-gray-50 border text-gray-900 rounded-lg block w-full p-2.5 ${errors.bankAccountName ? "border-red-500" : "border-gray-300"
                                            }`}
                                        required
                                    />
                                    {errors.bankAccountName && (
                                        <p className="mt-1 text-xs text-red-500">{errors.bankAccountName}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="bankAccountNumber"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Bank Account Number
                                </label>
                                <input
                                    id="bankAccountNumber"
                                    name="bankAccountNumber"
                                    type="text"
                                    inputMode="numeric"
                                    value={form.bankAccountNumber}
                                    onChange={(e) =>
                                        updateField("bankAccountNumber", e.target.value.replace(/\D/g, ""))
                                    }
                                    placeholder="8-20 digits"
                                    className={`bg-gray-50 border text-gray-900 rounded-lg block w-full p-2.5 ${errors.bankAccountNumber ? "border-red-500" : "border-gray-300"
                                        }`}
                                    required
                                />
                                {errors.bankAccountNumber && (
                                    <p className="mt-1 text-xs text-red-500">{errors.bankAccountNumber}</p>
                                )}
                            </div>


                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center ${isSubmitting
                                    ? "bg-orange-400 cursor-not-allowed"
                                    : "bg-orange-600 hover:bg-orange-700"
                                    }`}
                            >
                                {isSubmitting ? "Submitting..." : "Submit Verification"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
