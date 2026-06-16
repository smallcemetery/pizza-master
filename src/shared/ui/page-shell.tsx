import { cn } from '@/shared/lib/utils';

type ShellProps = {
  children: React.ReactNode;
  className?: string;
};

export const PageShell = ({ children, className }: ShellProps) => (
  <div
    className={cn(
      'w-full min-h-screen bg-[#e8d8c9] py-5 sm:py-8 md:py-12 px-3 sm:px-6 md:px-10 lg:px-16 xl:px-24',
      className,
    )}>
    <div className='max-w-[900px] mx-auto w-full flex flex-col gap-5 sm:gap-6 md:gap-8 min-w-0'>{children}</div>
  </div>
);

export const PageCard = ({ children, className }: ShellProps) => (
  <div
    className={cn(
      'bg-white rounded-xl sm:rounded-[15px] border border-black p-4 sm:p-6 md:p-8 shadow-grow w-full min-w-0',
      className,
    )}>
    {children}
  </div>
);

export const PageCardAccent = ({ children, className }: ShellProps) => (
  <div
    className={cn(
      'bg-[#FFF3E6] rounded-xl sm:rounded-[15px] border border-black p-4 sm:p-5 md:p-6 w-full min-w-0',
      className,
    )}>
    {children}
  </div>
);
