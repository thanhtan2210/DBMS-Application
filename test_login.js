async function login() {
  try {
    const res = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'alice@email.com', password: '123456' })
    });
    const data = await res.json();
    console.log("STATUS:", res.status);
    console.log("BODY:", data);
  } catch (err) {
    console.error(err);
  }
}
login();
