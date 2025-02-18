export const formatString = (str) => {
  return str
    .split("_") // Divide el string en partes donde hay guiones bajos
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Convierte la primera letra de cada palabra en mayúscula
    .join(" "); // Une las palabras con un espacio
};
