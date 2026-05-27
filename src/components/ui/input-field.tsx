import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

type Props = {
  label: string;
  desc: string;
  placeholder: string;
  errorMessage?: string;
};

export function InputField({ label, desc, placeholder, errorMessage, ...registerProps }: Props) {
  return (
    <Field>
      <FieldLabel htmlFor='input-field-username'>{label}</FieldLabel>
      <Input id='input-field-username' type='text' placeholder={placeholder} {...registerProps} />
      <FieldDescription>{desc}</FieldDescription>
      {errorMessage && <span className='text-red-500 text-sm'>{errorMessage}</span>}
    </Field>
  );
}
