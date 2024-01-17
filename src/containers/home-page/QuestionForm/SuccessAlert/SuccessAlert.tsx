import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type Props = {
  onOpenChange: (open: boolean) => void;
  text: string | null;
};

export default function SuccessAlert(props: Readonly<Props>) {
  const { onOpenChange, text } = props;

  return (
    <AlertDialog onOpenChange={onOpenChange} open={text !== null}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Kamu nanya?</AlertDialogTitle>
          <AlertDialogDescription>{text}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col">
          <AlertDialogAction>Beres</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
