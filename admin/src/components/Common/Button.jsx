const VARIANT_CLASS = {
  primary: "",
  secondary: "secondary",
  danger: "link danger",
  link: "link",
  success: "success",
  outline: "outline",
};

export default function Button({
  variant = "primary",
  type = "button",
  className = "",
  disabled = false,
  loading = false,
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      className={`${VARIANT_CLASS[variant] || ""} ${className}`.trim()}
      disabled={disabled || loading}
      {...rest}
    >
      {children}
    </button>
  );
}
