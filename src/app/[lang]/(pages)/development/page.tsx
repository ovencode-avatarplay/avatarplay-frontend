'use client';

import {useState} from 'react';
import api, {ResponseAPI} from '../../../NetWork/ApiInstance';
import axios from 'axios';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Card,
  CardContent,
  TextareaAutosize,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

type ChatMessageContent = {
  question: string;
  answer: string;
};

type FormDataType = {
  modelId: string;
  templateFile: File | null;
  worldScenario: string;
  user: string;
  userDesc: string;
  char: string;
  charPersona: string;
  charSecret: string;
  randomParagraphCount: number;
  question: string;
  jailBreak: boolean;
  contents: ChatMessageContent[];
};

type UsageDetails = {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
};

export default function ApiTestTool() {
  const [formData, setFormData] = useState<FormDataType>({
    modelId: 'gpt-4o',
    templateFile: null,
    worldScenario: '{{char}}와 {{user}}는 오랜 동네 친구사이다. 오랜만에 길에서 만났다.',
    user: '철수',
    userDesc: '잘 생기고 공부를 잘한다',
    char: '영희',
    charPersona: '예쁘고 공부를 잘하고 집안이 좋다. 미국에서 살다왔다.',
    charSecret: '{{char}}는 {{user}}를 좋아하지만 내색 하지 않는다. 츤데레',
    randomParagraphCount: 4,
    question: '안녕?',
    jailBreak: true,
    contents: [],
  });

  const [logs, setLogs] = useState<string[]>([]);
  const [usageDetails, setUsageDetails] = useState<UsageDetails | null>(null);
  const [answer, setAnswer] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value, type, checked} = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        templateFile: file,
      }));
    }
  };

  const handleAddContent = () => {
    setFormData(prev => ({
      ...prev,
      contents: [...prev.contents, {question: '', answer: ''}],
    }));
  };

  const handleDeleteContent = (index: number) => {
    const updatedContents = formData.contents.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      contents: updatedContents,
    }));
  };

  const handleContentChange = (index: number, field: string, value: string) => {
    const updatedContents = [...formData.contents];
    updatedContents[index][field as keyof ChatMessageContent] = value;
    setFormData(prev => ({
      ...prev,
      contents: updatedContents,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'contents') {
        data.append(key, JSON.stringify(formData[key as keyof FormDataType]));
      } else if (key === 'templateFile' && formData.templateFile) {
        data.append(key, formData.templateFile);
      } else {
        data.append(key, String(formData[key as keyof FormDataType]));
      }
    });

    try {
      const response = await api.post('/Test/prompt', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setLogs(prevLogs => [...prevLogs, JSON.stringify(response.data, null, 2)]);
      // Add Question and Answer to contents if response is successful
      setFormData(prev => ({
        ...prev,
        contents: [
          ...prev.contents,
          {question: prev.question, answer: response.data.choices[0].message.content || 'No answer provided'},
        ],
      }));
      // Set usage details
      setUsageDetails(response.data.usage);
      setAnswer(response.data.choices[0].message.content);
    } catch (error: any) {
      setLogs(prevLogs => [...prevLogs, error.message]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          API 테스트 도구
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Model ID" name="modelId" value={formData.modelId} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button variant="contained" component="label" fullWidth>
              Upload Template File
              <input type="file" name="templateFile" hidden onChange={handleFileChange} />
            </Button>
            {formData.templateFile && (
              <Typography variant="body2" mt={1}>
                Uploaded File: {formData.templateFile.name}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="User" name="user" value={formData.user} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="User Description"
              name="userDesc"
              value={formData.userDesc}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Character" name="char" value={formData.char} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Random Paragraph Count"
              type="number"
              name="randomParagraphCount"
              value={formData.randomParagraphCount}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              multiline
              rows={4}
              fullWidth
              label="Character Persona"
              name="charPersona"
              value={formData.charPersona}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              multiline
              rows={4}
              fullWidth
              label="Character Secret"
              name="charSecret"
              value={formData.charSecret}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              multiline
              rows={4}
              fullWidth
              label="World Scenario"
              name="worldScenario"
              value={formData.worldScenario}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={<Checkbox checked={formData.jailBreak} onChange={handleChange} name="jailBreak" />}
              label="Jail Break"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Contents:</Typography>
            {formData.contents.map((content, index) => (
              <Box key={index} display="flex" gap={2} my={1} alignItems="center">
                <TextField
                  label="Question"
                  value={content.question}
                  onChange={e => handleContentChange(index, 'question', e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Answer"
                  value={content.answer}
                  onChange={e => handleContentChange(index, 'answer', e.target.value)}
                />
                <IconButton onClick={() => handleDeleteContent(index)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button variant="outlined" onClick={handleAddContent} sx={{mt: 2}}>
              Add Content
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} my={2}>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              multiline
              rows={1}
              fullWidth
              label="Question"
              name="question"
              value={formData.question}
              onChange={handleChange}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={isLoading}
              sx={{minWidth: '150px'}}
            >
              테스트 전송
            </Button>
          </Box>
        </Grid>

        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid item xs={12} sm={6} my={2}>
            <TextField multiline rows={8} fullWidth label="Answer" name="answer" value={answer} />
          </Grid>
        )}

        <Box mt={4}>
          <Typography variant="h6">로그</Typography>
          <pre>{JSON.stringify(logs, null, 2)}</pre>
        </Box>
        {usageDetails && (
          <Box mt={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Usage Details</Typography>
                <Typography>Prompt Tokens: {usageDetails.prompt_tokens}</Typography>
                <Typography>Completion Tokens: {usageDetails.completion_tokens}</Typography>
                <Typography>Total Tokens: {usageDetails.total_tokens}</Typography>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>
    </Container>
  );
}
