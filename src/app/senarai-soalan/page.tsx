import { Suspense } from 'react';
import Questions, { QuestionsLoading } from '@/containers/questions-page/Questions';

export const revalidate = 0;

export default async function SenaraiSoalan() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-grow flex-col items-center justify-center gap-8 px-6 py-10">
      <h1 className="text-3xl font-bold">Senarai Soalan</h1>
      <Suspense fallback={<QuestionsLoading />}>
        <Questions />
      </Suspense>
    </main>
  );
}
