import React from "react";
import styled from "styled-components";

const StarRating = ({ value = 0, onChange, readOnly = false, small = false }) => {
  const handleClick = (val) => {
    if (!readOnly && onChange) onChange(val);
  };
  return (
    <StarsWrapper $small={small}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          $active={value >= star}
          $small={small}
          onClick={() => handleClick(star)}
          tabIndex={readOnly ? -1 : 0}
          onKeyDown={e => {
            if (!readOnly && (e.key === "Enter" || e.key === " ")) handleClick(star);
          }}
          role={readOnly ? undefined : "button"}
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          $readOnly={readOnly}
        >
          ★
        </Star>
      ))}
    </StarsWrapper>
  );
};

export default StarRating;

const StarsWrapper = styled.div`
  display: flex;
  gap: ${({ $small }) => ($small ? "2px" : "6px")};
  margin: 6px 0 10px 0;
`;
const Star = styled.span`
  font-size: ${({ $small }) => ($small ? "1.1rem" : "1.7rem")};
  color: ${({ $active }) => ($active ? "#f7b500" : "#cfd8dc")};
  cursor: ${({ $readOnly }) => ($readOnly ? "default" : "pointer")};
  transition: color 0.2s;
  user-select: none;
  &:focus {
    outline: ${({ $readOnly }) => ($readOnly ? "none" : "2px solid #052855")};
  }
`; 