import { useState } from 'react';
import { Button } from '@/components/button';
import './style.css';

export function App() {
  const [message, setMessage] = useState('Ready.');

  async function sayHello() {
    setMessage('Loading…');
    try {
      const response = await fetch('/api/hello');
      if (!response.ok) throw new Error('Request failed');
      const body = await response.json();
      setMessage(body.message);
    } catch {
      setMessage('Could not reach the Go API.');
    }
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <p className="text-sm font-medium text-primary">React + Go starter</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">A small place to start.</h1>
      <p className="mt-3 text-muted-foreground">
        A React component, Tailwind styles, and a same-origin Go API.
      </p>
      <section className="mt-8 rounded-lg border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-medium">Client meets server</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Click to call the existing Go endpoint.
        </p>
        <Button className="mt-5" onClick={sayHello}>
          Call the API
        </Button>
        <output className="mt-4 block min-h-6 text-sm" aria-live="polite">
          {message}
        </output>
      </section>
    </main>
  );
}
