
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Eye, Download, Filter, Loader2 } from "lucide-react";
import { useInscriptions } from "@/hooks/useInscriptions";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';
import { supabase } from "@/lib/supabase";

interface InscriptionWithAteliers {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  date_naissance: string;
  preuve_url: string;
  valide: boolean;
  created_at: string;
  ateliers: { id: string; nom: string }[];
}

export function InscriptionsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorkshop, setSelectedWorkshop] = useState("");
  const { inscriptions, loading, error, updateInscriptionStatus } = useInscriptions();

  const workshops = [
    { id: 'web', nom: 'Développement Web' },
    { id: 'ai', nom: 'Intelligence Artificielle' },
    { id: 'design', nom: 'Infographie' },
    { id: 'content', nom: 'Création de Contenu' },
    { id: 'video', nom: 'Montage Vidéo' },
    { id: 'entrepreneur', nom: 'Entrepreneuriat' },
    { id: 'entrepreneur-en', nom: 'Entrepreneuriat (en anglais)' }
  ];

  const filteredInscriptions = inscriptions.filter((inscription) => {
    if (!searchTerm) {
      return selectedWorkshop === "" || 
        (inscription.ateliers && inscription.ateliers.some((a) => a.id === selectedWorkshop));
    }
    
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (inscription.nom?.toLowerCase().includes(searchLower) ||
      inscription.prenom?.toLowerCase().includes(searchLower) ||
      inscription.email?.toLowerCase().includes(searchLower) ||
      (inscription.telephone?.includes && inscription.telephone.includes(searchTerm)));
    
    if (selectedWorkshop === "") {
      return matchesSearch;
    }
    
    return matchesSearch && 
      (inscription.ateliers && inscription.ateliers.some((a) => a.id === selectedWorkshop));
  });

  const handleViewPayment = (fileName: string) => {
    console.log("Viewing payment proof:", fileName);
    // In a real app, this would open the file
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Inscriptions</h2>
        <p className="text-gray-600 mt-2">Gestion de toutes les inscriptions au Summer Camp</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle>Liste des Inscriptions</CardTitle>
              <CardDescription>
                {filteredInscriptions.length} inscription(s) trouvée(s)
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Exporter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Rechercher..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedWorkshop}
                onChange={(e) => setSelectedWorkshop(e.target.value)}
              >
                <option value="">Tous les ateliers</option>
                {workshops.map((workshop) => (
                  <option key={workshop.id} value={workshop.id}>
                    {workshop.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Participant</th>
                  <th className="text-left p-4 font-medium">Contact</th>
                  <th className="text-left p-4 font-medium">Date de naissance</th>
                  <th className="text-left p-4 font-medium">Atelier</th>
                  <th className="text-left p-4 font-medium">Date d'inscription</th>
                  <th className="text-left p-4 font-medium">Paiement</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInscriptions.map((inscription) => (
                  <tr key={inscription.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{inscription.prenom} {inscription.nom}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm">{inscription.email}</p>
                        <p className="text-sm text-gray-600">{inscription.telephone}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm">
                        {inscription.date_naissance ? format(new Date(inscription.date_naissance), 'PPP', { locale: fr }) : 'N/A'}
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {(() => {
                          console.log('Inscription ateliers:', inscription.id, inscription.ateliers);
                          return null;
                        })()}
                        {inscription.ateliers && Array.isArray(inscription.ateliers) && inscription.ateliers.length > 0 ? (
                          inscription.ateliers.map((atelier) => {
                            console.log('Atelier:', atelier);
                            return (
                              <Badge 
                                key={atelier.id} 
                                variant="secondary" 
                                className="text-xs"
                              >
                                {atelier.nom || `Atelier ID: ${atelier.id}`}
                              </Badge>
                            );
                          })
                        ) : (
                          <span className="text-xs text-gray-500">
                            {inscription.ateliers === undefined ? 'Chargement...' : 'Aucun atelier'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm">
                        {format(new Date(inscription.created_at), 'PPP', { locale: fr })}
                      </p>
                    </td>
                    <td className="p-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (inscription.preuve_url) {
                            // Construct the full URL to the file in Supabase storage
                            const filePath = inscription.preuve_url;
                            const { data: { publicUrl } } = supabase.storage
                              .from('preuves')
                              .getPublicUrl(filePath);
                            window.open(publicUrl, '_blank');
                          }
                        }}
                        className="text-xs"
                        disabled={!inscription.preuve_url}
                      >
                        {inscription.preuve_url ? 'Voir preuve' : 'Aucune preuve'}
                      </Button>
                    </td>
                    <td className="p-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Eye className="h-3 w-3" />
                            Détails
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Détails de l'inscription</DialogTitle>
                            <DialogDescription>
                              Informations complètes du participant
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 py-4">
                            <div>
                              <h4 className="font-medium mb-2">Informations personnelles</h4>
                              <div className="space-y-2 text-sm">
                                <p><strong>Nom:</strong> {inscription.nom}</p>
                                <p><strong>Prénom:</strong> {inscription.prenom}</p>
                                <p><strong>Date de naissance:</strong> {inscription.date_naissance ? format(new Date(inscription.date_naissance), 'PPP', { locale: fr }) : 'N/A'}</p>
                                <p><strong>Email:</strong> {inscription.email}</p>
                                <p><strong>Téléphone:</strong> {inscription.telephone}</p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Inscription</h4>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <strong>Ateliers choisis:</strong>
                                  {inscription.ateliers?.length > 0 ? (
                                    <ul className="list-disc pl-5 mt-1 space-y-1">
                                      {inscription.ateliers.map((atelier) => (
                                        <li key={atelier.id} className="text-sm">
                                          {atelier.nom || `Atelier ID: ${atelier.id}`}
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="text-sm text-gray-500 mt-1">Aucun atelier sélectionné</p>
                                  )}
                                </div>
                                <p><strong>Date d'inscription:</strong> {format(new Date(inscription.created_at), 'PPPpp', { locale: fr })}</p>
                                <div className="flex items-center">
                                  <strong>Statut:</strong>
                                  <Badge 
                                    variant={inscription.valide ? 'default' : 'secondary'} 
                                    className={`ml-2 ${inscription.valide ? 'bg-green-500 hover:bg-green-600' : ''}`}
                                  >
                                    {inscription.valide ? 'Validé' : 'En attente'}
                                  </Badge>
                                </div>
                                <div className="flex items-center">
                                  <strong>Preuve de paiement:</strong>
                                  {inscription.preuve_url ? (
                                    <Button
                                      variant="link"
                                      size="sm"
                                      className="h-auto p-0 ml-2"
                                      onClick={() => {
                                        const { data: { publicUrl } } = supabase.storage
                                          .from('preuves')
                                          .getPublicUrl(inscription.preuve_url);
                                        window.open(publicUrl, '_blank');
                                      }}
                                    >
                                      Voir la preuve
                                    </Button>
                                  ) : (
                                    <span className="text-sm text-gray-500 ml-2">Aucune preuve disponible</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
