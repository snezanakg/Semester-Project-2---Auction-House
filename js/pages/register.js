f.onsubmit = async (e) => {
  e.preventDefault(); err.textContent = "";
  const form = Object.fromEntries(new FormData(f));

  if (!form.email.endsWith("@stud.noroff.no")) {
    err.textContent = "Email must end with @stud.noroff.no";
    return;
  }

  try {
    await AuthAPI.register({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      avatar: form.avatar ? { url: form.avatar.trim() } : undefined,
    });
    location.hash = "#/login";
  } catch (e) {
    err.textContent = e.message;
  }
};
