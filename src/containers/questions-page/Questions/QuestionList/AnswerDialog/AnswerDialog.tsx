import type { Question } from '@prisma/client';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { Dialog, DialogContent } from '@/components/ui/dialog';

type Props = {
  onOpenChange: (open: boolean) => void;
  question: Question | null;
};

export default function AnswerDialog(props: Readonly<Props>) {
  const { onOpenChange, question } = props;

  const [scaleRatio, setScaleRatio] = useState(1);
  const questionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleWindowResize = () => {
      const originalWidth = 512;
      const screenWidth = window.innerWidth;
      if (screenWidth < originalWidth) {
        setScaleRatio(screenWidth / originalWidth);
      }
    };

    handleWindowResize();

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  const handleSave = useCallback(() => {
    if (questionRef.current === null) return;

    toPng(questionRef.current).then(dataUrl => {
      const link = document.createElement('a');
      link.download = `tanya-koding-${question?.questionId}.png`;
      link.href = dataUrl;
      link.click();
    });
  }, [question?.questionId]);

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <Dialog onOpenChange={onOpenChange} open={question !== null}>
      <DialogContent className="pt-10">
        <div
          className="flex flex-col gap-2 rounded-2xl bg-gradient-to-r from-grad-start to-grad-end p-5"
          style={{ zoom: scaleRatio }}
        >
          <header className="flex flex-col items-center gap-2 py-2">
            <p className="text-center text-lg font-semibold text-gray-300">Soalan</p>
            <hr className="w-1/4 border-gray-300" />
            <p className="text-xl font-semibold">#TanyaKoding{question?.questionId}</p>
          </header>
          <div className="flex min-h-52 items-center justify-center rounded-xl bg-background p-7">
            <p className="text-center text-xl font-semibold">{question?.question}</p>
          </div>
          <footer className="pt-1">
            <p className="text-center">
              oleh <span className="font-bold">Primaxoft</span>
            </p>
          </footer>
        </div>
        {/* hidden for html-to-image */}
        <div className="absolute -left-[1000vw]">
          <div
            className="flex w-[29rem] flex-col gap-2 rounded-2xl bg-gradient-to-r from-grad-start to-grad-end p-5"
            ref={questionRef}
          >
            <header className="flex flex-col items-center gap-2 py-2">
              <p className="text-center text-lg font-semibold text-gray-300">Soalan</p>
              <hr className="w-1/4 border-gray-300" />
              <p className="text-xl font-semibold">#TanyaKoding{question?.questionId}</p>
            </header>
            <div className="flex min-h-52 items-center justify-center rounded-xl bg-background p-7">
              <p className="text-center text-xl font-semibold">{question?.question}</p>
            </div>
            <footer className="pt-1">
              <p className="text-center">
                oleh <span className="font-bold">Primaxoft</span>
              </p>
            </footer>
          </div>
        </div>
        <p className="text-center text-sm">Jangan lupa #TanyaKoding{question?.questionId}</p>
        <div className="flex flex-col justify-end gap-5 pt-8">
          <button
            className="rounded-full bg-gradient-to-r from-grad-start to-grad-end px-4 py-3 font-semibold"
            onClick={handleSave}
          >
            Simpan
          </button>
          <Link
            className="rounded-full bg-gradient-to-r from-grad-start to-grad-end px-4 py-3 text-center font-semibold"
            href={`https://twitter.com/intent/tweet?hashtags=TanyaKoding${question?.questionId}`}
            target="_blank"
          >
            Siar di 𝕏
          </Link>
          <button
            className="rounded-full bg-gradient-to-r from-grad-start to-grad-end px-4 py-3 font-semibold"
            onClick={handleClose}
          >
            Tutup
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
