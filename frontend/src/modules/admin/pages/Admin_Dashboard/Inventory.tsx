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
  ArrowRight,
  Package,
  Trash2
} from 'lucide-react';
import { StorefrontProduct } from "@/types";
import { adminListProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct, adminDeactivateProduct } from "@/modules/admin/services/product-service";
import { getCategories, CategoryDTO } from "@/modules/admin/services/category-service";
import { getBrands, BrandDTO } from "@/modules/admin/services/brand-service";
import { cn } from '@lib/utils';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Inventory() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [brands, setBrands] = useState<BrandDTO[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
  const [brandFilter, setActiveBrandId] = useState<number | null>(null);
  
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Debounce logic for search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(0); // Reset về trang đầu khi tìm kiếm
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: any = { 
        page, 
        size: 10,
        categoryId: categoryFilter || undefined,
        brandId: brandFilter || undefined,
        keyword: debouncedSearchTerm || undefined
      };
      const res: any = await adminListProducts(params);
      setProducts(res.content || []);
      setTotalPages(res.totalPages || 0);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, categoryFilter, brandFilter, debouncedSearchTerm]);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
    getBrands().then(setBrands).catch(console.error);
  }, []);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(products.map(p => p.productId));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectProduct = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    sku: '',
    productName: '',
    brandId: 0,
    categoryId: 0,
    description: '',
    price: 0,
    costPrice: 0,
    variants: [] as any[]
  });

  const openAddDrawer = () => {
    setEditingProduct(null);
    setFormData({
      sku: '',
      productName: '',
      brandId: brands[0]?.id || 1, // Dùng ID thực tế
      categoryId: categories[0]?.categoryId || 1, // Dùng ID thực tế
      description: '',
      price: 0,
      costPrice: 0,
      variants: []
    });
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (product: any) => {
    setEditingProduct(product);
    setFormData({
      sku: product.sku,
      productName: product.productName,
      brandId: brands.find(b => b.name === product.brandName)?.id || 0,
      categoryId: categories.find(c => c.name === product.categoryName)?.id || 0,
      description: product.description || '',
      price: product.price,
      costPrice: product.costPrice || 0,
      variants: product.variants || []
    });
    setIsDrawerOpen(true);
  };

  const handleSaveProduct = async () => {
    try {
      // Đảm bảo brandId và categoryId là số hợp lệ
      const payload = {
        ...formData,
        productName: formData.productName, // Đảm bảo trường này được map rõ ràng
        brandId: Number(formData.brandId) || null,
        categoryId: Number(formData.categoryId) || null,
        variants: formData.variants.map((v: any) => ({
          ...v,
          priceOverride: v.priceOverride ? Number(v.priceOverride) : null
        }))
      };
      
      console.log("Submitting payload:", payload);

      if (editingProduct) {
        await adminUpdateProduct(editingProduct.productId, payload);
      } else {
        await adminCreateProduct(payload);
      }
      setIsDrawerOpen(false);
      fetchProducts();
    } catch (err) {
      console.error("Failed to save product", err);
      alert("Lỗi khi lưu sản phẩm. Vui lòng kiểm tra lại các trường bắt buộc.");
    }
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { variantName: '', color: '', size: '', priceOverride: 0, barcode: `BC-${Date.now()}` }]
    }));
  };

  const removeVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  if (loading && products.length === 0) {
    return <div className="p-20 text-center text-postpurchase-muted italic">Loading products...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-extrabold text-on-surface">Manage Products</h2>
          <p className="text-on-surface-variant mt-1">Full control over your inventory and variants.</p>
        </div>
        <div className="flex gap-4">
          {selectedIds.length > 0 && (
            <Button 
              variant="destructive" 
              className="gap-2 h-11 px-6"
              onClick={async () => {
                if (confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) {
                  await Promise.all(selectedIds.map(id => adminDeleteProduct(id)));
                  setSelectedIds([]);
                  fetchProducts();
                }
              }}
            >
              <Trash2 className="w-5 h-5" />
              Delete Selected ({selectedIds.length})
            </Button>
          )}
          <Button onClick={openAddDrawer} className="gap-2 h-11 px-6">
            <Plus className="w-5 h-5" />
            Add New Product
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant transition-colors group-focus-within:text-primary" />
          <Input 
            placeholder="Search products by name or SKU..." 
            className="pl-14 h-12 bg-white shadow-ambient border-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <select 
              value={categoryFilter || ''}
              onChange={(e) => setCategoryFilter(e.target.value ? parseInt(e.target.value) : null)}
              className="appearance-none h-12 bg-white border border-surface-container-high rounded-xl px-10 text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer shadow-ambient"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
              ))}
            </select>
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
          </div>
        </div>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low text-on-surface-variant">
              <th className="w-12 px-8 py-5">
                 <input 
                   type="checkbox" 
                   checked={products.length > 0 && selectedIds.length === products.length}
                   onChange={handleSelectAll}
                 />
              </th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest">Product</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest">SKU</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-right">Price</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-right">Status</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container">
            {products.map((p) => (
              <tr key={p.productId} className="hover:bg-primary/5 transition-all group">
                <td className="px-8 py-6">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(p.productId)}
                    onChange={() => handleSelectProduct(p.productId)}
                  />
                </td>
                <td className="px-8 py-6">
                  <p className="text-sm font-bold text-on-surface">{p.productName}</p>
                  <p className="text-[10px] text-on-surface-variant uppercase font-bold">{p.categoryName}</p>
                </td>
                <td className="px-8 py-6 text-xs font-mono">{p.sku}</td>
                <td className="px-8 py-6 text-sm font-extrabold text-right">${p.price.toLocaleString()}</td>
                <td className="px-8 py-6 text-right">
                  <Badge variant={p.status === 'ACTIVE' ? 'success' : 'neutral'}>{p.status}</Badge>
                </td>
                <td className="px-8 py-6 text-right flex justify-end gap-2">
                  <Button variant="tertiary" size="sm" onClick={() => openEditDrawer(p)}>Edit</Button>
                  {p.status === 'ACTIVE' ? (
                      <Button variant="outline" size="sm" onClick={() => adminDeactivateProduct(p.productId).then(fetchProducts)}>Deactivate</Button>
                  ) : (
                      <Button variant="tertiary" size="sm" onClick={() => adminUpdateProduct(p.productId, {...p, status: 'ACTIVE'}).then(fetchProducts)}>Activate</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="p-6 flex justify-between items-center border-t border-surface-container">
           <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Page {page + 1} of {totalPages}</p>
           <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}><ChevronLeft className="w-4 h-4"/></Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}><ChevronRight className="w-4 h-4"/></Button>
           </div>
        </div>
      </Card>

      {/* Product Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDrawerOpen(false)} className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto p-10">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                  <button onClick={() => setIsDrawerOpen(false)}><X className="w-6 h-6"/></button>
               </div>

               <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">Product Name</label>
                       <Input value={formData.productName} onChange={e => {
                         console.log("Updating productName to:", e.target.value);
                         setFormData({...formData, productName: e.target.value});
                       }} />
                    </div>
                    <div>
                       <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">SKU</label>
                       <Input value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
                    </div>
                    <div>
                       <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">Category</label>
                       <select className="w-full h-10 border rounded-lg px-3 text-sm" value={formData.categoryId || ''} onChange={e => setFormData({...formData, categoryId: parseInt(e.target.value)})}>
                          <option value="">Select Category</option>
                          {categories && categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
                       </select>
                    </div>
                    <div>
                       <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">Price</label>
                       <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} />
                    </div>
                    <div>
                       <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">Cost Price</label>
                       <Input type="number" value={formData.costPrice} onChange={e => setFormData({...formData, costPrice: parseFloat(e.target.value)})} />
                    </div>
                  </div>

                  <div>
                     <div className="flex justify-between items-center mb-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Product Variants</label>
                        <Button variant="tertiary" size="sm" onClick={addVariant}><Plus className="w-3 h-3 mr-1"/> Add Variant</Button>
                     </div>
                     <div className="space-y-4">
                        {formData.variants.map((v, idx) => (
                          <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-3 gap-4 relative">
                             <button onClick={() => removeVariant(idx)} className="absolute -top-2 -right-2 bg-white text-red-500 border border-red-100 rounded-full p-1 shadow-sm"><X className="w-3 h-3"/></button>
                             <div className="col-span-2">
                                <label className="text-[9px] font-bold uppercase text-slate-400">Variant Name</label>
                                <Input className="h-8 text-xs" value={v.variantName} onChange={e => {
                                   const newV = [...formData.variants];
                                   newV[idx].variantName = e.target.value;
                                   setFormData({...formData, variants: newV});
                                }} />
                             </div>
                             <div>
                                <label className="text-[9px] font-bold uppercase text-slate-400">Color</label>
                                <Input className="h-8 text-xs" value={v.color} onChange={e => {
                                   const newV = [...formData.variants];
                                   newV[idx].color = e.target.value;
                                   setFormData({...formData, variants: newV});
                                }} />
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>

                  <div className="pt-10 flex gap-4">
                     <Button variant="outline" className="flex-1 h-12 bg-white" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
                     <Button className="flex-1 h-12" onClick={handleSaveProduct}>{editingProduct ? 'Update' : 'Create'}</Button>
                  </div>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
