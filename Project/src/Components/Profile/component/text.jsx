import PropTypes from "prop-types";

const Text = ({ as: Component = "p", children, className, ...restProps }) => {
  return (
    <Component className={className} {...restProps}>
      {children}
    </Component>
  );
};

Text.propTypes = {
  as: PropTypes.elementType,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Text;
