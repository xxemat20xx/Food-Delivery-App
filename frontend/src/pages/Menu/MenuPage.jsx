import { useLocation } from "react-router-dom";

const MenuPage = () => {
  const { state } = useLocation();
  const store = state?.store;
  console.log(state)
  return (
    <div id="menu">
      <h2>Menu Page</h2>
      <p>{store?.name}</p>
    </div>
  );
};

export default MenuPage;