import { prisma } from '@/db/db';
import QuestionList from '@/containers/questions-page/QuestionList';

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
    throw new Error('Gagal mendapatkan senarai soalan.');
  }
}

export default async function SenaraiSoalan() {
  const questions = await getQuestions();

  return (
    <main className="mx-auto flex w-full max-w-xl flex-grow flex-col items-center justify-center gap-8 px-6 py-10">
      <h1 className="text-3xl font-bold">Senarai Soalan</h1>
      <QuestionList questions={questions} />
    </main>
  );
}
