import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function QuestionItemSkeleton() {
  return (
    <li>
      <Card>
        <CardHeader className="items-center gap-2 p-3">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-52" />
        </CardHeader>
        <Separator />
        <CardContent className="flex flex-col items-center gap-3 p-4">
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
        <Separator />
        <CardFooter className="justify-end gap-3 p-3">
          <Skeleton className="h-9 w-28 rounded-full" />
        </CardFooter>
      </Card>
    </li>
  );
}
