import { cva } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-cyan disabled:opacity-70 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-cyan text-deepBlue hover:opacity-90',
        orange: 'bg-orange text-deepBlue hover:opacity-90',
        outline: 'border border-white/20 hover:border-white/40',
        ghost: 'hover:bg-white/5',
      },
      size: {
        sm: 'h-8 px-3',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
);

export default function Button({ className, variant, size, ...props }) {
  return <button className={twMerge(buttonVariants({ variant, size }), className)} {...props} />;
}
