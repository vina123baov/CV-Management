// src/pages/dashboard/AdminDashboard.tsx
import React, { JSX, useEffect, useState } from "react";
console.log("AdminDashboard component file loaded");

import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  CircularProgress,
  Paper,
  IconButton,
  Stack,
  Button,
} from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RefreshIcon from "@mui/icons-material/Refresh";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { supabase } from "../../utils/supabase";

type Counts = {
  candidates: number;
  jobs: number;
  interviews: number;
  profiles: number;
};

const COLORS_PIE = ["#0B84FF", "#00C49F", "#FF8042", "#FF6BCA", "#2E7D32"];

export default function AdminDashboard(): JSX.Element {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // dynamic import recharts
  const [rechartsModule, setRechartsModule] = useState<any | null>(null);
  useEffect(() => {
    let mounted = true;
    void import("recharts")
      .then((m) => {
        if (mounted) setRechartsModule(m);
      })
      .catch((e) => {
        console.warn("Failed to load recharts dynamically:", e);
      });
    return () => {
      mounted = false;
    };
  }, []);

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

  const lineData = [
    { name: "Jan", value: 16 },
    { name: "Feb", value: 22 },
    { name: "Mar", value: 19 },
    { name: "Apr", value: 17 },
    { name: "May", value: 32 },
    { name: "Jun", value: 28 },
    { name: "Jul", value: 10 },
  ];

  const pieData = [
    { name: "LinkedIn", value: 35 },
    { name: "Website", value: 25 },
    { name: "Referral", value: 20 },
    { name: "Job Portal", value: 15 },
    { name: "Other", value: 5 },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Box>
          <Typography variant="h4">Bảng điều khiển</Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Tổng quan hệ thống
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => window.location.reload()}
            size="small"
          >
            Làm mới
          </Button>
          <Paper
            elevation={0}
            sx={{
              px: 2,
              py: 1,
              borderRadius: 2,
              backgroundColor: "background.paper",
            }}
          >
            <Typography variant="body2">Công ty</Typography>
            <Typography variant="subtitle2">Recruit AI</Typography>
          </Paper>
        </Stack>
      </Box>

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
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 380px",
            },
            gap: 3,
          }}
        >
          {/* Main column */}
          <Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                mb: 3,
              }}
            >
              <StatCard
                title="Tổng CV"
                value={counts.candidates}
                subtitle="+12% vs tháng trước"
                icon={<PersonIcon />}
                bg="primary.main"
              />
              <StatCard
                title="Vị trí đang tuyển"
                value={counts.jobs}
                subtitle="+1 vs tháng trước"
                icon={<WorkOutlineIcon />}
                bg="success.main"
              />
              <StatCard
                title="CV phỏng vấn"
                value={counts.interviews}
                subtitle="+2% vs tháng trước"
                icon={<EventIcon />}
                bg="warning.main"
              />
              <StatCard
                title="Thời gian tuyển TB"
                value="18 ngày"
                subtitle="-3 ngày vs tháng trước"
                icon={<AccessTimeIcon />}
                bg="secondary.main"
              />
            </Box>

            {/* Chart Card */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography variant="h6">Xu hướng CV theo thời gian</Typography>
                  <IconButton size="small">
                    <MoreHorizIcon />
                  </IconButton>
                </Box>

                <Box sx={{ height: 320 }}>
                  {rechartsModule ? (
                    <rechartsModule.ResponsiveContainer width="100%" height="100%">
                      <rechartsModule.LineChart data={lineData}>
                        <rechartsModule.CartesianGrid strokeDasharray="3 3" />
                        <rechartsModule.XAxis dataKey="name" />
                        <rechartsModule.YAxis />
                        <rechartsModule.Tooltip />
                        <rechartsModule.Line
                          type="monotone"
                          dataKey="value"
                          stroke="#1976d2"
                          strokeWidth={3}
                          dot={{ r: 4 }}
                        />
                      </rechartsModule.LineChart>
                    </rechartsModule.ResponsiveContainer>
                  ) : (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      height="100%"
                    >
                      <Typography variant="body2">Đang tải biểu đồ...</Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Two-column section: pie + top jobs list */}
            <Box
              sx={{
                display: "flex",
                gap: 3,
                flexDirection: { xs: "column", md: "row" },
                mb: 3,
              }}
            >
              <Card sx={{ flex: 1 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Nguồn ứng viên
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                    {rechartsModule ? (
                      <rechartsModule.ResponsiveContainer width={360} height={260}>
                        <rechartsModule.PieChart>
                          <rechartsModule.Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                          >
                            {pieData.map((_, idx) => (
                              <rechartsModule.Cell
                                key={idx}
                                fill={COLORS_PIE[idx % COLORS_PIE.length]}
                              />
                            ))}
                          </rechartsModule.Pie>
                          <rechartsModule.Tooltip />
                        </rechartsModule.PieChart>
                      </rechartsModule.ResponsiveContainer>
                    ) : (
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        height={260}
                      >
                        <Typography variant="body2">Đang tải biểu đồ...</Typography>
                      </Box>
                    )}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 2,
                      mt: 1,
                    }}
                  >
                    {pieData.map((d, i) => (
                      <Box key={d.name} textAlign="center">
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            bgcolor: COLORS_PIE[i],
                            display: "inline-block",
                            mr: 0.5,
                          }}
                        />
                        <Typography variant="caption">
                          {d.name} {d.value}%
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ flex: 1 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Top vị trí tuyển dụng
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {[
                      { title: "Frontend Developer", count: 12, tag: "Hot" },
                      { title: "Backend Developer", count: 8, tag: "Bình thường" },
                      { title: "Full Stack Developer", count: 6, tag: "Bình thường" },
                      { title: "UI/UX Designer", count: 4, tag: "Bình thường" },
                      { title: "DevOps Engineer", count: 3, tag: "Bình thường" },
                    ].map((t, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          p: 1.5,
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: "divider",
                          mb: 1.2,
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              bgcolor: "background.default",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "text.secondary",
                              fontWeight: 600,
                            }}
                          >
                            {i + 1}
                          </Box>
                          <Box>
                            <Typography variant="subtitle1">{t.title}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {t.count} ứng viên
                            </Typography>
                          </Box>
                        </Stack>
                        <Box>
                          <Button
                            size="small"
                            variant="contained"
                            sx={{
                              bgcolor: t.tag === "Hot" ? "error.main" : "primary.main",
                              textTransform: "none",
                              boxShadow: "none",
                            }}
                          >
                            {t.tag}
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Recent activity */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Hoạt động gần đây
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {[
                    {
                      text: "Ứng viên Nguyễn Văn Anh đã nộp CV cho vị trí Frontend Developer",
                      date: "2024-12-01T00:00:00.000Z",
                    },
                    {
                      text: "Đã lên lịch phỏng vấn cho Trần Thị Bảo",
                      date: "2024-12-21T00:00:00.000Z",
                    },
                    {
                      text: "Hoàng Đức Nam đã được tuyển dụng",
                      date: "2024-11-25T00:00:00.000Z",
                    },
                  ].map((a, idx) => (
                    <Box key={idx} sx={{ mb: 2 }}>
                      <Stack direction="row" spacing={2}>
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            bgcolor: "primary.main",
                            borderRadius: "50%",
                            mt: 0.8,
                          }}
                        />
                        <Box>
                          <Typography variant="body2">{a.text}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(a.date).toLocaleString()}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Right column */}
          <Box>
            <Card sx={{ mb: 3, position: "sticky", top: 96 }}>
              <CardContent>
                <Typography variant="h6">Latest profiles</Typography>
                <Box mt={2}>
                  <LatestProfiles />
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6">Quick Actions</Typography>
                <Box mt={2} display="flex" flexDirection="column" gap={1}>
                  <Button variant="outlined" size="small">
                    Thêm vị trí tuyển dụng
                  </Button>
                  <Button variant="outlined" size="small">
                    Thêm hồ sơ
                  </Button>
                  <Button variant="outlined" size="small">
                    Xuất báo cáo
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}
    </Container>
  );
}

/* ---------- helper components ---------- */

function StatCard(props: {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: React.ReactNode;
  bg?: string;
}) {
  const { title, value, subtitle, icon, bg } = props;
  return (
    <Card sx={{ flex: "1 1 220px", minWidth: 220, borderRadius: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h5" sx={{ mt: 0.5 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="success.main">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: bg || "primary.main", width: 46, height: 46 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
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
  if (items.length === 0)
    return <Typography variant="body2">Không có hồ sơ nào</Typography>;

  return (
    <Box>
      {items.map((p) => {
        const name = (p.full_name ?? "") as string;
        const initial = name.length > 0 ? name[0] : "?";
        return (
          <Box key={p.id} display="flex" alignItems="center" mb={1.5}>
            <Avatar sx={{ mr: 2 }}>{initial}</Avatar>
            <Box>
              <Typography variant="body1">{p.full_name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {p.email}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
