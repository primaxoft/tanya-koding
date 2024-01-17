'use client';

import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { useForm } from 'react-hook-form';
import { useCallback, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import SuccessAlert from './SuccessAlert';
import type { CreateQuestionSchema } from '@/zod/schemas';
import { createQuestionSchema } from '@/zod/schemas';
import { Badge } from '@/components/ui/badge';

export default function QuestionForm() {
  const [alertText, setAlertText] = useState<string | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<CreateQuestionSchema>({ resolver: zodResolver(createQuestionSchema) });

  const autoGrow = useCallback(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, []);

  const handleOnSubmit = handleSubmit(async data => {
    try {
      const response = await axios.post('/api/soalan', {
        question: data.question,
      });

      const message = response.data.message as string;
      setAlertText(message);

      reset();
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response?.status === StatusCodes.BAD_REQUEST &&
        !error.response.data.errors?.question
      ) {
        const questionError = error.response.data.errors.question as string;
        setError('question', { message: questionError });
      } else {
        setError('question', { message: 'Maaf, terdapat masalah teknikal. Sila cuba lagi.' });
      }
    }
  });

  const { ref, ...rest } = register('question');

  const handleRef = useCallback(
    (element: HTMLTextAreaElement) => {
      ref(element);
      textAreaRef.current = element;
    },
    [ref]
  );

  const handleAlertClose = useCallback(() => {
    setAlertText(null);
  }, []);

  return (
    <>
      <form className="flex flex-col items-center gap-8" onSubmit={handleOnSubmit}>
        <label className="flex flex-col">
          <div className="rounded-t-3xl bg-gradient-to-r from-grad-start to-grad-end p-4 text-center font-semibold sm:px-6 sm:py-5">
            Tanya apa saja berkaitan <span className="whitespace-nowrap">Koding dan Teknologi</span>
          </div>
          <div className="rounded-b-3xl bg-foreground p-4 text-background sm:px-6 sm:py-5">
            <textarea
              className="max-h-56 min-h-28 w-full resize-none bg-transparent font-semibold outline-none"
              disabled={isSubmitting}
              onInput={autoGrow}
              placeholder="Tanya soalan anda disini"
              ref={handleRef}
              {...rest}
            />
          </div>
          {errors.question && (
            <div className="flex justify-center pt-3">
              <Badge className="text-center" variant="destructive">
                {errors.question.message}
              </Badge>
            </div>
          )}
        </label>
        <button
          className="w-2/3 rounded-full bg-blue-500 bg-gradient-to-r from-grad-start to-grad-end py-3 font-medium"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Menghantar...' : 'Tanya!'}
        </button>
      </form>
      <SuccessAlert onOpenChange={handleAlertClose} text={alertText} />
    </>
  );
}
