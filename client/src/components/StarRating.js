import React, { useState } from 'react';
import PropTypes from 'prop-types';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

const StarRating = ({ field, form }) => {
  const [hovered, setHovered] = useState(null);
  const rating = field.value;

  const handleClick = (value) => {
    form.setFieldValue(field.name, value);
  };

  const handleMouseEnter = (value) => {
    setHovered(value);
  };

  const handleMouseLeave = () => {
    setHovered(null);
  };

  const renderStar = (index) => {
    const starValue = index + 1;
    const valueToDisplay = hovered !== null ? hovered : rating;

    return valueToDisplay >= starValue ? (
      <StarIcon key={index} />
    ) : (
      <StarBorderIcon key={index} />
    );
  };

  return (
    <div
      style={{ display: 'flex', cursor: 'pointer' }}
      onMouseLeave={handleMouseLeave}
    >
      {[0, 1, 2, 3, 4].map((index) => (
        <div
          key={index}
          onClick={() => handleClick(index + 1)}
          onMouseEnter={() => handleMouseEnter(index + 1)}
          style={{ marginRight: 4 }}
        >
          {renderStar(index)}
        </div>
      ))}
    </div>
  );
};

StarRating.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
};

export default StarRating;
