"use client";
import { FormEventHandler, useState } from "react";
import { useRouter } from "next/navigation";
import { usePocketBase } from "@/library/hooks/pocketbase";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  const { login } = usePocketBase();

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const loggedIn = await login(formData.email, formData.password);

    if (loggedIn) {
      router.push("/");
      return;
    }

    alert("Invalid credentials");

    return false;
  };

  return (
    <div>
      <form onSubmit={onSubmit} className="md:w-1/2 mx-auto">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-primary">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
