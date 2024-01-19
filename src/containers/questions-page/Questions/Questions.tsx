import QuestionList from './QuestionList';
import { prisma } from '@/db/db';
import { cache } from '@/lib/cache';

const getQuestions = cache(
  async () => {
    try {
      return await prisma.question.findMany({
        orderBy: {
          askedOn: 'desc',
        },
        take: 10,
      });
    } catch (error) {
      console.log(error);
      return [];
    }
  },
  ['questions'],
  {
    tags: ['questions'],
  }
);

export default async function Questions() {
  const questions = await getQuestions();

  return <QuestionList questions={questions} />;
}
