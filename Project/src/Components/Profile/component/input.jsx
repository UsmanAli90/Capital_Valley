import PropTypes from 'prop-types';

const Input = ({ type, name, defaultValue, className }) => {
  return (
    <input
      type={type}
      name={name}
      defaultValue={defaultValue}
      className={`text-[14px] font-normal text-blue_gray-700 ${className}`}
    />
  );
};

Input.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  className: PropTypes.string,
};

export default Input;
