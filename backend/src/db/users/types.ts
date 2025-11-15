export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipcode: string;
  };
}

export interface UserRow {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
}