import PropTypes from "prop-types";

const Img = ({
  src = "defaultNoData.png",
  alt = "testImg",
  className,
  ...restProps
}) => {
  return <img src={src} alt={alt} className={className} {...restProps} />;
};

Img.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
};

export default Img;
