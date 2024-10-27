import { Subject } from "entities/subject";

export const getGreeting = (subject: Subject): string => {
  return `Hello, ${subject.name}!`;
};
