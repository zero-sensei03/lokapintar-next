export interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  passwordVerification?: string;
  captchaAnswer?: string;
}

export const validateLogin = (data: {
  email?: string;
  password?: string;
  captchaAnswer?: string;
}): FormErrors => {
  const errors: FormErrors = {};

  if (!data.email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Invalid email format";
  }

  if (!data.password) {
    errors.password = "Password is required";
  } else if (data.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (!data.captchaAnswer) {
    errors.captchaAnswer = "Captcha answer is required";
  }

  return errors;
};

export const validateRegister = (data: {
  name?: string;
  email?: string;
  password?: string;
  passwordVerification?: string;
  captchaAnswer?: string;
}): FormErrors => {
  const errors = validateLogin(data);

  if (!data.name) {
    errors.name = "Full name is required";
  }

  if (!data.passwordVerification) {
    errors.passwordVerification = "Please confirm your password";
  } else if (data.password !== data.passwordVerification) {
    errors.passwordVerification = "Passwords do not match";
  }

  return errors;
};