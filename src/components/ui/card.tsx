// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Card = ({ children, className }: any) => (
  <div className={`rounded-xl border shadow-sm ${className}`}>{children}</div>
);