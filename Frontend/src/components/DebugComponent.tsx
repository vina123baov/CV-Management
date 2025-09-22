// src/components/DebugComponent.tsx
// src/components/DebugComponent.tsx
import { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  CircularProgress, 
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { supabase, testSupabaseConnection } from '../utils/supabase';

export default function DebugComponent() {
  const [envCheck, setEnvCheck] = useState<any>(null);
  const [connectionTest, setConnectionTest] = useState<any>(null);
  const [tableTests, setTableTests] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check environment variables
    const envResult = {
      hasUrl: !!import.meta.env.VITE_SUPABASE_URL,
      hasKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      url: import.meta.env.VITE_SUPABASE_URL ? 
        `${import.meta.env.VITE_SUPABASE_URL.substring(0, 30)}...` : 'Missing',
    };
    setEnvCheck(envResult);
    console.log("Environment check:", envResult);
  }, []);

  const runConnectionTest = async () => {
    setLoading(true);
    try {
      const result = await testSupabaseConnection();
      setConnectionTest(result);
      console.log("Connection test result:", result);
    } catch (err) {
      setConnectionTest({ 
        success: false, 
        error: err instanceof Error ? err.message : String(err) 
      });
    }
    setLoading(false);
  };

  const testTables = async () => {
    setLoading(true);
    const tables = ['cv_candidates', 'cv_jobs', 'cv_interviews', 'cv_profiles'];
    const results: any = {};

    for (const table of tables) {
      try {
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact' })
          .limit(1);
        
        if (error) {
          results[table] = { success: false, error: error.message };
        } else {
          results[table] = { 
            success: true, 
            count: count || 0,
            hasData: data && data.length > 0,
            sampleData: data?.[0] || null
          };
        }
      } catch (err) {
        results[table] = { 
          success: false, 
          error: err instanceof Error ? err.message : String(err) 
        };
      }
    }

    setTableTests(results);
    setLoading(false);
    console.log("Table tests:", results);
  };

  return (
    <Box p={3} maxWidth="800px" mx="auto">
      <Typography variant="h4" gutterBottom>
        🔧 Supabase Debug Dashboard
      </Typography>

      {/* Environment Variables Check */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">
            1. Environment Variables {envCheck?.hasUrl && envCheck?.hasKey ? '✅' : '❌'}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {envCheck && (
            <Box>
              <Typography>VITE_SUPABASE_URL: {envCheck.hasUrl ? '✅ Present' : '❌ Missing'}</Typography>
              <Typography>VITE_SUPABASE_ANON_KEY: {envCheck.hasKey ? '✅ Present' : '❌ Missing'}</Typography>
              {envCheck.hasUrl && (
                <Typography variant="caption" color="text.secondary">
                  URL: {envCheck.url}
                </Typography>
              )}
              {(!envCheck.hasUrl || !envCheck.hasKey) && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Thiếu biến môi trường! Tạo file .env trong thư mục root với:
                  </Typography>
                  <pre style={{ marginTop: 8, fontSize: '12px' }}>
{`VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key`}
                  </pre>
                </Alert>
              )}
            </Box>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Connection Test */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">
            2. Connection Test {connectionTest?.success ? '✅' : connectionTest ? '❌' : '⏳'}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Button 
              variant="contained" 
              onClick={runConnectionTest}
              disabled={loading || !envCheck?.hasUrl || !envCheck?.hasKey}
              sx={{ mb: 2 }}
            >
              {loading ? <CircularProgress size={20} /> : 'Test Connection'}
            </Button>
            
            {connectionTest && (
              <Paper sx={{ p: 2, backgroundColor: connectionTest.success ? '#e8f5e8' : '#ffebee' }}>
                <Typography variant="body2">
                  Status: {connectionTest.success ? '✅ Success' : '❌ Failed'}
                </Typography>
                {connectionTest.error && (
                  <Typography variant="body2" color="error">
                    Error: {connectionTest.error}
                  </Typography>
                )}
              </Paper>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Table Tests */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">
            3. Database Tables Test {Object.keys(tableTests).length > 0 ? 
              (Object.values(tableTests).every((t: any) => t.success) ? '✅' : '❌') : '⏳'}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Button 
              variant="contained" 
              onClick={testTables}
              disabled={loading || !connectionTest?.success}
              sx={{ mb: 2 }}
            >
              {loading ? <CircularProgress size={20} /> : 'Test Tables'}
            </Button>

            {Object.keys(tableTests).length > 0 && (
              <Box>
                {Object.entries(tableTests).map(([table, result]: [string, any]) => (
                  <Paper key={table} sx={{ p: 2, mb: 1, backgroundColor: result.success ? '#e8f5e8' : '#ffebee' }}>
                    <Typography variant="subtitle1">
                      {table}: {result.success ? '✅' : '❌'}
                    </Typography>
                    {result.success ? (
                      <Box>
                        <Typography variant="body2">Count: {result.count}</Typography>
                        <Typography variant="body2">Has Data: {result.hasData ? 'Yes' : 'No'}</Typography>
                        {result.sampleData && (
                          <Typography variant="caption" component="pre">
                            Sample: {JSON.stringify(result.sampleData, null, 2)}
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="error">
                        Error: {result.error}
                      </Typography>
                    )}
                  </Paper>
                ))}
              </Box>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Instructions */}
      <Paper sx={{ p: 2, mt: 3, backgroundColor: '#f5f5f5' }}>
        <Typography variant="h6" gutterBottom>📋 Hướng dẫn debug:</Typography>
        <Typography variant="body2" component="div">
          <ol>
            <li>Kiểm tra Environment Variables trước</li>
            <li>Nếu ENV OK, test Connection</li>
            <li>Nếu Connection OK, test Tables</li>
            <li>Nếu có table nào fail, kiểm tra Supabase Dashboard xem table có tồn tại không</li>
          </ol>
        </Typography>
      </Paper>
    </Box>
  );
}