import { Card, Button, Badge, Input, Skeleton } from '@admin/components/ui';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  SlidersHorizontal,
  X,
  Upload,
  ArrowRight
} from 'lucide-react';
import { MOCK_PRODUCTS, Product } from '@admin/types';
import { cn } from '@lib/utils';
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Inventory() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [sortConfig, setSortConfig] = useState<{ field: 'name' | 'price' | 'stock', order: 'asc' | 'desc' }>({
    field: 'name',
    order: 'asc'
  });

  const categories = ['All Categories', ...new Set(MOCK_PRODUCTS.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All Categories' || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    const field = sortConfig.field;
    if (sortConfig.order === 'asc') {
      if (a[field] < b[field]) return -1;
      if (a[field] > b[field]) return 1;
      return 0;
    } else {
      if (a[field] < b[field]) return 1;
      if (a[field] > b[field]) return -1;
      return 0;
    }
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredProducts.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectProduct = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openAddDrawer = () => {
    setEditingProduct(null);
    setSelectedImages([]);
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (product: Product) => {
    setEditingProduct(product);
    setSelectedImages(product.image ? [product.image] : []);
    setIsDrawerOpen(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setSelectedImages(prev => [...prev, ...imageUrls].slice(0, 4)); // Limit to 4 for demo
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>

        <Card className="p-6">
           <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-24" />
           </div>
           <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
           </div>
        </Card>
      </div>
    );
  }

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-extrabold text-on-surface">Manage Products</h2>
          <p className="text-on-surface-variant mt-1">View, edit, and manage your entire product catalog.</p>
        </div>
        <Button onClick={openAddDrawer} className="gap-2 h-11 px-6 shadow-ambient">
          <Plus className="w-5 h-5" />
          Add New Product
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant transition-colors group-focus-within:text-primary" />
          <Input 
            placeholder="Search products by name, SKU, or category..." 
            className="pl-14 h-12 bg-white shadow-ambient border-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none h-12 bg-white border border-surface-container-high rounded-xl px-10 text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer shadow-ambient"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
          </div>
          <div className="flex bg-white rounded-xl border border-surface-container-high shadow-ambient overflow-hidden">
            <div className="relative">
              <select 
                value={sortConfig.field}
                onChange={(e) => setSortConfig(prev => ({ ...prev, field: e.target.value as any }))}
                className="appearance-none h-12 bg-transparent pl-10 pr-8 text-sm font-bold focus:outline-hidden cursor-pointer"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="stock">Stock</option>
              </select>
              <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
            </div>
            <div className="w-px bg-surface-container-high my-2" />
            <button 
              onClick={() => setSortConfig(prev => ({ ...prev, order: prev.order === 'asc' ? 'desc' : 'asc' }))}
              className="h-12 px-4 hover:bg-surface-container transition-colors font-bold text-xs flex items-center gap-2"
            >
              {sortConfig.order === 'asc' ? 'Ascending' : 'Descending'}
            </button>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden border border-surface-container-high/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant">
                <th className="w-12 px-8 py-5">
                   <input 
                     type="checkbox" 
                     className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20" 
                     checked={filteredProducts.length > 0 && selectedIds.length === filteredProducts.length}
                     onChange={handleSelectAll}
                   />
                </th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest">Product Details</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest">Category</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest">SKU</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest">Price</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest">Stock Level</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-primary/5 transition-all group">
                    <td className="px-8 py-6">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20" 
                        checked={selectedIds.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                      />
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-8 h-8 text-on-surface-variant/20"><Package className="w-8 h-8" /></div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{product.name}</p>
                          <p className="text-xs text-on-surface-variant font-medium mt-0.5">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-medium text-on-surface-variant">{product.category}</td>
                    <td className="px-8 py-6 text-xs font-mono font-medium text-on-surface-variant">{product.sku}</td>
                    <td className="px-8 py-6 text-sm font-extrabold text-on-surface">${product.price.toFixed(2)}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                         <span className={cn(
                           "w-2 h-2 rounded-full",
                           product.status === 'In Stock' ? 'bg-green-500' : product.status === 'Low Stock' ? 'bg-amber-500' : 'bg-red-500'
                         )} />
                         <span className="text-xs font-bold text-on-surface-variant">
                           {product.stock} in stock
                         </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="tertiary" size="sm" onClick={() => openEditDrawer(product)}>Edit</Button>
                        <button className="p-2 hover:bg-surface-container rounded-lg transition-colors inline-block">
                          <MoreVertical className="w-4 h-4 text-on-surface-variant" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-surface-container rounded-full">
                        <Search className="w-8 h-8 text-on-surface-variant" />
                      </div>
                      <p className="text-sm font-bold text-on-surface">No products found</p>
                      <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
                        Try adjusting your search or filters to find what you're looking for.
                      </p>
                      <Button variant="outline" size="sm" onClick={() => { setSearchTerm(''); setCategoryFilter('All Categories'); }}>
                        Clear all filters
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-surface-container-bright flex items-center justify-between border-t border-surface-container">
           <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Showing {filteredProducts.length} of {products.length} products</p>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-surface-container rounded-md transition-colors disabled:opacity-30" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-surface-container rounded-md transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* Product Management Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="fixed inset-0 bg-on-surface/20 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-8 h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-display font-extrabold">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <button onClick={closeDrawer} className="p-2 hover:bg-surface-container rounded-full transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex-1 space-y-8">
                  <div className="space-y-4">
                    <p className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest">Product Imagery</p>
                    
                    {selectedImages.length > 0 ? (
                      <div className="grid grid-cols-4 gap-4">
                        {selectedImages.map((url, index) => (
                          <div key={index} className="relative aspect-square rounded-xl overflow-hidden group border border-surface-container-high">
                            <img src={url} alt="" className="w-full h-full object-cover" />
                            <button 
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        {selectedImages.length < 4 && (
                          <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square rounded-xl bg-surface-container border-2 border-dashed border-outline-variant flex items-center justify-center hover:bg-surface-container-high transition-colors"
                          >
                            <Plus className="w-5 h-5 text-on-surface-variant" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div 
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                          "w-full h-48 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group",
                          isDragging 
                            ? "bg-primary/5 border-primary ring-4 ring-primary/10" 
                            : "bg-surface-container border-outline-variant hover:bg-surface-container-high"
                        )}
                      >
                         <Upload className={cn(
                           "w-8 h-8 transition-colors",
                           isDragging ? "text-primary" : "text-on-surface-variant group-hover:text-primary"
                         )} />
                         <div className="text-center">
                           <p className="text-sm font-bold">Click to upload or drag & drop</p>
                           <p className="text-xs text-on-surface-variant font-medium mt-1">PNG, JPG up to 10MB</p>
                         </div>
                      </div>
                    )}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileSelect} 
                      className="hidden" 
                      accept="image/*" 
                      multiple 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2 col-span-2">
                      <label className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest px-1">Product Name</label>
                      <Input placeholder="e.g. Minimalist Ceramic Vase" defaultValue={editingProduct?.name} className="h-12 bg-surface-container-low font-bold" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest px-1">Category</label>
                       <select className="appearance-none w-full h-12 bg-surface-container-low rounded-xl px-4 text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-primary/40 transition-all border-none">
                         <option>Electronics</option>
                         <option>Furniture</option>
                         <option>Apparel</option>
                         <option>Home Goods</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest px-1">SKU</label>
                       <Input placeholder="PRD-0000" defaultValue={editingProduct?.sku} className="h-12 bg-surface-container-low font-bold" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest px-1">Price (USD)</label>
                       <Input type="number" step="0.01" defaultValue={editingProduct?.price} className="h-12 bg-surface-container-low font-bold" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest px-1">Initial Stock</label>
                       <Input type="number" defaultValue={editingProduct?.stock} className="h-12 bg-surface-container-low font-bold" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest px-1">Description</label>
                    <textarea 
                      className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-primary/40 h-32 transition-all resize-none"
                      placeholder="Enter detailed product description..."
                    />
                  </div>
                </div>

                <div className="pt-8 border-t border-surface-container flex gap-4 mt-8">
                  <Button variant="outline" className="flex-1 h-14 bg-white" onClick={closeDrawer}>Cancel</Button>
                  <Button className="flex-2 h-14 gap-2" onClick={closeDrawer}>
                    {editingProduct ? 'Update Product' : 'Create Product'}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

import { Package } from 'lucide-react';
