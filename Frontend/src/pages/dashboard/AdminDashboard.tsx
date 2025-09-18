// src/pages/dashboard/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  CircularProgress,
  Paper,
} from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { supabase } from "../../utils/supabase";

type Counts = {
  candidates: number;
  jobs: number;
  interviews: number;
  profiles: number;
};

export default function AdminDashboard(): JSX.Element {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      try {
        const [candidatesRes, jobsRes, interviewsRes, profilesRes] =
          await Promise.all([
            supabase.from("cv_candidates").select("id", { count: "exact" }),
            supabase.from("cv_jobs").select("id", { count: "exact" }),
            supabase.from("cv_interviews").select("id", { count: "exact" }),
            supabase.from("cv_profiles").select("id", { count: "exact" }),
          ]);

        const firstError =
          candidatesRes.error ||
          jobsRes.error ||
          interviewsRes.error ||
          profilesRes.error;
        if (firstError) {
          setError(firstError.message);
          setCounts(null);
        } else {
          const candidatesCount =
            typeof candidatesRes.count === "number"
              ? candidatesRes.count
              : (candidatesRes.data || []).length;
          const jobsCount =
            typeof jobsRes.count === "number"
              ? jobsRes.count
              : (jobsRes.data || []).length;
          const interviewsCount =
            typeof interviewsRes.count === "number"
              ? interviewsRes.count
              : (interviewsRes.data || []).length;
          const profilesCount =
            typeof profilesRes.count === "number"
              ? profilesRes.count
              : (profilesRes.data || []).length;

          setCounts({
            candidates: candidatesCount,
            jobs: jobsCount,
            interviews: interviewsCount,
            profiles: profilesCount,
          });
          setError(null);
        }
      } catch (err: any) {
        setError(err?.message ?? String(err));
        setCounts(null);
      } finally {
        setLoading(false);
      }
    };

    void fetchCounts();
  }, []);

  const chartData = [
    { name: "Jan", value: 16 },
    { name: "Feb", value: 22 },
    { name: "Mar", value: 19 },
    { name: "Apr", value: 17 },
    { name: "May", value: 32 },
    { name: "Jun", value: 28 },
    { name: "Jul", value: 10 },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Bảng điều khiển (Admin)
      </Typography>

      {loading && (
        <Box display="flex" justifyContent="center" my={6}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Paper sx={{ p: 2, mb: 2, backgroundColor: "#ffebee" }}>
          <Typography color="error">Lỗi khi tải dữ liệu: {error}</Typography>
        </Paper>
      )}

      {!loading && counts && (
        <Grid container spacing={3}>
          {/* Card 1 */}
          <Grid xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="subtitle2">Tổng CV</Typography>
                    <Typography variant="h5">{counts.candidates}</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    <PersonIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Card 2 */}
          <Grid xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="subtitle2">Vị trí đang tuyển</Typography>
                    <Typography variant="h5">{counts.jobs}</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: "success.main" }}>
                    <WorkOutlineIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Card 3 */}
          <Grid xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="subtitle2">CV phỏng vấn</Typography>
                    <Typography variant="h5">{counts.interviews}</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: "warning.main" }}>
                    <EventIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Card 4 */}
          <Grid xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="subtitle2">Hồ sơ</Typography>
                    <Typography variant="h5">{counts.profiles}</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: "secondary.main" }}>
                    <AccessTimeIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Chart */}
          <Grid xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Xu hướng CV theo thời gian
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#1976d2"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Latest profiles */}
          <Grid xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Latest profiles</Typography>
                <Box mt={2}>
                  <LatestProfiles />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

function LatestProfiles(): JSX.Element {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("cv_profiles")
        .select("id, full_name, email, inserted_at")
        .order("inserted_at", { ascending: false })
        .limit(5);

      if (!error) {
        setItems(data || []);
      } else {
        console.error("LatestProfiles error:", error);
        setItems([]);
      }
      setLoading(false);
    };

    void fetch();
  }, []);

  if (loading) return <Typography variant="body2">Đang tải...</Typography>;
  if (items.length === 0) return <Typography variant="body2">Không có hồ sơ nào</Typography>;

  return (
    <Box>
      {items.map((p) => (
        <Box key={p.id} display="flex" alignItems="center" mb={1}>
          <Avatar sx={{ mr: 2 }}>{(p.full_name || "?")[0]}</Avatar>
          <Box>
            <Typography variant="body1">{p.full_name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {p.email}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
