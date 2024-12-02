import PropTypes from "prop-types";

const Heading = ({
  as: Component = "h1",
  children,
  className,
  ...restProps
}) => {
  return (
    <Component className={className} {...restProps}>
      {children}
    </Component>
  );
};

Heading.propTypes = {
  as: PropTypes.elementType,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Heading;
