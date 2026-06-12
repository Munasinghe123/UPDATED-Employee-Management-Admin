import { forwardRef } from 'react';
import { CalendarDays } from 'lucide-react';

const DateInput = forwardRef(({ value, onClick, placeholderText }, ref) => (
  <div
    onClick={onClick}
    ref={ref}
    className="flex items-center gap-2 border border-[#7C3AED]/50 rounded-2xl py-2 px-4 bg-transparent w-44 cursor-pointer"
  >
    <CalendarDays className="w-4 h-4 text-[#7C3AED] shrink-0" />
    <div className="w-px h-4 bg-[#7C3AED]/60" />
    <span className={`text-sm ${value ? 'text-white' : 'text-gray-500'}`}>
      {value || placeholderText}
    </span>
  </div>
));

DateInput.displayName = 'DateInput';

export default DateInput;