import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Modal,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

const NotificationModal = ({
  open,
  onClose,
  notifications = [],
  onDeleteNotification,
  onMarkAllAsRead,
  onRespondToInvite,
}) => {
  const [currentTab, setCurrentTab] = React.useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleMenuOpen = (event, notification) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedNotification(notification);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedNotification(null);
  };

  const handleDelete = () => {
    if (selectedNotification) {
      onDeleteNotification(selectedNotification.id);
      handleMenuClose();
    }
  };

  const hasUnreadNotifications = notifications.some(
    (notification) => !notification.isRead
  );

  // ✅ 여기다가!
  const isInviteNotification = (notification) =>
    notification.message?.includes('채팅방에 초대했어요') &&
    notification.metadata?.room_id;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="notification-modal"
      BackdropProps={{
        onClick: onClose,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '80px',
          right: '20px',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 0,
          outline: 'none',
        }}
      >
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pr: 2,
          }}
        >
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            aria-label="notification tabs"
          >
            <Tab label="나의 알림" />
          </Tabs>
          {hasUnreadNotifications && (
            <Button
              startIcon={<DoneAllIcon />}
              onClick={onMarkAllAsRead}
              size="small"
              sx={{
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.04)',
                },
              }}
            >
              모두 읽음
            </Button>
          )}
        </Box>

        <List sx={{ maxHeight: 400, overflowY: 'auto', p: 0 }}>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  sx={{
                    py: 2,
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CheckCircleIcon
                      color={notification.isRead ? 'disabled' : 'success'}
                      sx={{ fontSize: 20 }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={notification.message}
                    secondary={
                      <>
                        {notification.time}
                        {isInviteNotification(notification) && (
                          <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              onClick={() =>
                                onRespondToInvite(
                                  notification.metadata.room_id,
                                  'accept'
                                )
                              }
                            >
                              수락
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="secondary"
                              onClick={() =>
                                onRespondToInvite(
                                  notification.metadata.room_id,
                                  'reject'
                                )
                              }
                            >
                              거절
                            </Button>
                          </Box>
                        )}
                      </>
                    }
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontSize: '0.9rem',
                        color: '#333',
                        wordBreak: 'keep-all',
                        overflowWrap: 'break-word',
                      },
                      '& .MuiListItemText-secondary': {
                        fontSize: '0.8rem',
                      },
                    }}
                  />

                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, notification)}
                  >
                    <MoreHorizIcon />
                  </IconButton>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">
                새로운 알림이 없습니다
              </Typography>
            </Box>
          )}
        </List>

        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <DeleteOutlineIcon sx={{ mr: 1, fontSize: 20 }} />
            알림 삭제
          </MenuItem>
        </Menu>
      </Box>
    </Modal>
  );
};

export default NotificationModal;
