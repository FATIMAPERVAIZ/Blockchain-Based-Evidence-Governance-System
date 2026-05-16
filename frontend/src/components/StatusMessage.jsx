export default function StatusMessage({ status }) {
  if (!status.msg) return null;

  const cls =
    status.type === "success"
      ? "status success"
      : status.type === "error"
      ? "status error"
      : "status loading";

  return (
    <div className={cls}>
      {status.type === "loading" && <span className="spinner" />}
      <span>{status.msg}</span>
    </div>
  );
}