import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function KontaktvyLoading() {
  return (
    <main className="container mx-auto py-10">
      {/* Skeleton for ContactStats */}
      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12" />
              <Skeleton className="mt-1 h-3 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        {/* Skeleton for ContactCharts */}
        <Card>
          <CardHeader>
            <Skeleton className="mb-2 h-6 w-1/3" /> {/* Title */}
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              <Skeleton className="h-6 w-28 rounded-md" /> {/* Badge */}
              <Skeleton className="h-6 w-36 rounded-md" /> {/* Badge */}
            </div>
            <Skeleton className="h-4 w-full" /> {/* Description line 1 */}
            <Skeleton className="mt-1 h-4 w-2/3" /> {/* Description line 2 */}
          </CardHeader>
          <CardContent className="pt-0">
            <div className="mb-4 grid w-full grid-cols-3 gap-2">
              <Skeleton className="h-10 w-full" /> {/* Tab trigger */}
              <Skeleton className="h-10 w-full" /> {/* Tab trigger */}
              <Skeleton className="h-10 w-full" /> {/* Tab trigger */}
            </div>
            <Skeleton className="h-[400px] w-full" /> {/* Chart area */}
          </CardContent>
        </Card>

        {/* Skeleton for ContactList Card */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 pb-2 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
              <div className="space-y-1.5">
                <Skeleton className="h-6 w-32" /> {/* Title */}
                <Skeleton className="h-4 w-full sm:w-72" /> {/* Description */}
              </div>
              <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center md:justify-end">
                <Skeleton className="h-9 w-full rounded-md md:w-32" />{' '}
                {/* Button 1 */}
                <Skeleton className="h-9 w-full rounded-md md:w-40" />{' '}
                {/* Button 2 */}
                <Skeleton className="h-9 w-full rounded-md md:w-44" />{' '}
                {/* Button 3 */}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Skeleton for ContactToolbar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
              <div className="flex flex-1 flex-wrap items-center gap-2">
                <Skeleton className="h-8 min-w-[120px] flex-grow rounded-md sm:max-w-[200px] md:max-w-[250px]" />{' '}
                {/* Search */}
                <Skeleton className="h-8 w-full rounded-md sm:w-[150px]" />{' '}
                {/* Type Filter */}
              </div>
              <div className="flex items-center justify-start space-x-2 sm:justify-end">
                <Skeleton className="h-6 w-10 rounded-full" /> {/* Switch */}
                <Skeleton className="h-4 w-32 sm:w-44" />{' '}
                {/* Label for Switch */}
              </div>
            </div>

            {/* Skeleton for Table */}
            <div className="rounded-lg border">
              {/* Table Header Skeleton */}
              <div className="bg-muted/50 flex items-center space-x-3 border-b px-4 py-3 text-sm font-medium">
                <Skeleton className="h-5 w-5" /> {/* Checkbox */}
                <Skeleton
                  className="h-4 flex-1"
                  style={{ minWidth: '120px', maxWidth: '180px' }}
                />{' '}
                {/* Name hdr */}
                <Skeleton
                  className="h-4 flex-1"
                  style={{ minWidth: '120px', maxWidth: '180px' }}
                />{' '}
                {/* Email hdr (visible md+) */}
                <Skeleton
                  className="h-4 flex-1"
                  style={{ minWidth: '80px', maxWidth: '100px' }}
                />{' '}
                {/* Phone hdr (visible lg+) */}
                <Skeleton
                  className="h-4 flex-none"
                  style={{ width: '100px' }}
                />{' '}
                {/* Type hdr */}
                <Skeleton
                  className="h-4 flex-1"
                  style={{ minWidth: '80px', maxWidth: '100px' }}
                />{' '}
                {/* CreatedAt hdr (visible sm+) */}
                <Skeleton
                  className="h-4 flex-none"
                  style={{ width: '80px' }}
                />{' '}
                {/* Actions hdr */}
              </div>
              {/* Table Body Rows Skeleton */}
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-3 border-b px-4 py-3.5 last:border-b-0"
                >
                  <Skeleton className="h-5 w-5" /> {/* Checkbox */}
                  <Skeleton
                    className="h-4 flex-1"
                    style={{ minWidth: '120px', maxWidth: '180px' }}
                  />{' '}
                  {/* Name */}
                  <Skeleton
                    className="hidden h-4 flex-1 md:block"
                    style={{ minWidth: '120px', maxWidth: '180px' }}
                  />{' '}
                  {/* Email */}
                  <Skeleton
                    className="hidden h-4 flex-1 lg:block"
                    style={{ minWidth: '80px', maxWidth: '100px' }}
                  />{' '}
                  {/* Phone */}
                  <Skeleton className="h-6 w-20 flex-none rounded-md" />{' '}
                  {/* Type (Badge) */}
                  <Skeleton
                    className="hidden h-4 flex-1 sm:block"
                    style={{ minWidth: '80px', maxWidth: '100px' }}
                  />{' '}
                  {/* Created At */}
                  <div
                    className="flex flex-none items-center justify-end gap-2"
                    style={{ width: '80px' }}
                  >
                    <Skeleton className="h-6 w-6 rounded-md" />{' '}
                    {/* Icon Button */}
                    <Skeleton className="h-6 w-6 rounded-md" />{' '}
                    {/* Icon Button */}
                  </div>
                </div>
              ))}
            </div>

            {/* Skeleton for ContactPagination */}
            <div className="flex flex-col items-center justify-between gap-2 px-2 py-2 sm:flex-row sm:py-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-20" /> {/* Page info */}
                <Skeleton className="h-8 w-[70px] rounded-md" />{' '}
                {/* Items per page select */}
                <Skeleton className="h-4 w-12" /> {/* "per sida" text */}
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Skeleton className="h-8 w-8 rounded-md sm:h-9 sm:w-9" />{' '}
                {/* First page */}
                <Skeleton className="h-8 w-24 rounded-md sm:h-9" />{' '}
                {/* Prev page */}
                <Skeleton className="h-8 w-20 rounded-md sm:h-9" />{' '}
                {/* Next page */}
                <Skeleton className="h-8 w-8 rounded-md sm:h-9 sm:w-9" />{' '}
                {/* Last page */}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
