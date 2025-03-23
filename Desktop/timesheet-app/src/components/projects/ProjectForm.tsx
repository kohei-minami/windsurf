import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Stack,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Database } from "../../types/supabase";

type Project = Database["public"]["Tables"]["projects"]["Row"];
type ProjectStatus = Project["status"];

interface ProjectFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isEditMode?: boolean;
  project?: Project | null;
}

export const ProjectForm = ({
  open,
  onClose,
  onSuccess,
  isEditMode = false,
  project,
}: ProjectFormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("active");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description);
      setStatus(project.status);
      setStartDate(new Date(project.start_date));
      setEndDate(project.end_date ? new Date(project.end_date) : null);
      setTags(project.tags);
    } else {
      setName("");
      setDescription("");
      setStatus("active");
      setStartDate(new Date());
      setEndDate(null);
      setTags([]);
    }
  }, [project]);

  const handleSubmit = async () => {
    if (!name || !description || !startDate) {
      return;
    }

    let error;
    if (isEditMode && project?.id) {
      ({ error } = await supabase
        .from("projects")
        .update({
          name,
          description,
          status,
          start_date: startDate.toISOString().split("T")[0],
          end_date: endDate ? endDate.toISOString().split("T")[0] : null,
          tags,
        })
        .eq("id", project.id));
    } else {
      ({ error } = await supabase.from("projects").insert({
        name,
        description,
        status,
        start_date: startDate.toISOString().split("T")[0],
        end_date: endDate ? endDate.toISOString().split("T")[0] : null,
        tags,
      }));
    }

    if (error) {
      console.error(
        `プロジェクトの${isEditMode ? "更新" : "作成"}に失敗しました:`,
        error
      );
      return;
    }

    onSuccess();
    handleClose();
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setStatus("active");
    setStartDate(new Date());
    setEndDate(null);
    setTag("");
    setTags([]);
    onClose();
  };

  const handleAddTag = () => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTag("");
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setTags(tags.filter((t) => t !== tagToDelete));
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditMode ? "プロジェクトを編集" : "新規プロジェクト"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="プロジェクト名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="説明"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={4}
            fullWidth
            required
          />
          <FormControl fullWidth>
            <InputLabel>ステータス</InputLabel>
            <Select
              value={status}
              label="ステータス"
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
            >
              <MenuItem value="active">進行中</MenuItem>
              <MenuItem value="completed">完了</MenuItem>
              <MenuItem value="on_hold">保留中</MenuItem>
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="開始日"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
            />
            <DatePicker
              label="終了日"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
            />
          </LocalizationProvider>
          <Box>
            <TextField
              label="タグ"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              fullWidth
            />
            <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {tags.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  onDelete={() => handleDeleteTag(t)}
                  size="small"
                />
              ))}
            </Box>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>キャンセル</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {isEditMode ? "更新" : "作成"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
