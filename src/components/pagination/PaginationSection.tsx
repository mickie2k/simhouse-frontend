import Link from "next/link";

type PaginationSectionProps = {
    currentPage: number;
    totalPages: number;
    basePath: string;
    className?: string;
};

const DOTS = "...";

function getPaginationItems(currentPage: number, totalPages: number): Array<number | string> {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const leftSibling = Math.max(currentPage - 1, 1);
    const rightSibling = Math.min(currentPage + 1, totalPages);

    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < totalPages - 1;

    const pages: Array<number | string> = [1];

    if (showLeftDots) {
        pages.push(DOTS);
    } else {
        for (let page = 2; page < leftSibling; page += 1) {
            pages.push(page);
        }
    }

    for (let page = leftSibling; page <= rightSibling; page += 1) {
        if (page !== 1 && page !== totalPages) {
            pages.push(page);
        }
    }

    if (showRightDots) {
        pages.push(DOTS);
    } else {
        for (let page = rightSibling + 1; page < totalPages; page += 1) {
            pages.push(page);
        }
    }

    if (totalPages > 1) {
        pages.push(totalPages);
    }

    return pages;
}

export default function PaginationSection({
    currentPage,
    totalPages,
    basePath,
    className,
}: PaginationSectionProps) {
    if (totalPages <= 1) {
        return null;
    }

    const items = getPaginationItems(currentPage, totalPages);
    const isPrevDisabled = currentPage <= 1;
    const isNextDisabled = currentPage >= totalPages;

    return (
        <nav
            aria-label="Pagination"
            className={`flex items-center justify-center gap-2 text-sm ${className ?? ""}`.trim()}
        >
            {isPrevDisabled ? (
                <span
                    aria-label="Previous page"
                    aria-disabled="true"
                    className="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-full text-gray-300"
                >
                    ‹
                </span>
            ) : (
                <Link
                    href={`${basePath}/${currentPage - 1}`}
                    aria-label="Go to previous page"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100"
                >
                    ‹
                </Link>
            )}

            {items.map((item, index) => {
                if (item === DOTS) {
                    return (
                        <span key={`dots-${index}`} className="px-1 text-gray-600" aria-hidden="true">
                            ...
                        </span>
                    );
                }

                const page = item as number;
                const isActive = page === currentPage;

                return (
                    <Link
                        key={page}
                        aria-label={`Go to page ${page}`}
                        aria-current={isActive ? "page" : undefined}
                        href={`${basePath}/${page}`}
                        className={[
                            "flex h-8 w-8 items-center justify-center rounded-full transition",
                            isActive
                                ? "bg-zinc-900 text-white"
                                : "text-zinc-900 hover:bg-gray-100",
                        ].join(" ")}
                    >
                        {page}
                    </Link>
                );
            })}

            {isNextDisabled ? (
                <span
                    aria-label="Next page"
                    aria-disabled="true"
                    className="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-full text-gray-300"
                >
                    ›
                </span>
            ) : (
                <Link
                    href={`${basePath}/${currentPage + 1}`}
                    aria-label="Go to next page"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100"
                >
                    ›
                </Link>
            )}
        </nav>
    );
}
