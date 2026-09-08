
import "./inobutton.css";
import { Spinner } from "react-bootstrap";
import { useRouter } from "next/navigation";

const InoButton = ({
  children,
  title,
  isOutline,
  disabled = false,
  width,
  noBackground,
  gray,
  red,
  blue,
  lightBlue,
  green,
  height,
  buttonUrl,
  onClick,
  type,
  className,
  isLoading
}) => {
  let baseStyle = `btn ino-button`;
  const router = useRouter();
  if (className) {
    baseStyle += ` ${className}`;
  }

  let colorStyle = blue
    ? "ino-button-blue"
    : green
      ? "ino-button-green"
      : red
        ? "ino-button-red"
        : lightBlue
          ? "ino-button-lightBlue"
          : gray
            ? "ino-button-gray"
            : "";

  if (isOutline && colorStyle) {
    colorStyle += " ino-button-outline";
  } else if (isOutline && !colorStyle) {
    baseStyle += " ino-button-outline";
  } else if (noBackground && !colorStyle) {
    baseStyle += " no-background";
  }


  const inoButtonStyle = `${baseStyle} ${colorStyle}`;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    if (buttonUrl) {
      router.push(buttonUrl)
    }
  };

  return (
    <button
      disabled={disabled || isLoading}
      type={type}
      onClick={handleClick}
      className={inoButtonStyle}
      style={{ width, height }}
    >
      {isLoading && (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
          className="me-2"
        />
      )}
      {title}
      {children}
    </button>
  );
};

export default InoButton;
