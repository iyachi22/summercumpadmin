import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface TableData {
  [key: string]: any[];
}

export function TestAteliers() {
  // List of tables we know about or suspect might exist
  const KNOWN_TABLES = [
    'inscriptions',
    'ateliers',
    'inscription_atelier',
    'inscription_ateliers',
    'user_ateliers',
    'workshop_registrations',
    'users',
    'profiles',
    'settings'
  ];

  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [tableData, setTableData] = useState<TableData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkedTables, setCheckedTables] = useState<string[]>([]);

  useEffect(() => {
    const checkTables = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check which of the known tables exist by trying to fetch a single row
        const checkPromises = KNOWN_TABLES.map(async (tableName) => {
          try {
            const { data, error } = await supabase
              .from(tableName)
              .select('*')
              .limit(1);
            
            if (!error) {
              return { name: tableName, exists: true, error: null };
            }
            return { name: tableName, exists: false, error: error.message };
          } catch (e) {
            return { name: tableName, exists: false, error: String(e) };
          }
        });

        const results = await Promise.all(checkPromises);
        const existingTables = results.filter(r => r.exists).map(r => r.name);
        
        console.log('Existing tables:', existingTables);
        setTables(existingTables);
        setCheckedTables(KNOWN_TABLES);
        
        // If we found tables, load data from the first one
        if (existingTables.length > 0) {
          await loadTableData(existingTables[0]);
          setSelectedTable(existingTables[0]);
        } else {
          setError('No known tables found in the database');
        }
      } catch (err) {
        console.error('Error checking tables:', err);
        setError('Failed to check database tables');
      } finally {
        setLoading(false);
      }
    };

    const loadTableData = async (tableName: string) => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(50); // Limit to 50 rows for performance
        
        if (error) throw error;
        
        setTableData(prev => ({
          ...prev,
          [tableName]: data || []
        }));
      } catch (err) {
        console.error(`Error loading data from ${tableName}:`, err);
        setError(`Failed to load data from ${tableName}`);
      } finally {
        setLoading(false);
      }
    };

    checkTables();
  }, []);

  const handleTableSelect = async (tableName: string) => {
    setSelectedTable(tableName);
    
    // If we haven't loaded this table's data yet, load it
    if (!tableData[tableName]) {
      await loadTableData(tableName);
    }
  };

  if (loading) {
    return <div className="p-4">Loading database information...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        <h2 className="font-bold text-lg mb-2">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  const renderTableData = (data: any[]) => {
    if (!data || data.length === 0) {
      return (
        <tr>
          <td colSpan={100} className="py-4 text-center text-gray-500">
            No data available
          </td>
        </tr>
      );
    }

    // Get all unique keys from all objects in the data array
    const allKeys = Array.from(
      new Set(data.flatMap(row => row ? Object.keys(row) : []))
    );

    return (
      <>
        <thead>
          <tr className="bg-gray-100">
            {allKeys.map((key) => (
              <th key={key} className="py-2 px-4 border-b text-left">
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {allKeys.map((key) => (
                <td key={`${rowIndex}-${key}`} className="py-2 px-4 border-b text-sm">
                  {row && typeof row[key] === 'object' 
                    ? JSON.stringify(row[key])
                    : String(row?.[key] ?? 'null')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Database Explorer</h2>
        <p>Loading database information...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Database Explorer</h2>
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Database Explorer</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Tables</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {tables.map((tableName) => (
            <button
              key={tableName}
              onClick={() => handleTableSelect(tableName)}
              className={`px-3 py-1 rounded text-sm ${
                selectedTable === tableName
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {tableName}
            </button>
          ))}
        </div>
        
        {checkedTables.length > 0 && (
          <p className="text-sm text-gray-600">
            Checked tables: {checkedTables.join(', ')}
          </p>
        )}
      </div>

      {selectedTable && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">
            Data from: <span className="font-mono">{selectedTable}</span>
            {loading && <span className="ml-2 text-blue-500">Loading...</span>}
          </h3>
          
          <div className="overflow-x-auto bg-white rounded-lg shadow border">
            <table className="min-w-full">
              {renderTableData(tableData[selectedTable] || [])}
            </table>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <h4 className="font-semibold mb-2">Raw Data (first 50 rows):</h4>
            <pre className="text-xs bg-black text-green-400 p-2 rounded overflow-auto max-h-60">
              {JSON.stringify(tableData[selectedTable] || 'No data found', null, 2)}
            </pre>
          </div>
        </div>
      )}
      
      <div className="mt-8 p-4 bg-blue-50 rounded">
        <h3 className="font-semibold mb-2">Database Information</h3>
        <p className="text-sm text-gray-700">
          Found {tables.length} tables in the database.
          {selectedTable && ` Currently showing data from: ${selectedTable}`}
        </p>
      </div>
    </div>
  );
}
