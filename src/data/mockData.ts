
export interface Inscription {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  email: string;
  telephone: string;
  atelier: string;
  preuvePaiement: string;
  dateInscription: string;
}

export const mockInscriptions: Inscription[] = [
  {
    id: "1",
    nom: "Dupont",
    prenom: "Marie",
    dateNaissance: "1995-03-15",
    email: "marie.dupont@email.com",
    telephone: "+33 6 12 34 56 78",
    atelier: "Développement Web",
    preuvePaiement: "receipt_001.pdf",
    dateInscription: "2024-05-25T10:30:00Z"
  },
  {
    id: "2",
    nom: "Martin",
    prenom: "Pierre",
    dateNaissance: "1998-07-22",
    email: "pierre.martin@email.com",
    telephone: "+33 6 98 76 54 32",
    atelier: "Intelligence Artificielle",
    preuvePaiement: "receipt_002.jpg",
    dateInscription: "2024-05-25T14:15:00Z"
  },
  {
    id: "3",
    nom: "Bernard",
    prenom: "Sophie",
    dateNaissance: "1992-11-08",
    email: "sophie.bernard@email.com",
    telephone: "+33 6 11 22 33 44",
    atelier: "Infographie",
    preuvePaiement: "receipt_003.png",
    dateInscription: "2024-05-24T16:45:00Z"
  },
  {
    id: "4",
    nom: "Dubois",
    prenom: "Antoine",
    dateNaissance: "1996-01-30",
    email: "antoine.dubois@email.com",
    telephone: "+33 6 55 44 33 22",
    atelier: "Création de Contenu",
    preuvePaiement: "receipt_004.pdf",
    dateInscription: "2024-05-24T09:20:00Z"
  },
  {
    id: "5",
    nom: "Moreau",
    prenom: "Camille",
    dateNaissance: "1994-05-12",
    email: "camille.moreau@email.com",
    telephone: "+33 6 77 88 99 00",
    atelier: "Photographie",
    preuvePaiement: "receipt_005.jpg",
    dateInscription: "2024-05-23T11:10:00Z"
  },
  {
    id: "6",
    nom: "Laurent",
    prenom: "Thomas",
    dateNaissance: "1997-09-18",
    email: "thomas.laurent@email.com",
    telephone: "+33 6 66 55 44 33",
    atelier: "Montage Vidéo",
    preuvePaiement: "receipt_006.png",
    dateInscription: "2024-05-23T15:30:00Z"
  },
  {
    id: "7",
    nom: "Simon",
    prenom: "Julie",
    dateNaissance: "1993-12-05",
    email: "julie.simon@email.com",
    telephone: "+33 6 99 88 77 66",
    atelier: "Entrepreneuriat",
    preuvePaiement: "receipt_007.pdf",
    dateInscription: "2024-05-22T13:45:00Z"
  },
  {
    id: "8",
    nom: "Garcia",
    prenom: "Lucas",
    dateNaissance: "1999-04-25",
    email: "lucas.garcia@email.com",
    telephone: "+33 6 12 21 34 43",
    atelier: "Développement Web",
    preuvePaiement: "receipt_008.jpg",
    dateInscription: "2024-05-22T08:15:00Z"
  },
  {
    id: "9",
    nom: "Robert",
    prenom: "Emma",
    dateNaissance: "1995-08-14",
    email: "emma.robert@email.com",
    telephone: "+33 6 87 65 43 21",
    atelier: "Intelligence Artificielle",
    preuvePaiement: "receipt_009.png",
    dateInscription: "2024-05-21T17:20:00Z"
  },
  {
    id: "10",
    nom: "Petit",
    prenom: "Alexandre",
    dateNaissance: "1991-10-03",
    email: "alexandre.petit@email.com",
    telephone: "+33 6 54 32 10 98",
    atelier: "Entrepreneuriat (en anglais)",
    preuvePaiement: "receipt_010.pdf",
    dateInscription: "2024-05-21T12:00:00Z"
  },
  {
    id: "11",
    nom: "Rousseau",
    prenom: "Léa",
    dateNaissance: "1996-06-27",
    email: "lea.rousseau@email.com",
    telephone: "+33 6 19 28 37 46",
    atelier: "Infographie",
    preuvePaiement: "receipt_011.jpg",
    dateInscription: "2024-05-20T14:30:00Z"
  },
  {
    id: "12",
    nom: "Vincent",
    prenom: "Hugo",
    dateNaissance: "1998-02-11",
    email: "hugo.vincent@email.com",
    telephone: "+33 6 73 82 91 05",
    atelier: "Création de Contenu",
    preuvePaiement: "receipt_012.png",
    dateInscription: "2024-05-20T10:45:00Z"
  }
];
