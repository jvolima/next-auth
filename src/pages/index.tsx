import { FormEvent, useContext, useState } from "react"
import { AuthContext } from "../contexts/AuthContext";
import styles from "../styles/home.module.css"

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn } = useContext(AuthContext)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    
    const data = {
      email,
      password
    };

    await signIn(data)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <input type="email" name="email" onChange={data => setEmail(data.target.value)}/>
      <input type="password" name="password" onChange={data => setPassword(data.target.value)} />

      <button type="submit">Enviar</button>
    </form>
  )
}
