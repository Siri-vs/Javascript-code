type HeaderProps = { appTitle: string};

const Header = ({appTitle}: HeaderProps) => (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
        <div className="conatiner-fluid">
            <a href="#" className="navbar-brand">{appTitle}</a>
        </div>
    </nav>
);


export default Header;