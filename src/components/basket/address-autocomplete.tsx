'use client';

import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export const AddressAutocomplete = ({ value, onChange, placeholder, className }: Props) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = (query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await axios.get<string[]>('/api/address-suggest', {
          params: { q: query },
        });
        setSuggestions(data);
        setOpen(data.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 350);
  };

  const handleChange = (next: string) => {
    onChange(next);
    fetchSuggestions(next);
  };

  const pick = (address: string) => {
    onChange(address);
    setSuggestions([]);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className='relative w-full'>
      <Input
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder={placeholder ?? 'г. Оренбург ул. Орлова 5'}
        className={className}
        autoComplete='street-address'
      />
      {loading && (
        <p className='text-[10px] text-gray-500 mt-1 px-0.5'>Подбираем адрес…</p>
      )}
      {open && suggestions.length > 0 && (
        <ul className='absolute z-30 left-0 right-0 top-full mt-1 bg-white border border-black rounded-lg shadow-lg max-h-[180px] overflow-y-auto'>
          {suggestions.map((s, i) => (
            <li key={i}>
              <button
                type='button'
                onClick={() => pick(s)}
                className='w-full text-left text-[11px] sm:text-xs px-2.5 py-2 hover:bg-[#FFF3E6] border-b border-black/10 last:border-0 cursor-pointer line-clamp-2'>
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
