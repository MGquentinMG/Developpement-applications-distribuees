import { LoginForm } from '../../components/LoginCard/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] transition-colors duration-300 flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}