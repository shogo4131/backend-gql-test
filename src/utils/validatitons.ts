// TODO: zodに置き換えたい

/**
 * ユーザー登録バリデーション
 * @param username
 * @param email
 * @param password
 * @param confirmPassword
 */
export const vaidationRegisterInput = (
  username: string,
  email: string,
  password: string,
  confirmPassword: string
) => {
  const errors = { username: "", email: "", password: "", confirmPassword: "" };

  if (username.trim() === "") {
    errors.username = "ユーザーネームを入力してください。";
  }

  if (email.trim() === "") {
    errors.email = "メールアドレスを入力してください。";
  } else {
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z]*@[0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

    if (!email.match(regEx)) {
      errors.email = "メールアドレスが有効ではありません。";
    }
  }

  if (password === "") {
    errors.password = "パスワードを入力してください。";
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = "パスワードが一致しません。";
  }

  const isError =
    !errors.username &&
    !errors.email &&
    !errors.password &&
    !errors.confirmPassword;

  return { errors, valid: isError };
};
