import './App.css'
import Posts from "./components/Post.tsx";
import {Box, Container, Typography} from "@mui/material";

const App = () => (
    <Container>
        <Box my={4}>
            <Typography variant="h2" component="h1" gutterBottom>
                Town square test
            </Typography>
            <Posts />
        </Box>
    </Container>
);

export default App
