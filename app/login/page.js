"use client";
import { useState } from "react";
import { supabase } from "@/Lib/supabase";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Invalid login credentials");
    } else {
      router.push("/admin"); // Send them to the dashboard
    }
  };

  return (
    <main className="bg-light min-vh-100">
      <Navbar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-4 mt-5">
              <h2 className="fw-bold text-center mb-4">Admin <span className="text-gold">Login</span></h2>
              {error && <div className="alert alert-danger p-2 small text-center">{error}</div>}
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Email Address</label>
                  <input 
                    type="email" className="form-control" required 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label small fw-bold">Password</label>
                  <input 
                    type="password" className="form-control" required 
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                </div>
                <button type="submit" className="btn btn-gold w-100 fw-bold py-2">Sign In</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}