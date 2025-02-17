"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import styles from "./loginRegister.module.css";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("All fields are necessary.");
      return;
    }

    try {
      const resUserExists = await fetch("api/userExist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const { user } = await resUserExists.json();

      if (user.exists) {
        setError("User already exists.");
        return;
      }

      const res = await fetch("api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role
        }),
      });

      if (res.ok) {
        const form = e.target;
        form.reset();
          
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (result.error) {
          setError(result.error);
        } else {
          router.push("/board"); 
        }
        } else {
          console.log("User registration failed.");
        }
    } catch (error) {
      console.log("Error during registration: ", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <h1>Register</h1>

        <form onSubmit={handleSubmit}>
          <div className={styles.labelContainer}>
          <label >
                Name: 
            </label>
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Name"
          />
          </div>
          <div className={styles.labelContainer}>
          <label >
                Email: 
            </label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Email"
          />
          </div>
          <div className={styles.labelContainer}>
          <label >
                Password:
            </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />
          </div>
          <div className={styles.labelContainer}>
          <label >
                Role:
            </label>
          <input
            onChange={(e) => setRole(e.target.value)}
            type="role"
            placeholder="Role"
          />
          </div>
          <div className={styles.wrap}>
            <button>
              Sign up
            </button>
          </div>
      
          {error && (
            <div >
              {error}
            </div>
          )}

          <Link className="" href={"/"}>
            Already have an account? <span className="underline">Login</span>
          </Link>
        </form>
      </div>
    </div>
  );
}