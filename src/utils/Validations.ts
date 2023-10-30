export function LoginValidation(values: { username: string, password: string }) {
  let errors = {
    username: '',
    password: '',
    api: ''
  }

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

  if (!values.username) {
    errors.username = "Username is required";
  } else if (values.username.length < 3) {
    errors.username = "Username must be at least 3 characters long";
  }

  if (!values.password) {
    errors.password = "Password is required";
  } else if (!passwordPattern.test(values.password)) {
    errors.password = "Password must be at least 8 characters, contain one uppercase, one lowercase, and one number";
  }

  return errors
}

export function RegistrationValidation(values: {
  username: string, email: string, password: string, passwordConfirm: string
}) {
  let errors = {
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    api: ''
  };

  // Patterns
  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

  // Validations for username
  if (!values.username) {
    errors.username = "Username is required";
  } else if (values.username.length < 3) {
    errors.username = "Username must be at least 3 characters long";
  }

  // Validations for email
  if (!values.email) {
    errors.email = "Email is required";
  } else if (!emailPattern.test(values.email)) {
    errors.email = "Email address is invalid";
  }

  // Validations for password
  if (!values.password) {
    errors.password = "Password is required";
  } else if (!passwordPattern.test(values.password)) {
    errors.password = "Password must be at least 8 characters, contain one uppercase, one lowercase, and one number";
  }

  // Validations for confirm password
  if (!values.passwordConfirm) {
    errors.passwordConfirm = "Password confirmation is required";
  } else if (values.password !== values.passwordConfirm) {
    errors.passwordConfirm = "Passwords do not match";
  }

  return errors;
}

export function EditUserValidation(values: {
  id: number,
  username: string,
  email: string,
  password: string,
  passwordConfirm: string

}) {
  let errors = {
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    api: ''
  };

  // Patterns
  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

  // Validations for username
  if (!values.username) {
    errors.username = "Username is required";
  } else if (values.username.length < 3) {
    errors.username = "Username must be at least 3 characters long";
  }

  // Validations for email
  if (!values.email) {
    errors.email = "Email is required";
  } else if (!emailPattern.test(values.email)) {
    errors.email = "Email address is invalid";
  }

  // Validations for password
  if (values.password && !passwordPattern.test(values.password)) {
    errors.password = "Password must be at least 8 characters, contain one uppercase, one lowercase, and one number";
  }

  // Validations for confirm password
  if (values.password && !values.passwordConfirm) {
    errors.passwordConfirm = "Password confirmation is required";
  } else if (values.password !== values.passwordConfirm) {
    errors.passwordConfirm = "Passwords do not match";
  }

  return errors;
}
