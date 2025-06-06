import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  TextField,
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../shared/api/axiosInstance';

// 탭 패널 컴포넌트
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`category-tabpanel-${index}`}
      aria-labelledby={`category-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const SearchModal = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [idols, setIdols] = useState([]);
  const [loading, setLoading] = useState(true);

  // 카테고리 정의
  const categories = [
    { label: '아이돌', type: 'IDOL' },
    { label: '스트리머', type: 'STREAMER' },
    { label: '게임', type: 'GAME' },
    { label: '웹툰', type: 'WEBTOON' },
    { label: '애니', type: 'ANIME' },
  ];

  // 아이돌 목록 가져오기
  useEffect(() => {
    const fetchIdols = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/user/star/stars/?category=IDOL');
        setIdols(response.data);
      } catch (error) {
        console.error('아이돌 목록 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    if (open && selectedTab === 0) {
      fetchIdols();
    }
  }, [open, selectedTab]);

  // 탭 변경 핸들러
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // 스타 클릭 핸들러
  const handleStarClick = (starId) => {
    navigate(`/star/${starId}`);
    onClose();
  };

  // 검색 실행 핸들러
  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/result?query=${encodeURIComponent(searchTerm.trim())}`);
      onClose();
    }
  };

  // 검색어 입력 후 엔터 키 처리
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  // 필터링된 아이돌 목록
  const filteredIdols = idols.filter(idol =>
    idol.display.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '80vh',
          margin: '16px'
        }
      }}
    >
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="찾으시는 최애가 있으신가요?"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: '#f5f5f5',
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                },
              },
            }}
          />
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minWidth: 80,
                fontWeight: 'medium',
                fontSize: '0.875rem',
                py: 1,
              },
            }}
          >
            {categories.map((category, index) => (
              <Tab key={category.type} label={category.label} />
            ))}
          </Tabs>
        </Box>

        <TabPanel value={selectedTab} index={0}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={1.5}>
              {filteredIdols.map((idol) => (
                <Grid item xs={4} sm={4} key={idol.id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)'
                      }
                    }}
                  >
                    <CardActionArea onClick={() => handleStarClick(idol.id)}>
                      <CardMedia
                        component="img"
                        image={idol.image}
                        alt={idol.display}
                        sx={{ 
                          aspectRatio: '1',
                          objectFit: 'cover'
                        }}
                      />
                      <CardContent sx={{ py: 1 }}>
                        <Typography align="center" fontSize="0.875rem">{idol.display}</Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
              {filteredIdols.length === 0 && !loading && (
                <Box sx={{ width: '100%', textAlign: 'center', py: 3 }}>
                  <Typography color="text.secondary">
                    검색 결과가 없습니다.
                  </Typography>
                </Box>
              )}
            </Grid>
          )}
        </TabPanel>

        {/* 다른 카테고리 탭 패널 */}
        {categories.slice(1).map((category, index) => (
          <TabPanel key={category.type} value={selectedTab} index={index + 1}>
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography color="text.secondary">
                {category.label} 카테고리는 준비 중입니다.
              </Typography>
            </Box>
          </TabPanel>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal; 