"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// import styles from "../page.module.css";
import Link from "next/link";
// import Image from "next/image";

export default function Register() {
  // State for form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Additional state for password validation criteria
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Additional password validation logic
    if (e.target.name === "password") {
      const { value } = e.target;
      const validation = {
        minLength: value.length >= 16,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /[0-9]/.test(value),
        specialChar: /[^A-Za-z0-9]/.test(value),
      };
      setPasswordValidation(validation);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all password validation criteria are met
    const allCriteriaMet = Object.values(passwordValidation).every(Boolean);

    if (!allCriteriaMet) {
      // If not all criteria are met, alert the user and stop the form submission
      alert("Password does not meet all criteria.");
      return; // Stop the form submission
    }
    // If all criteria are ment, continue with form submission
    const response = await fetch("api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    console.log("Response:", response);
    const text = await response.text();
    console.log("Response text:", text);

    if (response.ok) {
      // Handle successful registration, such as redirecting to login page
      router.push("/");
    } else {
      const errorData = JSON.parse(text);
      console.error("Registration error:", errorData);
      // Optionally display the error to the user
    }
  };

  return (
    <div>
      <header>
        <nav>
          <ul>
            {/* <Image src={`/images/logo2.webp`} alt="Logo" width={50} height={50} /> */}
            <li>
              <Link href="/">Home</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="name"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="password"
            onChange={handleChange}
            required
          />
          <div>
            {!passwordValidation.minLength && (
              <p>Password must have at least 16 characters</p>
            )}
            {!passwordValidation.uppercase && (
              <p>Include an UPPERCASE letter</p>
            )}
            {!passwordValidation.lowercase && <p>Also a lowercase letter</p>}
            {!passwordValidation.number && <p>Add a numb3r</p>}
            {!passwordValidation.specialChar && <p>And a $pecial character!</p>}
          </div>
          <button
            type="submit"
            disabled={!Object.values(passwordValidation).every(Boolean)}
          >
            Create Account
          </button>
        </form>
      </main>
    </div>
  );
}
