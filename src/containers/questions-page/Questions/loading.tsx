import { QuestionItemSkeleton } from './QuestionList/QuestionItem';

export default function QuestionLoading() {
  return (
    <ul className="flex w-full flex-col gap-6">
      {Array.from(Array(3).keys()).map(i => (
        <QuestionItemSkeleton key={i} />
      ))}
    </ul>
  );
}
