import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Atelier {
  id: string;
  nom: string;
  // Add other properties that might exist in your ateliers table
  description?: string;
  date_debut?: string;
  date_fin?: string;
  capacite_max?: number;
  prix?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Inscription {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  date_naissance: string;
  preuve_url: string;
  valide: boolean;
  created_at: string;
  ateliers: Atelier[];
}

export const useInscriptions = () => {
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchInscriptions = async () => {
    try {
      setLoading(true);
      console.log('1. Starting to fetch inscriptions...');
      
      // 1. First, get all inscriptions
      const { data: inscriptionsData, error: inscriptionsError } = await supabase
        .from('inscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('2. Inscriptions data:', inscriptionsData);
      if (inscriptionsError) {
        console.error('Error fetching inscriptions:', inscriptionsError);
        throw inscriptionsError;
      }
      
      if (!inscriptionsData || inscriptionsData.length === 0) {
        console.log('No inscriptions found');
        setInscriptions([]);
        return;
      }

      // 2. Get all ateliers
      console.log('3. Fetching all ateliers...');
      const { data: allAteliers, error: ateliersError } = await supabase
        .from('ateliers')
        .select('*');
      
      console.log('4. All ateliers:', allAteliers);
      if (ateliersError) {
        console.error('Error fetching ateliers:', ateliersError);
        throw ateliersError;
      }

      // 3. Get all inscription_atelier relationships
      console.log('5. Fetching inscription_atelier relationships...');
      const { data: inscriptionAteliers, error: iaError } = await supabase
        .from('inscription_atelier')
        .select('*');
      
      console.log('6. All inscription_atelier records:', inscriptionAteliers);
      if (iaError) {
        console.error('Error fetching inscription_atelier:', iaError);
        throw iaError;
      }

      // 4. Map ateliers to inscriptions
      console.log('7. Mapping ateliers to inscriptions...');
      const inscriptionsWithAteliers = inscriptionsData.map(inscription => {
        console.log(`\nProcessing inscription: ${inscription.id}`);
        
        // Find all atelier IDs for this inscription
        const relatedIAs = (inscriptionAteliers || []).filter(ia => {
          // Log the comparison for debugging
          console.log(`  - Checking: ${ia.inscription_id} === ${inscription.id} (${ia.inscription_id === inscription.id ? 'MATCH' : 'no match'})`);
          return ia.inscription_id === inscription.id;
        });
        
        console.log(`  - Found ${relatedIAs.length} related ateliers`);
        
        // Find the actual atelier objects
        const ateliers = relatedIAs.map(ia => {
          const atelier = allAteliers?.find(a => a.id === ia.atelier_id);
          console.log(`  - Atelier ${ia.atelier_id}:`, atelier ? 'FOUND' : 'NOT FOUND');
          return atelier ? { id: atelier.id, nom: atelier.nom } : null;
        }).filter(Boolean);
        
        console.log(`  - Mapped ateliers:`, ateliers);
        
        return {
          ...inscription,
          ateliers: ateliers as { id: string; nom: string }[]
        };
      });
      
      console.log('8. Final inscriptions with ateliers:', inscriptionsWithAteliers);

      setInscriptions(inscriptionsWithAteliers);
    } catch (err) {
      console.error('Error fetching inscriptions:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInscriptions();
  }, []);

  const updateInscriptionStatus = async (id: string, valide: boolean) => {
    try {
      const { error } = await supabase
        .from('inscriptions')
        .update({ valide })
        .eq('id', id);

      if (error) throw error;
      await fetchInscriptions();
      return true;
    } catch (err) {
      console.error('Error updating inscription status:', err);
      return false;
    }
  };

  return {
    inscriptions,
    loading,
    error,
    refresh: fetchInscriptions,
    updateInscriptionStatus,
  };
};
