import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Link,
  useTheme
} from '@mui/material';
import { Description, Chat } from '@mui/icons-material';
import logoDark from "./logo-dark.svg";
import logoLight from "./logo-light.svg";

export function Welcome() {
  const theme = useTheme();

  return (
    <Container 
      component="main" 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        pt: 8, 
        pb: 4,
        minHeight: '100vh'
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <Box component="header" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <Box sx={{ width: { xs: '100%', sm: 500 }, maxWidth: '100vw', p: 2 }}>
            <img
              src={theme.palette.mode === 'dark' ? logoDark : logoLight}
              alt="React Router"
              style={{ width: '100%', display: 'block' }}
            />
          </Box>
        </Box>
        
        <Box sx={{ maxWidth: 400, width: '100%' }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper
            }}
          >
            <Typography 
              variant="body1" 
              align="center" 
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              What's next?
            </Typography>
            
            <List>
              {resources.map(({ href, text, icon }) => (
                <ListItem 
                  key={href}
                  component={Link}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  sx={{
                    textDecoration: 'none',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      textDecoration: 'none'
                    },
                    borderRadius: 1,
                    mb: 0.5
                  }}
                >
                  <ListItemIcon sx={{ color: 'primary.main' }}>
                    {icon}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}

const resources = [
  {
    href: "https://reactrouter.com/docs",
    text: "React Router Docs",
    icon: <Description />,
  },
  {
    href: "https://rmx.as/discord",
    text: "Join Discord",
    icon: <Chat />,
  },
];