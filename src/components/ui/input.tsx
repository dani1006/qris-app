// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Input = ({ className, ...props }: any) => (
  <input className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ${className}`} {...props} />
);