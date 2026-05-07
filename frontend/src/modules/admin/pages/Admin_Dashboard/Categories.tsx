import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/modules/admin/services/category-service';

const Categories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  const handleAdd = async () => {
    await createCategory({ name, description });
    setName('');
    setDescription('');
    fetchCategories();
  };

  const handleDelete = async (id: number) => {
    await deleteCategory(id);
    fetchCategories();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <div className="mb-4 flex gap-2">
        <input className="border p-2" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input className="border p-2" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <button className="bg-blue-500 text-white p-2" onClick={handleAdd}>Add</button>
      </div>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(c => (
            <tr key={c.categoryId}>
              <td className="border p-2">{c.categoryId}</td>
              <td className="border p-2">{c.categoryName}</td>
              <td className="border p-2">{c.description}</td>
              <td className="border p-2">
                <button className="text-red-500" onClick={() => handleDelete(c.categoryId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Categories;
