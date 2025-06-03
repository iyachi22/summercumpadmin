
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Summer Camp 2025</h1>
                <p className="text-gray-600">Plateforme d'inscription et d'administration</p>
              </div>
            </div>
            <Link to="/admin">
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                Administration
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenue sur Summer Camp 2025
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Rejoignez-nous pour une expérience d'apprentissage inoubliable avec nos ateliers spécialisés 
            en technologie, création et entrepreneuriat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Calendar className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Inscriptions Ouvertes</CardTitle>
              <CardDescription>
                Les inscriptions pour le Summer Camp 2025 sont maintenant ouvertes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                S'inscrire maintenant
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>8 Ateliers Disponibles</CardTitle>
              <CardDescription>
                Choisissez parmi nos ateliers spécialisés adaptés à tous les niveaux
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Développement Web</li>
                <li>• Intelligence Artificielle</li>
                <li>• Infographie</li>
                <li>• Et 5 autres ateliers...</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Settings className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Administration</CardTitle>
              <CardDescription>
                Accès à l'interface d'administration pour gérer les inscriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin">
                <Button variant="outline" className="w-full">
                  Accéder à l'admin
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Ateliers Disponibles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              "Développement Web",
              "Intelligence Artificielle", 
              "Infographie",
              "Création de Contenu",
              "Photographie",
              "Montage Vidéo",
              "Entrepreneuriat",
              "Entrepreneuriat (en anglais)"
            ].map((atelier) => (
              <div key={atelier} className="p-4 border border-gray-200 rounded-lg text-center">
                <h4 className="font-medium text-gray-900">{atelier}</h4>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 Summer Camp. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
