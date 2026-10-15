export const CATEGORIES = ["Fashion", "Electronics", "Home", "Books"];

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
];

export const formatPrice = (value) => `₹${Number(value).toLocaleString("en-IN")}`;
