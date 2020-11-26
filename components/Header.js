const Header = ({ merchant }) => (
  <header className="header">
    <h1 className="header__text-logo">
      {merchant.business_name}
    </h1>
    <a href="#products" className="header__shop">Shop</a>
  </header>
);

export default Header;