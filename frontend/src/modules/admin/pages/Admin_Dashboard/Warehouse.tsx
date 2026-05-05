import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Skeleton, Input } from '@admin/components/ui';
import { 
  Warehouse as WarehouseIcon, 
  MapPin, 
  Search,
  Package, 
  AlertCircle
} from 'lucide-react';
import { adminGetInventory } from "@/modules/admin/services/product-service";
import axiosClient from '@/api/axiosClient';

export default function Warehouse() {
  const [loading, setLoading] = useState(true);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [inventories, setInventories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce logic for search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [invRes, whRes]: any = await Promise.all([
        adminGetInventory(),
        axiosClient.get('/admin/warehouses')
      ]);
      
      const invData = Array.isArray(invRes) ? invRes : invRes.content || [];
      const whData = Array.isArray(whRes) ? whRes : whRes.content || whRes.data || [];
      
      setInventories(invData);
      setWarehouses(whData);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredInventory = inventories.filter(inv => {
    const matchesSearch = 
      inv.productName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      inv.variantName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      inv.sku?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      inv.warehouseName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading && inventories.length === 0) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-extrabold text-on-surface">Warehouse Operations</h2>
          <p className="text-on-surface-variant mt-1">Manage physical inventory and inter-warehouse logistics.</p>
        </div>
        <Button className="gap-2" onClick={fetchData}>
          Refresh Stock
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {warehouses.map((wh) => (
          <Card key={wh.warehouseId || wh.id} className="p-6 hover:shadow-lg transition-shadow border border-surface-container relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full group-hover:scale-110 transition-transform" />
            
            <div className="flex items-start justify-between relative">
              <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center">
                <WarehouseIcon className="w-6 h-6 text-primary" />
              </div>
              <Badge variant={wh.status === 'ACTIVE' ? 'success' : 'neutral'}>
                {wh.status || 'Optimal'}
              </Badge>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-bold text-on-surface line-clamp-1">{wh.warehouseName || wh.name}</h3>
              <div className="flex items-center gap-1 mt-1 text-on-surface-variant">
                <MapPin className="w-3 h-3" />
                <span className="text-xs font-medium">{wh.location}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant transition-colors group-focus-within:text-primary" />
          <Input 
            placeholder="Search inventory by product name, SKU, or warehouse..." 
            className="pl-14 h-12 bg-white shadow-ambient border-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 bg-surface-container-high/50">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Inventory Stock Levels
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant border-b border-surface-container">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest">Warehouse</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest">Product / Variant</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest">SKU</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-right">Available Stock</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-right">Reserved</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {filteredInventory.map((inv) => {
                const available = inv.quantityOnHand - inv.quantityReserved;
                const isLowStock = available <= inv.reorderThreshold;

                return (
                  <tr key={inv.inventoryId} className="hover:bg-primary/5 transition-all group">
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-on-surface">{inv.warehouseName}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-on-surface">{inv.productName}</p>
                      <p className="text-[10px] text-on-surface-variant uppercase font-bold">{inv.variantName}</p>
                    </td>
                    <td className="px-8 py-6 text-xs font-mono">{inv.sku}</td>
                    <td className="px-8 py-6 text-sm font-extrabold text-right text-indigo-600">{inv.quantityOnHand}</td>
                    <td className="px-8 py-6 text-sm font-extrabold text-right text-amber-600">{inv.quantityReserved}</td>
                    <td className="px-8 py-6 text-center">
                      {isLowStock ? (
                        <Badge variant="error" className="gap-1"><AlertCircle className="w-3 h-3"/> Low Stock</Badge>
                      ) : (
                        <Badge variant="success">Optimal</Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredInventory.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-10 text-center italic text-on-surface-variant">No inventory records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-6 flex justify-between items-center border-t border-surface-container">
           <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Showing {filteredInventory.length} entries</p>
        </div>
      </Card>
    </div>
  );
}
