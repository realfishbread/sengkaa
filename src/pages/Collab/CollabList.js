import React, { useState } from "react";
import { Box, Typography, Card, CardContent, CardMedia } from "@mui/material";

const CollabList = () => {
  const [collabNews, setCollabNews] = useState([]); // 빈 배열로 테스트

  return (
    <Box
      sx={{
        maxWidth: 800,
        margin: "3rem auto",
        padding: "2rem",
        fontFamily: "'Pretendard Variable', sans-serif",
      }}
    >
      <Typography variant="h5" textAlign="center" marginBottom={3} fontWeight="bold">
        콜라보 소식 목록
      </Typography>

      {collabNews.length === 0 ? (
        <Typography textAlign="center" color="text.secondary">
          등록된 콜라보 소식이 없습니다.
        </Typography>
      ) : (
        collabNews.map((news) => (
          <Card
            key={news.id}
            sx={{
              display: "flex",
              marginBottom: "1.5rem",
              borderRadius: "12px",
              backgroundColor: "#0056b3",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            {news.image && (
              <CardMedia
                component="img"
                image={news.image}
                alt={news.title}
                sx={{ width: 160, objectFit: "cover", borderRadius: "12px 0 0 12px" }}
              />
            )}
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="bold" marginBottom={1}>
                {news.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" marginBottom={1}>
                📅 {news.date}
              </Typography>
              <Typography variant="body1">{news.product}</Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default CollabList;