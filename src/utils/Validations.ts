export function LoginValidation(values: { username: string, password: string }) {
  const errors = {
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
  const errors = {
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
  const errors = {
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

export function CategoryCreateValidation(values: {
  name: string,
  userId: number
}) {
  const errors = {
    name: '',
    userId: '',
    api: ''
  };

  // Validations for name
  if (!values.name) {
    errors.name = "Name is required";
  }

  // Validations for user
  if (!values.userId) {
    errors.userId = "Something Broke: Please log out and back in";
  }
  return errors;
}

export function TaskCreateValidation(values: {
  name: string,
  userId: number,
  categoryId: number
}) {
  const errors = {
    name: '',
    userId: '',
    categoryId: '',
    api: ''
  };

  // Validations for name
  if (!values.name) {
    errors.name = "Name is required";
  }

  // Validations for user
  if (!values.userId) {
    errors.userId = "Something Broke: Please log out and back in";
  }

  // Validations for category
  if (!values.categoryId) {
    errors.categoryId = "Something Broke: Somehow there isnt a Category for this task";
  }

  return errors;
}

export function TaskCatValidation(values: {
  categoryId: number
  newCatId: number
}) {
  const errors = {
    categoryId: '',
  };

  // Validations for category
  if (!values.categoryId) {
    errors.categoryId = "Something Broke: Somehow there isnt a Category for this task";
  }
  if (!values.newCatId) {
    errors.categoryId = "Something Broke: There isnt a new category to switch to";
  }
  if (values.categoryId === values.newCatId) {
    errors.categoryId = "You cant change the category to the same thing"
  }

  return errors;
}
