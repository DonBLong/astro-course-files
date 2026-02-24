export interface Contact {
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

export async function getContacts(): Promise<Contact[]> {
  const res = await fetch("https://jsonplaceholder.org/users");
  return await res.json();
}
