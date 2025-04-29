import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

const faqList = [
  {
    category: '예약',
    question: '이벤트 공간은 어떻게 예약하나요?',
    answer: '회원가입 후 원하는 날짜와 장소를 선택하여 예약할 수 있으며...',
  },
  {
    category: '굿즈 등록',
    question: '굿즈 등록은 어떻게 하나요?',
    answer: '마이페이지 또는 굿즈 메뉴에서 등록이 가능하며...',
  },
  {
    category: '예약',
    question: '예약 취소는 어떻게 하나요?',
    answer: '마이페이지 > 예약내역에서 취소 가능합니다...',
  },
  {
    category: '결제',
    question: '결제는 어떤 방법이 있나요?',
    answer: '카드결제, 카카오페이, 네이버페이 등을 지원합니다.',
  },
  {
    category: '기타',
    question: '고객센터 운영시간은?',
    answer: '평일 오전 9시부터 오후 6시까지 운영됩니다.',
  },
];

const FaqPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const filteredFaqs =
    selectedCategory === '전체'
      ? faqList
      : faqList.filter((faq) => faq.category === selectedCategory);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4} sx={{ mt: 6 }}>
          {['전체', '예약', '굿즈 등록', '결제', '기타'].map((cat) => (
            <Typography
              key={cat}
              variant="body2"
              onClick={() => setSelectedCategory(cat)}
              sx={{
                cursor: 'pointer',
                mb: 1,
                fontWeight: selectedCategory === cat ? 'bold' : 'normal',
                color: selectedCategory === cat ? '#007AFF' : 'inherit',
              }}
            >
              {cat}
            </Typography>
          ))}
        </Grid>

        <Grid item xs={12} md={8}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            무엇을 도와드릴까요?
          </Typography>
          <Typography color="text.secondary">
            자주 묻는 질문들을 확인해보세요. 더 궁금한 점은 언제든지
            문의해주세요.
          </Typography>

          <Box mt={4}>
            {filteredFaqs.map((faq, idx) => (
              <Accordion
                key={idx}
                sx={{
                  mb: 2,
                  boxShadow: '0px 2px 6px rgba(0,0,0,0.05)',
                  borderRadius: '12px',
                  '&:before': { display: 'none' },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight="bold">{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FaqPage;
