"use client";

export default function ConfirmDeleteButton({
  confirmText = "Are you sure you want to delete this? This can't be undone.",
  children = "Delete",
}: {
  confirmText?: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!window.confirm(confirmText)) {
          e.preventDefault();
        }
      }}
      className="text-red-700 text-sm hover:underline"
    >
      {children}
    </button>
  );
}
