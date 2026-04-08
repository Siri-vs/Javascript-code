//import type { FC } from "react";

import { Container, Navbar } from "react-bootstrap";

type HeaderProps =  { appTitle: string };

//const Header : FC<HeaderProps> = ({ appTitle }) => (

const Header = ({ appTitle }:HeaderProps) => (
    <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
            <Navbar.Brand href="#">{appTitle}</Navbar.Brand>
        </Container>
    </Navbar>
);

export default Header;