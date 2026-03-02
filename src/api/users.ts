export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  birthDate: string;
  login: Record<string, unknown>;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: { lat: string; lng: string };
  };
  phone: string;
  website: string;
  company: { name: string; catchPhrase: string; bs: string };
}

export async function getUsers() {
  const res = await fetch("https://jsonplaceholder.org/users");
  const users: User[] = await res.json();
  return users.map(user => ({ ...user, id: user.id.toString(), name: `${user.firstname} ${user.lastname}` }));
}
