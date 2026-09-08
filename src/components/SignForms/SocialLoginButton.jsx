import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import styles from './SocialLoginButton.module.css';

const PROVIDERS = {
  google: {
    label: 'Sign in with Google',
    icon: FcGoogle,
  },
  apple: {
    label: 'Sign in with Apple',
    icon: FaApple,
  },
};

export default function SocialLoginButton({ provider = 'google', onClick, disabled = false, loading = false, labelText }) {
  const config = PROVIDERS[provider];

  if (!config) return null;

  return (
    <button
      className={`${styles.btn} ${styles[provider]} ${loading ? styles.loading : ''}`}
      onClick={onClick}
      disabled={disabled || loading}
      type="button"
    >
      <span className={styles.iconWrap}>
        {loading ? (
          <span className={styles.spinner} />
        ) : (
          <config.icon size={24} />
        )}
      </span>
      <span className={styles.label}>{labelText || config.label}</span>
    </button>
  );
}