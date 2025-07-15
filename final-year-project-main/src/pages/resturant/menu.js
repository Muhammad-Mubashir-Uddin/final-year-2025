import RestaurantLayout from "@/components/RestaurantLayout";
import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

export default function MenuPage() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    extras: [],
  });

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("/api/resturant/setMenu", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenu(response.data);
    } catch (error) {
      console.error("Error fetching menu", error);
    }
  };

  const handleToggleAvailability = async (id) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    await axios.patch(
      "/api/resturant/setMenu",
      { itemId: id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchMenu();
    setLoading(false);
  };

  const handleAddOrUpdateMenuItem = async () => {
    if (!newItem.name || !newItem.price || !newItem.category) return;

    setLoading(true);
    const token = localStorage.getItem("token");
    const url = "/api/resturant/setMenu";
    const method = editId ? "put" : "post";

    await axios[method](
      url,
      editId ? { ...newItem, itemId: editId } : newItem,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setNewItem({
      name: "",
      price: "",
      category: "",
      description: "",
      extras: [],
    });
    setEditId(null);
    fetchMenu();
    setLoading(false);
    setTimeout(() => setIsFormVisible(false), 300); // Delay to sync with animation
  };

  const handleDeleteMenuItem = async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete("/api/resturant/setMenu", {
      data: { itemId: id },
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchMenu();
  };

  const handleEditClick = (item) => {
    setNewItem({
      name: item.name,
      price: item.price,
      category: item.category,
      description: item.description || "",
      extras: item.extras || [],
    });
    setEditId(item._id);
    setIsFormVisible(true);
  };

  return (
    <RestaurantLayout>
      <Container>
        <div className="heading">
          <h3>Menu Settings</h3>
          <button
            onClick={() => {
              setIsFormVisible(!isFormVisible);
              setEditId(null);
              setNewItem({
                name: "",
                price: "",
                category: "",
                description: "",
                extras: [],
              });
            }}
          >
            + Add Item
          </button>
        </div>

        <MenuForm className={isFormVisible ? "show" : ""}>
          <h3>{editId ? "Update Menu Item" : "Add Menu Item"}</h3>
          <div className="part">
            <input
              type="text"
              placeholder="Item Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Price"
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Category"
              value={newItem.category}
              onChange={(e) =>
                setNewItem({ ...newItem, category: e.target.value })
              }
            />
          </div>
          <input
            type="text"
            placeholder="Description"
            value={newItem.description}
            onChange={(e) =>
              setNewItem({ ...newItem, description: e.target.value })
            }
          />
          <button onClick={handleAddOrUpdateMenuItem} disabled={loading}>
            {loading ? "Processing..." : editId ? "Update Item" : "Add Item"}
          </button>
        </MenuForm>
      </Container>

      <AvailableMenu>
        <div className="Menu-items">
          <h3>Available Menu Items</h3>

          <Table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Availability</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {menu.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>${item.price}</td>
                  <td>
                    <AvailabilityButton
                      available={item.isAvailable}
                      onClick={() => handleToggleAvailability(item._id)}
                    >
                      {item.isAvailable ? "Mark Unavailable" : "Mark Available"}
                    </AvailabilityButton>
                  </td>
                  <td>
                    <ActionButton onClick={() => handleEditClick(item)} update>
                      Update
                    </ActionButton>
                    <ActionButton
                      onClick={() => handleDeleteMenuItem(item._id)}
                      delete
                    >
                      Delete
                    </ActionButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </AvailableMenu>
    </RestaurantLayout>
  );
}

const AvailableMenu = styled.div`
  background-color: white;
  margin-top: 20px;
  border-radius: 20px;
  padding: 20px;
  h3 {
    color: #052855;
    padding-left: 10px;
  }
`;

const Container = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 20px;
  .heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    h3 {
      color: #052855;
    }
    button {
      padding: 7px 25px;
      background-color: #052855;
      color: white;
      border-radius: 10px;
      cursor: pointer;
      border:  none;
    }
  }
`;

const MenuForm = styled.div`
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.5s ease-out, opacity 0.3s ease-out;

  &.show {
    max-height: 500px; /* Adjust according to content height */
    opacity: 1;
  }

  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 30px;
  color: #052855;

  input {
    width: 100%;
    height: 40px;
    border: 1px solid #ddd;
    outline: none;
    padding-left: 10px;
    border-radius: 10px;
  }

  .part {
    display: flex;
    justify-content: space-between;
    gap: 20px;
  }

  button {
    padding: 7px 25px;
    background-color: #052855;
    color: white;
    border-radius: 10px;
    cursor: pointer;
    outline: none;
    border: none;
    &:disabled {
      background-color: gray;
      cursor: not-allowed;
    }
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  th,
  td {
    padding: 10px;
    border-bottom: 1px solid #ddd;
    text-align: left;
    color: #052855;
  }
`;

const AvailabilityButton = styled.button`
  padding: 5px 10px;
  background-color: ${(props) => (props.available ? "green" : "red")};
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
`;

const ActionButton = styled.button`
  padding: 5px 10px;
  margin-right: 5px;
  background-color: ${(props) =>
    props.update ? "#052855" : props.delete ? "red" : "gray"};
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
`;

// export default MenuPage; (removed as it was redundant)
