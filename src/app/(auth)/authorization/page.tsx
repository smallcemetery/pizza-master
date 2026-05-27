import { AuthModule } from '@/src/modules/auth/module';

export default function AuthPage() {
  return (
    <div className='w-full h-screen flex'>
      <AuthModule />
    </div>
  );
}
