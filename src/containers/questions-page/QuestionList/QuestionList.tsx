'use client';

import Link from 'next/link';
import type { Question } from '@prisma/client';
import { Fragment, useCallback, useMemo, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import AnswerDialog from './AnswerDialog';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

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

  // Get the user's time zone offset in minutes
  const userTimeZoneOffset = new Date().getTimezoneOffset();

  // Calculate the user's time zone offset in milliseconds
  const userTimeZoneOffsetMs = userTimeZoneOffset * 60 * 1000;

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
            {questionGroup.questions.map(question => {
              const adjustedAskedOn = new Date(question.askedOn.getTime() - userTimeZoneOffsetMs);

              const askedOn = new Intl.DateTimeFormat('ms-MY', {
                day: 'numeric',
                hour: '2-digit',
                hour12: false,
                minute: '2-digit',
                month: 'short',
                timeZoneName: 'longOffset',
                year: '2-digit',
              }).format(adjustedAskedOn);

              return (
                <li key={question.id}>
                  <Card>
                    <CardHeader className="p-3">
                      <CardTitle className="text-center text-lg">Soalan #{question.questionId}</CardTitle>
                      <CardDescription className="text-center">{askedOn}</CardDescription>
                    </CardHeader>
                    <Separator />
                    <CardContent className="p-3">
                      <p className="text-center">{question.question}</p>
                    </CardContent>
                    <Separator />
                    <CardFooter className="justify-end gap-3 p-3">
                      <Link
                        className="underline"
                        href={`https://twitter.com/search?q=(%23TanyaKoding${question.questionId})&f=live`}
                        target="_blank"
                      >
                        Lihat jawaban
                      </Link>
                      <button
                        className="rounded-full bg-blue-500 bg-gradient-to-r from-grad-start to-grad-end px-5 py-2 font-medium"
                        onClick={handleOnSelectQuestion(question)}
                        type="button"
                      >
                        Jawab
                      </button>
                    </CardFooter>
                  </Card>
                </li>
              );
            })}
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
