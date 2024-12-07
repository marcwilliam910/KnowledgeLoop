import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Button} from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {deleteQuiz} from "@/api/quiz";
import {errorToast, successToast} from "@/toast";

type DeleteDialogProps = {
  isOpen: boolean;
  openChange: (isOpen: boolean) => void;
  selectedQuiz: string;
  selectedSubject: string;
};

export default function DeleteDialog({
  isOpen,
  openChange,
  selectedQuiz,
  selectedSubject,
}: DeleteDialogProps) {
  const queryClient = useQueryClient();

  const {mutate, isPending} = useMutation({
    mutationFn: deleteQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["subjects"]});
      successToast("Quiz deleted successfully.");
      openChange(false);
    },
    onError: (error: any) => {
      errorToast(error.response?.data.error || "Failed to delete quiz.");
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="md:text-2xl">Delete Quiz</DialogTitle>
          <DialogDescription className="md:text-lg">
            Are you sure you want to delete this quiz?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => openChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => mutate({selectedQuiz, selectedSubject})}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
