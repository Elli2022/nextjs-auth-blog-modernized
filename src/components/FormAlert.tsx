type FormAlertProps = {
  message: string;
  variant: "success" | "error" | "info";
};

export default function FormAlert({ message, variant }: FormAlertProps) {
  const styles =
    variant === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
      : variant === "error"
        ? "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
        : "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300";

  return (
    <p className={`mt-4 rounded-lg border px-3 py-2 text-sm ${styles}`}>
      {message}
    </p>
  );
}
