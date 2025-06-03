import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, FileText, TrendingUp, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';

interface Atelier {
  id: string;
  nom: string;
}

interface InscriptionAtelier {
  id: string;
  inscription_id: string;
  atelier_id: string;
  atelier: Atelier;
}

interface Inscription {
  id: string;
  prenom: string;
  nom: string;
  created_at: string;
  valide: boolean;
  ateliers: Array<{
    atelier_id: string;
    atelier: {
      nom: string;
    };
  }>;
}

interface DashboardStats {
  totalInscriptions: number;
  todayInscriptions: number;
  pendingValidations: number;
  mostPopularWorkshop: { name: string; count: number } | null;
  workshopCounts: Record<string, number>;
  recentInscriptions: Inscription[];
}

export function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    totalInscriptions: 0,
    todayInscriptions: 0,
    pendingValidations: 0,
    mostPopularWorkshop: null,
    workshopCounts: {},
    recentInscriptions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch all ateliers first
        const { data: ateliers, error: ateliersError } = await supabase
          .from('ateliers')
          .select('*');
          
        if (ateliersError) throw ateliersError;
        
        // 2. Fetch all inscription_atelier relationships
        const { data: inscriptionAteliers, error: iaError } = await supabase
          .from('inscription_atelier')
          .select('*');
          
        if (iaError) throw iaError;
        
        // 3. Calculate workshop counts
        const workshopCounts: Record<string, number> = {};
        const workshopMap = new Map<string, { name: string; count: number }>();
        
        // Initialize workshop map with all ateliers
        ateliers?.forEach(atelier => {
          workshopMap.set(atelier.id, { name: atelier.nom, count: 0 });
        });
        
        // Count inscriptions per workshop
        inscriptionAteliers?.forEach(ia => {
          const workshop = workshopMap.get(ia.atelier_id);
          if (workshop) {
            workshop.count++;
            workshopMap.set(ia.atelier_id, workshop);
          }
        });
        
        // Find most popular workshop
        let mostPopularWorkshop: { name: string; count: number } | null = null;
        workshopMap.forEach((value) => {
          if (!mostPopularWorkshop || value.count > mostPopularWorkshop.count) {
            mostPopularWorkshop = { name: value.name, count: value.count };
          }
        });
        
        // Convert to workshopCounts object
        const workshopCountsObj: Record<string, number> = {};
        workshopMap.forEach((value) => {
          workshopCountsObj[value.name] = value.count;
        });
        
        // 4. Fetch basic counts
        const today = new Date();
        const todayStart = new Date(today.setHours(0, 0, 0, 0));
        const todayEnd = new Date(todayStart);
        todayEnd.setDate(todayEnd.getDate() + 1);
        
        const [
          { count: totalInscriptions },
          { count: todayInscriptions },
          { count: pendingValidations },
          { data: recentInscriptionsData }
        ] = await Promise.all([
          // Total inscriptions
          supabase
            .from('inscriptions')
            .select('*', { count: 'exact', head: true }),
            
          // Today's inscriptions
          supabase
            .from('inscriptions')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', todayStart.toISOString())
            .lt('created_at', todayEnd.toISOString()),
            
          // Pending validations
          supabase
            .from('inscriptions')
            .select('*', { count: 'exact', head: true })
            .eq('valide', false),
            
          // Recent inscriptions (last 5)
          supabase
            .from('inscriptions')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5)
        ]);
        
        // 5. Process recent inscriptions to include ateliers
        const recentInscriptions = (recentInscriptionsData || []).map(inscription => {
          const relatedIAs = inscriptionAteliers?.filter(ia => ia.inscription_id === inscription.id) || [];
          const ateliersForInscription = relatedIAs
            .map(ia => ateliers?.find(a => a.id === ia.atelier_id))
            .filter(Boolean)
            .map(atelier => ({
              atelier_id: atelier!.id,
              atelier: { nom: atelier!.nom }
            }));
            
          return {
            ...inscription,
            ateliers: ateliersForInscription as any[]
          };
        });
        
        // 6. Update state with all data
        setStats({
          totalInscriptions: totalInscriptions || 0,
          todayInscriptions: todayInscriptions || 0,
          pendingValidations: pendingValidations || 0,
          mostPopularWorkshop,
          workshopCounts: workshopCountsObj,
          recentInscriptions: recentInscriptions as Inscription[]
        });
        
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Erreur lors du chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Inscriptions totales</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInscriptions}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.todayInscriptions} aujourd'hui
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">En attente de validation</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingValidations}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.pendingValidations / stats.totalInscriptions) * 100 || 0)}% du total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Atelier le plus populaire</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.mostPopularWorkshop?.name || 'Aucun'}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.mostPopularWorkshop?.count || 0} inscriptions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Dernière mise à jour</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {format(new Date(), 'HH:mm')}
            </div>
            <p className="text-xs text-muted-foreground">
              {format(new Date(), 'PPP', { locale: fr })}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Dernières inscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentInscriptions.length > 0 ? (
                stats.recentInscriptions.map((inscription) => (
                  <div key={inscription.id} className="flex items-center p-3 border rounded-lg">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {inscription.prenom} {inscription.nom}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {inscription.ateliers.length > 0 
                          ? inscription.ateliers.map(a => a.atelier.nom).join(', ')
                          : 'Aucun atelier'}
                      </p>
                    </div>
                    <div className="ml-auto text-sm text-muted-foreground">
                      {format(new Date(inscription.created_at), 'PP', { locale: fr })}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Aucune inscription récente</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Répartition par atelier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.workshopCounts).length > 0 ? (
                Object.entries(stats.workshopCounts).map(([name, count]) => (
                  <div key={name} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{name}</span>
                      <span className="text-sm text-muted-foreground">{count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${(count / stats.totalInscriptions) * 100}%`,
                          minWidth: '0.5rem',
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Aucune donnée d'atelier disponible</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
