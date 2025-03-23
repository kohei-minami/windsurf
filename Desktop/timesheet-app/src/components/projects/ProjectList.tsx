import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Database } from "../../types/supabase";
import { ProjectForm } from "./ProjectForm";

type Project = Database["public"]["Tables"]["projects"]["Row"];
type ChipColor =
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning";

export const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("プロジェクトの取得に失敗しました:", error);
      return;
    }

    setProjects(data || []);
  };

  const getStatusColor = (status: Project["status"]): ChipColor => {
    switch (status) {
      case "active":
        return "success";
      case "completed":
        return "default";
      case "on_hold":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: Project["status"]) => {
    switch (status) {
      case "active":
        return "進行中";
      case "completed":
        return "完了";
      case "on_hold":
        return "保留中";
      default:
        return status;
    }
  };

  const handleOpenForm = (project?: Project) => {
    if (project) {
      setSelectedProject(project);
      setIsEditMode(true);
    } else {
      setSelectedProject(null);
      setIsEditMode(false);
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleProjectCreated = () => {
    fetchProjects();
  };

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h6" component="h2">
          プロジェクト一覧
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenForm()}
        >
          新規プロジェクト
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>プロジェクト名</TableCell>
              <TableCell>ステータス</TableCell>
              <TableCell>開始日</TableCell>
              <TableCell>終了日</TableCell>
              <TableCell>タグ</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.name}</TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(project.status)}
                    color={getStatusColor(project.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(project.start_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {project.end_date
                    ? new Date(project.end_date).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>
                  {project.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5 }} />
                  ))}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenForm(project)}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ProjectForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSuccess={handleProjectCreated}
        isEditMode={isEditMode}
        project={selectedProject}
      />
    </div>
  );
};
