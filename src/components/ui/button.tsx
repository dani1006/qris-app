// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Button = ({ className, ...props }: any) => (
  <button className={`inline-flex items-center justify-center rounded-md font-medium transition-colors ${className}`} {...props} />
);