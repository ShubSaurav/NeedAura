'use server';

import { createServerClient } from '@/lib/supabase';

export interface Vendor {
  id: string;
  name: string;
  category: string;
  verified: boolean;
  logoUrl?: string;
  description: string;
  location: string;
}

export interface VendorProduct {
  id: string;
  vendorId: string;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

/**
 * Server Action: Fetches active vendors in the student's university
 */
export async function getUniversityVendors(): Promise<{ success: boolean; data: Vendor[] }> {
  try {
    const supabase = await createServerClient();

    // Dev mock vendors
    const mockVendors: Vendor[] = [
      {
        id: 'v1',
        name: 'Chitkara Stationery & Prints',
        category: 'Stationery & Printing',
        verified: true,
        logoUrl: '/mock-vendor-stationery.png',
        description: 'Get lab files, assignments printed, and buy books. Pre-order prints to skip the queues!',
        location: 'Student Center, Basement'
      },
      {
        id: 'v2',
        name: 'The Central Cafeteria',
        category: 'Cafeteria & Food',
        verified: true,
        logoUrl: '/mock-vendor-food.png',
        description: 'Daily fresh meals, cold drinks, and snacks. Pre-order snacks and collect from counter 3.',
        location: 'Block C Food Hall'
      },
      {
        id: 'v3',
        name: 'Campus Cycle Repairs',
        category: 'Services',
        verified: false,
        logoUrl: '/mock-vendor-repair.png',
        description: 'Puncture repair, air fill, and used cycles buying/selling point on campus.',
        location: 'Gate 2 parking shed'
      }
    ];

    return { success: true, data: mockVendors };
  } catch (error: any) {
    console.error('Error fetching university vendors:', error);
    return { success: false, data: [] };
  }
}

/**
 * Server Action: Fetches products for a specific vendor
 */
export async function getVendorProducts(vendorId: string): Promise<{ success: boolean; data: VendorProduct[] }> {
  try {
    const supabase = await createServerClient();

    // Dev mock products
    const mockProducts: Record<string, VendorProduct[]> = {
      'v1': [
        { id: 'vp1', vendorId: 'v1', name: 'Assignment File Binder (Black)', price: 35, stock: 120 },
        { id: 'vp2', vendorId: 'v1', name: 'Lab Manual - CS Practical Sheets', price: 90, stock: 45 },
        { id: 'vp3', vendorId: 'v1', name: 'Standard Scientific Calculator cover', price: 150, stock: 12 }
      ],
      'v2': [
        { id: 'vp4', vendorId: 'v2', name: 'Premium Paneer Grill Sandwich', price: 80, stock: 50 },
        { id: 'vp5', vendorId: 'v2', name: 'Chilled Cold Coffee bottle', price: 60, stock: 30 },
        { id: 'vp6', vendorId: 'v2', name: 'Veg Noodles plate', price: 70, stock: 0 }
      ],
      'v3': [
        { id: 'vp7', vendorId: 'v3', name: 'Cycle Tyre Tube (Standard)', price: 180, stock: 8 },
        { id: 'vp8', vendorId: 'v3', name: 'Chain Lubricant Spray bottle', price: 240, stock: 3 }
      ]
    };

    const products = mockProducts[vendorId] || [];
    return { success: true, data: products };
  } catch (error: any) {
    console.error('Error fetching vendor products:', error);
    return { success: false, data: [] };
  }
}

/**
 * Server Action: Updates inventory stock level for a vendor product (called by vendor owner)
 */
export async function updateProductStock(productId: string, newStock: number): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerClient();

    console.log(`Updating product ${productId} stock to ${newStock}`);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
