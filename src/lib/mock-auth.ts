import { User } from "@/lib/types";

const mockUser: User = {
  id: "1",
  name: "Test User",
  email: process.env.NEXT_PUBLIC_TEST_USER_EMAIL ?? "",
  avatar:
    "https://images.unsplash.com/photo-1675095680984-0b5a8b1e6c4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fG1lbnxlbnwwfHx8fDE2ODQ3MTg3NjE&ixlib=rb-4.0.3&q=80&w=400",
  role: "pharmacist",
};

export const mockAuth = {
  validateCredentials: (email: string, password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isValid =
          email === process.env.NEXT_PUBLIC_TEST_USER_EMAIL &&
          password === process.env.NEXT_PUBLIC_TEST_USER_PASSWORD;
        resolve(isValid);
      }, 1000);
    });
  },

  getMockUser: () => mockUser,
};
