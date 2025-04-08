import { Box, Typography, Divider } from "@mui/material";

const SectionLayout = ({ title, children }) => {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      <Divider sx={{ mb: 3 }} />
      {children}
    </Box>
  );
};

export default SectionLayout;