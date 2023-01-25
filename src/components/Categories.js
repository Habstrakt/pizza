import React, { useState } from "react";

function Categories({ onChangeCategory, value }) {
  const сategoryes = [
    "Все",
    "Мясные",
    "Вегетарианская",
    "Гриль",
    "Острые",
    "Закрытые",
  ];

  return (
    <div className="categories">
      <ul>
        {сategoryes.map((category, index) => (
          <li
            key={category}
            onClick={() => onChangeCategory(index)}
            className={value === index ? "active" : ""}
          >
            {category}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Categories;
