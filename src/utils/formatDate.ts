// export const formatDate = (date: Date): string => {
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "2-digit",
//       year: "numeric",
//     });
//   };
export const formatDate = (date: string | Date): string => {
  const validDate = typeof date === "string" ? new Date(date) : date;
  return validDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};