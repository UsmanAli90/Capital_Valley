import PropTypes from "prop-types";

const shapes = {
  round: "rounded-md",
  circle: "rounded-[50%]",
};

const variants = {
  fill: {
    blue_A400: "bg-blue-a400 text-white-a700",
    white_A700: "bg-white-a700 shadow-sm",
  },
};

const sizes = {
  sm: "h-[36px] px-6 text-[14px]",
  xs: "h-[24px] px-1",
};

const Button = ({
  children,
  className = "",
  leftIcon,
  rightIcon,
  shape = "round",
  variant = "fill",
  size = "sm",
  ...restProps
}) => {
  const shapeClass = shapes[shape];
  const variantClass = variants[variant];
  const sizeClass = sizes[size];

  return (
    <button
      className={`${shapeClass} ${variantClass} ${sizeClass} ${className}`}
      {...restProps}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  shape: PropTypes.oneOf(["round", "circle"]),
  variant: PropTypes.oneOf(["fill"]),
  size: PropTypes.oneOf(["sm", "xs"]),
};

export default Button;
