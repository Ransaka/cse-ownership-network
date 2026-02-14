function TestApp() {
  return (
    <div style={{ padding: '20px', color: 'white', background: '#0a0e27', minHeight: '100vh' }}>
      <h1>Test App - React is Working!</h1>
      <p>If you see this, React is rendering correctly.</p>
      <p>Now checking Tailwind...</p>
      <div className="bg-primary-500 text-white p-4 rounded-lg mt-4">
        If this box is INDIGO/PURPLE, Tailwind is working!
      </div>
    </div>
  );
}

export default TestApp;
