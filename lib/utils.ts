import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleError = (error: unknown) => {
  console.log(error);
  throw new Error(typeof error === "string" ? error : JSON.stringify(error));
};

export const getDifferenceInDates = (data: Date) => {
  const createdAtDate = new Date(data);
  const currentDate = new Date();

  const differenceInMilliseconds =
    currentDate.getTime() - createdAtDate.getTime();

  const differenceInDays = differenceInMilliseconds / (1000 * 3600 * 24);

  let result;

  if (differenceInDays < 1) {
    const differenceInHours = differenceInMilliseconds / (1000 * 3600);
    result = `${Math.floor(differenceInHours)} hours ago`;
  } else if (differenceInDays > 30) {
    const differenceInMonths = differenceInDays / 30;
    result = `${Math.floor(differenceInMonths)} months ago`;
  } else {
    result = `${Math.floor(differenceInDays)} days ago`;
  }

  return result;
};

export function formatDate(dateString : string) {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    
    const date = new Date(dateString);
    const monthName = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return `${monthName} ${day}, ${year}`;
}
