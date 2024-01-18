import QuestionList from './QuestionList';
import { prisma } from '@/db/db';

// TODO: Temporary solve for Vercel trailing slash revalidation issue
export const revalidate = 0;

async function getQuestions() {
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
}

export default async function Questions() {
  const questions = await getQuestions();

  return <QuestionList questions={questions} />;
}
