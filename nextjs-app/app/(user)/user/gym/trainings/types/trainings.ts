export type TrainingExerciseForm = {
  exerciseId: string;
  name: string;
  weight: string;
  sets: string;
  reps: string;
};

export type TrainingFormValues = {
  date: string;
  status: "IN_PROGRESS" | "DONE" | string;
  exercises: TrainingExerciseForm[];
};