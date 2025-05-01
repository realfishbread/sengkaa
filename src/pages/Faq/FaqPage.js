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
    answer:
      '회원가입 후, 원하는 날짜와 장소를 선택하여 간편하게 예약할 수 있어요. 각 공간의 상세페이지에서 이용 가능한 날짜를 확인한 후 "예약하기" 버튼을 눌러주세요. 마이페이지에서는 내가 예약한 내역을 한눈에 볼 수 있어 편리하답니다!',
  },
  {
    category: '굿즈 등록',
    question: '굿즈 등록은 어떻게 하나요?',
    answer:
      '굿즈는 마이페이지 또는 "굿즈 등록" 메뉴에서 자유롭게 올릴 수 있어요. 이미지, 설명, 판매링크 등 필요한 정보를 입력하면, 나만의 덕질 굿즈를 다른 사람들과 공유할 수 있어요. 등록한 굿즈는 언제든 수정도 가능하답니다!',
  },
  {
    category: '예약',
    question: '예약 취소는 어떻게 하나요?',
    answer:
      '예약 취소는 마이페이지 > 예약내역에서 직접 할 수 있어요. 단, 취소 시점에 따라 취소 수수료가 발생할 수 있으니 꼭 예약 정책을 확인해주세요. 취소 완료 시 문자나 이메일로 안내가 가니 안심하고 이용하세요.',
  },
  {
    category: '결제',
    question: '결제는 어떤 방법이 있나요?',
    answer:
      '카드결제는 물론, 카카오페이, 네이버페이 등 다양한 간편결제 서비스를 지원해요. 결제는 빠르고 안전하게 처리되며, 결제 후에는 결제내역을 마이페이지에서 확인하실 수 있어요.',
  },
  {
    category: '기타',
    question: '고객센터 운영시간은?',
    answer:
      '고객센터는 평일 오전 9시부터 오후 6시까지 운영되며, 문의사항은 언제든지 1:1 문의 게시판을 통해 남겨주시면 순차적으로 답변해드립니다. 운영시간 외에 남겨주신 문의는 익일에 처리됩니다.',
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
