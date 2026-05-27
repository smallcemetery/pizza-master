/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/ui/input-field';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod/v4';
import { useReg } from '../hooks/useReg';

type Inputs = {
  desc: string;
  placeholder: string;
  id: number;
  name: keyof RegisterFormType;
  label: string;
};

const Inputs: Inputs[] = [
  {
    id: 1,
    name: 'email',
    desc: 'enter your email for create accaunt.',
    placeholder: 'enter your email',
    label: 'Email',
  },
  {
    id: 2,
    name: 'password',
    desc: 'enter yout password for create accaunt.',
    placeholder: 'enter your password',
    label: 'Password',
  },
];

const RegisterFormShema = z.object({
  email: z.email({ message: 'Некорректный email', pattern: z.regexes.html5Email }),
  password: z
    .string()
    .min(8, { message: 'Пароль должен содержать минимум 8 символов' })
    .regex(/[0-9]/, { message: 'Пароль должен содержать хотя бы одну цифру' }),
});

type RegisterFormType = z.infer<typeof RegisterFormShema>;

export const RegForm = () => {
  const { mutate } = useReg();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormType>({
    resolver: zodResolver(RegisterFormShema),
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: any) => {
    mutate(data);
  };

  return (
    <form className='w-full px-[20px] py-[20px] flex flex-col gap-[25px] items-center' onSubmit={handleSubmit(onSubmit)} noValidate>
      {Inputs.map(({ id, name, desc, placeholder, label }) => (
        <InputField
          key={id}
          label={label}
          desc={desc}
          placeholder={placeholder}
          {...register(name as keyof RegisterFormType)}
          errorMessage={errors[name]?.message}
        />
      ))}
      <Button type='submit' className='w-[200px] px-[15px] h-[35px] border border-black cursor-pointer hover:border-2'>
        Create
      </Button>
    </form>
  );
};
