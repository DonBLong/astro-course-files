import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  function increment() {
    setCount(count + 1);
  }

  function decrement() {
    setCount(count - 1);
  }

  return (
    <div className="flex w-1/3 justify-between mb-16">
      <button className="rounded-md bg-primary text-primary-foreground text-lg size-8" onClick={decrement}>-</button>
      <h1 className="text-3xl font-bold">Count: {count}</h1>
      <button className="rounded-md bg-primary text-primary-foreground text-lg size-8" onClick={increment}>+</button>
    </div>
  );
}
