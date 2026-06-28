'use client';
import Header from '@/components/Header';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, ShieldCheck, MapPin, Package, Cpu, Edit, Save, Plus, ArrowRight, X, AlertCircle, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { getUniversityVendors, getVendorProducts, updateProductStock, Vendor, VendorProduct } from '@/actions/vendorActions';

export default function VendorPortal() {
  const [isOwnerMode, setIsOwnerMode] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<VendorProduct[]>([]);
  const [loadingVendors, setLoadingVendors] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Pre-order dialogue
  const [preorderProduct, setPreorderProduct] = useState<VendorProduct | null>(null);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);

  // Edit stock map for owner mode
  const [editingStock, setEditingStock] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadVendors() {
      setLoadingVendors(true);
      const result = await getUniversityVendors();
      if (result.success) {
        setVendors(result.data);
        if (result.data.length > 0) {
          // Select first vendor by default
          setSelectedVendor(result.data[0]);
        }
      }
      setLoadingVendors(false);
    }
    loadVendors();
  }, []);

  useEffect(() => {
    if (!selectedVendor) return;
    const vendorId = selectedVendor.id;

    async function loadProducts() {
      setLoadingProducts(true);
      const result = await getVendorProducts(vendorId);
      if (result.success) {
        setProducts(result.data);
        // Initialize stock edits
        const stockMap: Record<string, string> = {};
        result.data.forEach((p) => {
          stockMap[p.id] = p.stock.toString();
        });
        setEditingStock(stockMap);
      }
      setLoadingProducts(false);
    }
    loadProducts();
  }, [selectedVendor]);

  const handleStockChange = (productId: string, val: string) => {
    setEditingStock((prev) => ({ ...prev, [productId]: val }));
  };

  const handleSaveStock = async (productId: string) => {
    const newStockVal = parseInt(editingStock[productId] || '0');
    if (isNaN(newStockVal)) return;

    const result = await updateProductStock(productId, newStockVal);
    if (result.success) {
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock: newStockVal } : p))
      );
    }
  };

  const handlePreorder = () => {
    if (!preorderProduct) return;
    setIsOrdering(true);
    setTimeout(() => {
      setIsOrdering(false);
      setOrderCompleted(true);
      
      // Reduce local stock by 1
      setProducts((prev) =>
        prev.map((p) => (p.id === preorderProduct.id ? { ...p, stock: Math.max(0, p.stock - 1) } : p))
      );
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-bg-dark text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Cyberpunk Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Header navbar */}
      <Header />

      {/* Main Workspace grid */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Column: Vendor Shops list */}
        <div className="md:col-span-4 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-display text-white flex items-center gap-1.5">
              <Store className="w-5 h-5 text-brand-blue" /> Campus Vendors
            </h2>
            <p className="text-xs text-slate-500 font-mono">Campus Outlets</p>
          </div>

          <div className="space-y-3.5">
            {loadingVendors ? (
              [1, 2].map((n) => (
                <div key={n} className="h-32 border border-card-border rounded-xl bg-card-dark/40 animate-pulse" />
              ))
            ) : (
              vendors.map((vendor) => (
                <div
                  key={vendor.id}
                  onClick={() => setSelectedVendor(vendor)}
                  className={`
                    glass-panel rounded-xl p-4 cursor-pointer border transition-all duration-300 bg-card-dark
                    ${selectedVendor?.id === vendor.id 
                      ? 'border-brand-blue bg-brand-blue/5 shadow-[0_0_15px_rgba(0,102,255,0.05)]' 
                      : 'border-card-border hover:border-brand-blue/30'}
                  `}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-bold text-white text-sm font-display block">{vendor.name}</span>
                    {vendor.verified && (
                      <ShieldCheck className="w-4 h-4 text-emerald-400 fill-emerald-500/10 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {vendor.description}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono mt-3.5 pt-2.5 border-t border-card-border/20">
                    <MapPin className="w-3 h-3 text-brand-orange" />
                    <span>{vendor.location}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Shop Catalog & Stock Editor */}
        <div className="md:col-span-8 space-y-6">
          {selectedVendor ? (
            <>
              {/* Selected Shop details header */}
              <div className="p-5 bg-slate-950/40 border border-card-border rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="blue">{selectedVendor.category}</Badge>
                  <Badge variant="slate" className="text-[10px]">{selectedVendor.location}</Badge>
                </div>
                <h3 className="text-2xl font-bold font-display text-white">{selectedVendor.name}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{selectedVendor.description}</p>
              </div>

              {/* Product list */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-white text-base font-display flex items-center gap-2">
                    <Package className="w-4 h-4 text-brand-orange" />
                    {isOwnerMode ? 'Modify Catalog Inventory' : 'Product Inventory Showcase'}
                  </h4>
                  <span className="text-xs text-slate-500 font-mono">{products.length} products listed</span>
                </div>

                {loadingProducts ? (
                  [1, 2].map((n) => (
                    <div key={n} className="h-24 border border-card-border rounded-xl bg-card-dark/40 animate-pulse" />
                  ))
                ) : products.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {products.map((p) => (
                      <Card key={p.id} className="border-card-border hover:border-brand-blue/10 transition-colors">
                        <CardContent className="p-4 flex items-center justify-between flex-wrap gap-4">
                          <div className="space-y-1">
                            <span className="font-semibold text-white text-sm font-display">{p.name}</span>
                            <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                              <span>Price: ₹{p.price}</span>
                              <span>&bull;</span>
                              <span className={p.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                                {p.stock > 0 ? `${p.stock} units in stock` : 'Out of stock'}
                              </span>
                            </div>
                          </div>

                          {/* Controls: Owner stock input OR Student pre-order button */}
                          {isOwnerMode ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500 font-mono">Stock:</span>
                              <Input
                                type="number"
                                value={editingStock[p.id] || '0'}
                                onChange={(e) => handleStockChange(p.id, e.target.value)}
                                className="w-20 text-center text-xs h-9 bg-slate-950/40"
                              />
                              <Button 
                                variant="secondary" 
                                size="sm" 
                                onClick={() => handleSaveStock(p.id)}
                                className="h-9 px-3 gap-1.5"
                              >
                                <Save className="w-3.5 h-3.5 text-brand-blue" /> Save
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              variant={p.stock > 0 ? 'primary' : 'secondary'} 
                              size="sm" 
                              disabled={p.stock === 0}
                              onClick={() => {
                                setPreorderProduct(p);
                                setOrderCompleted(false);
                              }}
                              className="gap-1.5 text-xs font-semibold"
                              glow={p.stock > 0}
                            >
                              <ShoppingCart className="w-4 h-4" /> Pre-order Pickup
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed border-card-border rounded-xl p-12 text-center bg-slate-900/10 flex flex-col items-center justify-center">
                    <Package className="w-10 h-10 text-slate-700 mb-3" />
                    <h4 className="font-bold text-slate-300">Catalog is empty</h4>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
                      No products have been listed by this vendor outlet yet.
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="h-80 border border-dashed border-card-border rounded-xl flex items-center justify-center text-slate-500 font-mono p-6 text-center">
              Select a campus vendor outlet to view its products inventory.
            </div>
          )}
        </div>

      </main>

      {/* Pre-order Dialogue Modal */}
      <AnimatePresence>
        {preorderProduct && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md"
            >
              <Card className="border-brand-blue/30 shadow-[0_0_20px_rgba(0,102,255,0.05)] relative overflow-hidden bg-card-dark">
                <button
                  onClick={() => setPreorderProduct(null)}
                  className="absolute top-4 right-4 p-1.5 hover:bg-slate-900 rounded-lg text-slate-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-1.5">
                    <ShoppingCart className="w-5 h-5 text-brand-blue" /> Pre-order Printable/Snack
                  </CardTitle>
                  <CardDescription>Order item and reserve it. Skip lines and pick up directly from campus counters.</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {orderCompleted ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-center py-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 text-xl font-bold animate-bounce">
                        ✓
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-white text-base font-display">Pre-order Successful!</h4>
                        <p className="text-slate-400 text-xs leading-relaxed max-w-xs mx-auto">
                          Item reserved. Please head over to the counter and show your student ID. Pay ₹{preorderProduct.price} at pickup counter.
                        </p>
                      </div>
                      <Button variant="secondary" onClick={() => setPreorderProduct(null)} className="w-full">
                        Done
                      </Button>
                    </motion.div>
                  ) : (
                    <>
                      <div className="p-4 bg-slate-950/60 rounded-xl border border-card-border space-y-2 text-sm">
                        <div className="flex justify-between text-slate-400">
                          <span>Product Name:</span>
                          <span className="text-white font-semibold">{preorderProduct.name}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Store Outlet:</span>
                          <span className="text-white font-medium">{selectedVendor?.name}</span>
                        </div>
                        <div className="flex justify-between text-slate-400 pt-2 border-t border-card-border/20 font-bold">
                          <span>Amount Due (on handover):</span>
                          <span className="text-brand-orange font-mono">₹{preorderProduct.price}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          onClick={() => setPreorderProduct(null)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button 
                          variant="primary" 
                          glow
                          onClick={handlePreorder}
                          disabled={isOrdering}
                          className="flex-1"
                        >
                          {isOrdering ? 'Reserving...' : 'Confirm Pre-order'}
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
