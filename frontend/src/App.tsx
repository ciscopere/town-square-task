import './App.css'
import Posts from "./components/Post.tsx";
import {AppBar, Box, Container, Toolbar} from "@mui/material";
import logoHeader from './assets/logo-header.svg'

const App = () => (
    <div>
        <AppBar position="static" sx={{background: 'linear-gradient(90deg, #14a7fa, #6346e5, #9c00d7)'}}>
            <Toolbar>
                <img
                    src={logoHeader}
                    alt="Logo"
                    className="logo"
                />
            </Toolbar>
        </AppBar>
        <Container>
            <Box my={8}>
                <Posts/>
            </Box>
        </Container>
    </div>
    )
;

export default App
