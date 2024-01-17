import type { Metadata } from 'next';
import Link from 'next/link';
import QuestionForm from '@/containers/home-page/QuestionForm';

export const metadata: Metadata = {
  description: 'Platform untuk bertanya apa saja berkaitan koding',
  title: 'Tanya Koding',
};

export default function Home() {
  return (
    <main className="mx-auto flex max-w-xl flex-grow flex-col items-center justify-center gap-8 px-6">
      <h1 className="text-3xl font-bold">Tanya Koding</h1>
      <QuestionForm />
      <Link className="font-semibold" href="/senarai-soalan/">
        Senarai soalan -&gt;
      </Link>
    </main>
  );
}
