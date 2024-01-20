import Link from 'next/link';
import type { Question } from '@prisma/client';
import { ms } from 'date-fns/locale';
import { format, formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type Props = {
  onAnswer: (question: Question) => () => void;
  question: Question;
};

export default function QuestionItem(props: Readonly<Props>) {
  const { onAnswer, question } = props;

  const askedOn = {
    datetime: format(question.askedOn, 'EEEE, d MMM yyyy, HH:mm z', { locale: ms }),
    relative: formatDistanceToNow(question.askedOn, { locale: ms }),
  };

  return (
    <li>
      <Card>
        <CardHeader className="p-3">
          <CardTitle className="text-center text-lg">Soalan #{question.questionId}</CardTitle>
          <CardDescription className="text-center">{askedOn.datetime}</CardDescription>
          <CardDescription className="text-center">({askedOn.relative} lalu)</CardDescription>
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
            onClick={onAnswer(question)}
            type="button"
          >
            Jawab
          </button>
        </CardFooter>
      </Card>
    </li>
  );
}
