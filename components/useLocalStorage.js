import { useState, useEffect } from "react";

const getLocalStorageValue = (key, initialValue) => {
  // To fix: ReferenceError: localStorage is not defined
  if (typeof window === "undefined") {
    return initialValue;
  }

  const value = JSON.parse(localStorage.getItem(key));
  // console.log(`key: ${key}, value: ${value}, initialValue: ${initialValue}`);
  if (value !== null) {
    return value;
  }

  return initialValue;
};

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    return getLocalStorageValue(key, initialValue);
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return [value, setValue];
};
