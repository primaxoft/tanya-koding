'use client';

import type { Question } from '@prisma/client';
import { Fragment, useCallback, useMemo, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import AnswerDialog from './AnswerDialog';
import { Button } from '@/components/ui/button';
import QuestionItem from '@/containers/questions-page/Questions/QuestionList/QuestionItem';

type QuestionQuery = {
  cursor: string;
  questions: Question[];
};

type Props = {
  questions: Question[];
};

export default function QuestionList(props: Readonly<Props>) {
  const {
    data: { pages: questionsGroups },
    fetchNextPage,
  } = useInfiniteQuery<QuestionQuery>({
    getNextPageParam: lastPage => lastPage.cursor,
    initialData: {
      pageParams: [],
      pages: [
        {
          cursor: props.questions.length > 0 ? props.questions[props.questions.length - 1].id : '',
          questions: props.questions,
        },
      ],
    },
    initialPageParam: '',
    queryFn: async ({ pageParam }) => {
      const axios = (await import('axios')).default;
      const response = await axios.get(`/api/soalan/?cursor=${pageParam}`);
      const questionsData = response.data.questions.map((question: Question) => ({
        ...question,
        askedOn: new Date(question.askedOn),
      }));
      return {
        cursor: questionsData[questionsData.length - 1].id,
        questions: questionsData,
      };
    },
    queryKey: ['questions'],
  });

  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  const handleOnSelectQuestion = useCallback(
    (question: Question) => () => {
      setSelectedQuestion(question);
    },
    []
  );

  const handleOnCloseDialog = useCallback((open: boolean) => {
    if (!open) setSelectedQuestion(null);
  }, []);

  const handleFetchMore = useCallback(() => fetchNextPage(), [fetchNextPage]);

  const haveMore = useMemo(() => {
    if (questionsGroups.length === 0) return false;
    const lastPage = questionsGroups[questionsGroups.length - 1];
    if (lastPage.questions.length === 0) return false;
    const lastQuestion = lastPage.questions[lastPage.questions.length - 1];

    return lastQuestion.questionId !== 1;
  }, [questionsGroups]);

  return (
    <>
      <ul className="flex w-full flex-col gap-6">
        {questionsGroups.map(questionGroup => (
          <Fragment key={questionGroup.cursor}>
            {questionGroup.questions.map(question => (
              <QuestionItem key={question.id} onAnswer={handleOnSelectQuestion} question={question} />
            ))}
          </Fragment>
        ))}
      </ul>
      {haveMore && (
        <Button onClick={handleFetchMore} variant="secondary">
          Lihat lagi ↓
        </Button>
      )}
      <AnswerDialog onOpenChange={handleOnCloseDialog} question={selectedQuestion} />
    </>
  );
}
