
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { mockInscriptions } from "@/data/mockData";

export function AdminStats() {
  // Workshop distribution data
  const workshopCounts = mockInscriptions.reduce((acc, inscription) => {
    acc[inscription.atelier] = (acc[inscription.atelier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const workshopData = Object.entries(workshopCounts).map(([name, value]) => ({
    name: name.length > 20 ? name.substring(0, 17) + "..." : name,
    fullName: name,
    value
  }));

  // Age distribution data
  const ageRanges = mockInscriptions.reduce((acc, inscription) => {
    const birthYear = new Date(inscription.dateNaissance).getFullYear();
    const age = new Date().getFullYear() - birthYear;
    
    let range;
    if (age < 18) range = "Moins de 18 ans";
    else if (age < 25) range = "18-24 ans";
    else if (age < 35) range = "25-34 ans";
    else range = "35+ ans";
    
    acc[range] = (acc[range] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const ageData = Object.entries(ageRanges).map(([name, value]) => ({
    name,
    value
  }));

  // Inscriptions timeline (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date;
  }).reverse();

  const timelineData = last7Days.map(date => {
    const dayInscriptions = mockInscriptions.filter(inscription => 
      new Date(inscription.dateInscription).toDateString() === date.toDateString()
    ).length;
    
    return {
      date: date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
      inscriptions: dayInscriptions
    };
  });

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Statistiques</h2>
        <p className="text-gray-600 mt-2">Analyse détaillée des inscriptions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Répartition par Atelier</CardTitle>
            <CardDescription>Nombre d'inscriptions par atelier</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={workshopData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value, payload) => payload?.[0]?.payload?.fullName || value}
                />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition par Âge</CardTitle>
            <CardDescription>Distribution des participants par tranche d'âge</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Évolution des Inscriptions</CardTitle>
            <CardDescription>Nombre d'inscriptions sur les 7 derniers jours</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="inscriptions" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Taux de Remplissage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {((mockInscriptions.length / 100) * 100).toFixed(1)}%
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {mockInscriptions.length} / 100 places disponibles
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(mockInscriptions.length / 100) * 100}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Atelier le Plus Populaire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">
              {Object.entries(workshopCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || "N/A"}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {Object.entries(workshopCounts).sort(([,a], [,b]) => b - a)[0]?.[1] || 0} inscriptions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Moyenne d'Âge</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {Math.round(
                mockInscriptions.reduce((sum, inscription) => {
                  const age = new Date().getFullYear() - new Date(inscription.dateNaissance).getFullYear();
                  return sum + age;
                }, 0) / mockInscriptions.length
              )} ans
            </div>
            <p className="text-sm text-gray-600 mt-2">
              âge moyen des participants
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
