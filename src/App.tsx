import './output.css';
import React from 'react';

function MyButton({ title }: { title: string }) {
  return (
    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
      {title}
    </button>
  );
}

export default function MyApp() {
  return (
    <div className="p-8">
      <h1 className="bg-blue-500 text-white text-3xl font-bold p-4 rounded">Recallr</h1>
      <MyButton title="Click me" />
    </div>
  );
}
