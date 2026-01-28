import { useEffect, useState } from "react";
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, Divider, Paper, Stack, 
  CircularProgress, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  Chip, Backdrop } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useExam, type ExamAttempt } from "../context/ExamContext";

export default function ExamList() {
  const navigate = useNavigate();
  const { getHistory } = useExam();
  const { loadRandomMock } = useExam();

  const [examFiles, setExamFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);

  const history: ExamAttempt[] = getHistory();
  const visibleHistory = history.slice(0, limit);
  const hasMore = history.length > limit;

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}parsed-exams/exams.json`)
      .then(res => res.json())
      .then(data => {
        setExamFiles(data);
        setLoading(false);
      })
      .catch(err => console.error("Error loading exams list:", err));
  }, []);

  const handleStart = (mode: "test" | "study") => {
    if(selectedFile) {
      navigate(`/exam/${selectedFile}/${mode}`);
    }
  };

  const handleRandomSim = async () => {
    setIsGenerating(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    const success = await loadRandomMock(examFiles, 65);

    if(success) {
      navigate("/exam/random/test");
    } else {
      setIsGenerating(false);
      alert("Error Generating the Mock Exam");
    }
  }; 

  if(loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "800px", margin: "0 auto" }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center', color: 'primary.main' }}>
        AWS Certification Simulator
      </Typography>

      <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, textAlign: 'center' }}>
          Which exam do you want to practice today?
        </Typography>
        
        <Stack spacing={4}>
          <FormControl fullWidth>
            <InputLabel id="select-exam-label">Select an exam</InputLabel>
            <Select
              labelId="select-exam-label"
              value={selectedFile}
              label="Select an exam"
              onChange={(e) => setSelectedFile(e.target.value)}
            >
              {examFiles.map((file) => (
                <MenuItem key={file} value={file}>
                  {file.replace('.json', '').replace('-', ' ').toUpperCase()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button 
              fullWidth 
              variant="contained" 
              size="large"
              disabled={!selectedFile}
              onClick={() => handleStart("test")}
              sx={{ py: 1.5, fontWeight: 'bold' }}
            >
              Test Mode
            </Button>
            <Button 
              fullWidth 
              variant="outlined" 
              size="large"
              disabled={!selectedFile}
              onClick={() => handleStart("study")}
              sx={{ py: 1.5, fontWeight: 'bold' }}
            >
              Study Mode
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Button
        fullWidth
        variant="contained"
        color="secondary"
        size="large"
        onClick={handleRandomSim}
        sx={{ mb: 4, py: 2, fontWeight: 'bold', fontSize: '1.1rem', boxShadow: 4 }}
      >
        🚀 GENERATE RANDOM MOCK EXAM (65 Questions)
      </Button>

      {history.length > 0 && (
        <>
          <Divider sx={{ my: 5 }} />
          <Typography variant="h5" sx={{ mb: 2 }}>Your Exam Historic</Typography>
          
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: "grey.100" }}>
                <TableRow>
                  <TableCell><strong>Test</strong></TableCell>
                  <TableCell align="center"><strong>Date</strong></TableCell>
                  <TableCell align="center"><strong>Score</strong></TableCell>
                  <TableCell align="center"><strong>Result</strong></TableCell>
                  <TableCell align="center"><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleHistory.map((attempt) => (
                  <TableRow key={attempt.id}>
                    <TableCell>{attempt.title}</TableCell>
                    <TableCell align="center">{attempt.date.split(',')[0]}</TableCell>
                    <TableCell align="center">{attempt.score}%</TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={attempt.score >= 70 ? "PASS" : "FAIL"}
                        color={attempt.score >= 70 ? "success" : "error"}
                        variant="filled"
                        size="small"
                        sx={{ fontWeight: 'bold', width: '90px' }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button size="small" variant="outlined" onClick={() => navigate(`/review/${attempt.id}`)}>
                        Review Failures
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {hasMore && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button 
                variant="text" 
                onClick={() => setLimit(prev => prev + 10)}
                sx={{ textTransform: 'none' }}
              >
                Show More Exams (+10)
              </Button>
            </Box>
          )}
        </>
      )}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, flexDirection: 'column', gap: 2}} open={isGenerating}>
        <CircularProgress color="inherit" />
        <Typography variant="h6">Mixing AWS Questions...</Typography>
        <Typography variant="body2">Getting Ready your Certificate Exam</Typography>
      </Backdrop>
    </Box>
  );
}