import type { ItemDto } from "@/types/ItemDto";
import type { BagDto } from "@/types/BagDto";
import { useEffect, useState } from "react";
import { BagService } from "@/services/bagService";

function Admin() {
  const [items, setItems] = useState<ItemDto[]>([]);
  const [updating, setUpdating] = useState<Set<number>>(new Set());
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: ''
  });
  const [editingItem, setEditingItem] = useState<ItemDto | null>(null);
  const [checkedOutBags, setCheckedOutBags] = useState<BagDto[]>([]);
  const [loadingCheckedOut, setLoadingCheckedOut] = useState(true);
  const [checkedOutError, setCheckedOutError] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
    fetchCheckedOutBags();
  }, []);

  const fetchItems = () => {
    const itemApi = "/api/items";
    fetch(itemApi)
      .then((response) => {
        return response.json() as Promise<ItemDto[]>;
      })
      .then((data) => {
        console.log("items", data);
        setItems(data);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  };

  const fetchCheckedOutBags = async () => {
    try {
      setLoadingCheckedOut(true);
      const data = await BagService.getCheckedOutBags();
      setCheckedOutBags(data);
      setCheckedOutError(null);
    } catch (error) {
      console.error("Error fetching checked out bags:", error);
      setCheckedOutError("Failed to load checked out bags.");
      setCheckedOutBags([]);
    } finally {
      setLoadingCheckedOut(false);
    }
  };

  const handleToggleFeatured = async (itemId: number, currentFeatured: boolean) => {
    try {
      setUpdating(prev => new Set(prev).add(itemId));
      const itemToUpdate = items.find(item => item.id === itemId);
      if (!itemToUpdate) return;

      const updatedItem = { ...itemToUpdate, featured: !currentFeatured };
      const response = await fetch(`/api/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
      });
      if (response.ok) {
        setItems(prev => prev.map(item =>
          item.id === itemId ? { ...item, featured: !currentFeatured } : item
        ));
      } else {
        alert("Failed to update featured status");
      }
    } catch (error) {
      console.error("Error updating featured:", error);
      alert("Failed to update featured status");
    } finally {
      setUpdating(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setAdding(true);
      const itemData = { ...newItem, price: parseFloat(newItem.price) };
      let response;
      if (editingItem) {
        response = await fetch(`/api/items/${editingItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(itemData),
        });
      } else {
        response = await fetch('/api/items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(itemData),
        });
      }
      if (response.ok) {
        setNewItem({ name: '', description: '', price: '', imageUrl: '', category: '' });
        setEditingItem(null);
        fetchItems(); // Refresh the list
      } else {
        alert(`Failed to ${editingItem ? 'update' : 'add'} item`);
      }
    } catch (error) {
      console.error(`Error ${editingItem ? 'updating' : 'adding'} item:`, error);
      alert(`Failed to ${editingItem ? 'update' : 'add'} item`);
    } finally {
      setAdding(false);
    }
  };

  const handleEditItem = (item: ItemDto) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      imageUrl: item.imageUrl,
      category: item.category
    });
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setNewItem({ name: '', description: '', price: '', imageUrl: '', category: '' });
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      setUpdating(prev => new Set(prev).add(itemId));
      const response = await fetch(`/api/items/${itemId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setItems(prev => prev.filter(item => item.id !== itemId));
      } else {
        alert("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item");
    } finally {
      setUpdating(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  return (
    <div className="card">
      <h2>Admin Panel</h2>

      <section style={{ marginBottom: "30px" }}>
        <h3>Checked Out Bags</h3>
        {loadingCheckedOut ? (
          <p>Loading checked out bags...</p>
        ) : checkedOutError ? (
          <p>{checkedOutError}</p>
        ) : checkedOutBags.length > 0 ? (
          checkedOutBags.map((bag) => (
            <div key={bag.id} className="card" style={{ marginBottom: "16px" }}>
              <h4>Bag #{bag.id}</h4>
              <p>Status: {bag.status || "Checked out"}</p>
              <p>Total: ${bag.subtotal.toFixed(2)}</p>
              <div>
                {bag.items.map((item) => (
                  <div key={item.itemId} style={{ marginBottom: "10px" }}>
                    {item.name} - Quantity: {item.quantity} - ${item.lineTotal.toFixed(2)}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No checked out bags.</p>
        )}
      </section>

      <h3>{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
      <form onSubmit={handleAddItem} style={{ marginBottom: "20px" }}>
        <div>
          <label>Name: <input type="text" value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} required /></label>
        </div>
        <div>
          <label>Description: <textarea value={newItem.description} onChange={(e) => setNewItem({...newItem, description: e.target.value})} required /></label>
        </div>
        <div>
          <label>Price: <input type="number" step="0.01" value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})} required /></label>
        </div>
        <div>
          <label>Image URL: <input type="url" value={newItem.imageUrl} onChange={(e) => setNewItem({...newItem, imageUrl: e.target.value})} required /></label>
        </div>
        <div>
          <label>Category: <input type="text" value={newItem.category} onChange={(e) => setNewItem({...newItem, category: e.target.value})} required /></label>
        </div>
        <button type="submit" disabled={adding}>{adding ? (editingItem ? "Updating..." : "Adding...") : (editingItem ? "Update Item" : "Add Item")}</button>
        {editingItem && <button type="button" onClick={handleCancelEdit} style={{ marginLeft: "10px" }}>Cancel</button>}
      </form>

      <h3>Manage Items</h3>
      {items.length > 0 ? (
        (() => {
          const grouped = items.reduce((acc, item) => {
            if (!acc[item.category]) acc[item.category] = [];
            acc[item.category].push(item);
            return acc;
          }, {} as Record<string, ItemDto[]>);

          const sortedCategories = Object.keys(grouped).sort();

          return sortedCategories.map(category => (
            <div key={category} style={{ marginBottom: "20px" }}>
              <h4>{category}</h4>
              <ul>
                {grouped[category].sort((a, b) => a.name.localeCompare(b.name)).map((item) => (
                  <li key={item.id} style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <strong>{item.name}</strong> - ${item.price.toFixed(2)}
                      <br />
                      <label>
                        <input
                          type="checkbox"
                          checked={item.featured}
                          disabled={updating.has(item.id)}
                          onChange={() => handleToggleFeatured(item.id, item.featured)}
                        />
                        Featured
                        {updating.has(item.id) && " (Updating...)"}
                      </label>
                    </div>
                    <div>
                      <button onClick={() => handleEditItem(item)} style={{ marginRight: "10px" }}>Edit</button>
                      <button onClick={() => handleDeleteItem(item.id)} disabled={updating.has(item.id)} style={{ backgroundColor: "red", color: "white" }}>
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ));
        })()
      ) : (
        <p>Loading items...</p>
      )}
      
    </div>
  );
}

export default Admin;