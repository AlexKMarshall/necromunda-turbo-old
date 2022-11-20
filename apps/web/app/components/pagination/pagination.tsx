import clsx from "clsx";
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";
import type { AnchorHTMLAttributes } from "react";

type Props = {
  currentPage: number;
  size: number;
  count: number;
  href: (page: number) => string;
  edgeRange?: number;
  middleRange?: number;
  Link: PaginationLink;
};
export function Pagination({
  currentPage,
  size,
  count,
  href,
  edgeRange = 1,
  middleRange = 1,
  Link,
}: Props): JSX.Element {
  const totalPages = Math.ceil(count / size);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const previousPage = currentPage - 1 > 0 ? currentPage - 1 : null;
  const nextPage = currentPage + 1 <= totalPages ? currentPage + 1 : null;
  const startPages = pages.slice(0, edgeRange);
  const endPages = pages.slice(-edgeRange);
  const middlePages = pages.slice(
    Math.max(currentPage - middleRange - 1, edgeRange),
    Math.min(currentPage + middleRange, totalPages - edgeRange)
  );
  const hasStartEllipsis = middlePages[0] - startPages.length > 1;
  const hasEndEllipsis = endPages[0] - middlePages[middlePages.length - 1] > 1;

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
      <div className="-mt-px flex w-0 flex-1">
        <PaginationPrevious pageNumber={previousPage} Link={Link} />
      </div>
      <div className="hidden md:-mt-px md:flex">
        {startPages.map((page) => (
          <PaginationItem
            key={page}
            page={page}
            current={currentPage === page}
            Link={Link}
          />
        ))}
        {hasStartEllipsis && <Ellipsis />}
        {middlePages.map((page) => (
          <PaginationItem
            key={page}
            page={page}
            current={currentPage === page}
            Link={Link}
          />
        ))}
        {hasEndEllipsis && <Ellipsis />}
        {endPages.map((page) => (
          <PaginationItem
            key={page}
            page={page}
            current={currentPage === page}
            Link={Link}
          />
        ))}
      </div>
      <div className="-mt-px flex w-0 flex-1 justify-end">
        <PaginationNext pageNumber={nextPage} Link={Link} />
      </div>
    </nav>
  );
}

type PaginationLink = React.ComponentType<
  { page: number } & AnchorHTMLAttributes<HTMLAnchorElement>
>;

type PaginationItemProps = {
  page: number;
  current?: boolean;
  Link: PaginationLink;
};
function PaginationItem({ page, current, Link }: PaginationItemProps) {
  return (
    <Link
      page={page}
      aria-current={current ? "page" : undefined}
      className={clsx(
        "inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700",
        {
          "border-indigo-500 text-indigo-600": current,
          "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300":
            !current,
        }
      )}
    >
      {page}
    </Link>
  );
}

function Ellipsis() {
  return (
    <span className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">
      &hellip;
    </span>
  );
}

type PaginationPreviousProps = {
  pageNumber: number | null;
  Link: PaginationLink;
};
function PaginationPrevious({ pageNumber, Link }: PaginationPreviousProps) {
  const inner = (
    <>
      <ArrowLongLeftIcon
        className="mr-3 h-5 w-5 text-gray-400"
        aria-hidden="true"
      />
      Previous
    </>
  );

  if (pageNumber === null) {
    return (
      <span className="inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium text-gray-500">
        {inner}
      </span>
    );
  }

  return (
    <Link
      page={pageNumber}
      className="inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
    >
      {inner}
    </Link>
  );
}

type PaginationNextProps = {
  pageNumber: number | null;
  Link: PaginationLink;
};
function PaginationNext({ pageNumber, Link }: PaginationNextProps) {
  const inner = (
    <>
      Next
      <ArrowLongRightIcon
        className="ml-3 h-5 w-5 text-gray-400"
        aria-hidden="true"
      />
    </>
  );

  if (pageNumber === null) {
    return (
      <span className="inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium text-gray-500">
        {inner}
      </span>
    );
  }

  return (
    <Link
      page={pageNumber}
      className="inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
    >
      {inner}
    </Link>
  );
}
