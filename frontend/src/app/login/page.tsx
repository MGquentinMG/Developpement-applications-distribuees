import { LoginForm } from '../../src/components/LoginCard/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      
      
      {/* Conteneur pour centrer la carte */}
      <main className="flex-1 flex items-center justify-center p-4">
        <LoginForm />
      </main>
    </div>
  );
}