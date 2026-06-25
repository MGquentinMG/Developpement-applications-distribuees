import { useState, FormEvent, ChangeEvent } from "react";

export function useLoginForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleIdentifierClick = () => setStep(2);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return { step, email, setEmail, password, setPassword, handleIdentifierClick, handleSubmit };
}

export function useRegisterForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleEmailClick = () => setStep(2);

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    setter(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!acceptTerms) return;
  };

  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

  return {
    step, pseudo, setPseudo, email, setEmail, password, setPassword,
    day, setDay, month, setMonth, year, setYear, acceptTerms, setAcceptTerms,
    months, handleEmailClick, handleSelectChange, handleSubmit
  };
}