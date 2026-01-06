'use client';

import React, { useEffect, useState } from 'react';
import { UseFormRegister, UseFormSetValue, FieldErrors } from 'react-hook-form';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Subcategory {
  id: number;
  name: string;
  slug: string;
  category_id: number;
}

interface Props {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  errors: FieldErrors<any>;
  selectedCategoryId: number | null;
  setSelectedCategoryId: (id: number | null) => void;

  defaultCategory?: string;
  defaultSubcategory?: string;
}

const CategorySelector: React.FC<Props> = ({
  register,
  setValue,
  errors,
  selectedCategoryId,
  setSelectedCategoryId,
  defaultCategory,
  defaultSubcategory
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  const filteredSubs = selectedCategoryId
    ? subcategories.filter(s => s.category_id === selectedCategoryId)
    : [];

  // -------------------------------------------
  // LOAD CATEGORY & SUBCATEGORY DATA
  // -------------------------------------------
  useEffect(() => {
    const load = async () => {
      try {
        const [catRes, subRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/subcategories"),
        ]);

        if (catRes.ok) {
          const c = await catRes.json();
          setCategories(c.categories || []);
        }

        if (subRes.ok) {
          const s = await subRes.json();
          setSubcategories(s.subcategories || []);
        }
      } catch (err) {
        console.error("Failed loading category data", err);
      }
    };

    load();
  }, []);

  // ----------------------------------------------------
  // APPLY DEFAULT CATEGORY + SUBCATEGORY ON EDIT
  // ----------------------------------------------------
  useEffect(() => {
    if (!defaultCategory || categories.length === 0) return;

    // find category ID by name
    const foundCategory = categories.find(
      c => c.name === defaultCategory
    );

    if (foundCategory) {
      setSelectedCategoryId(foundCategory.id);
      setValue("category_id", foundCategory.id);
      setValue("category", foundCategory.name);
    }

    // Now set default subcategory if it belongs
    if (defaultSubcategory && subcategories.length > 0) {
      const foundSub = subcategories.find(
        s =>
          s.name === defaultSubcategory &&
          foundCategory &&
          s.category_id === foundCategory.id
      );

      if (foundSub) {
        setValue("subcategory_id", foundSub.id);
        setValue("subcategory", foundSub.name);
      }
    }

  }, [categories, subcategories, defaultCategory, defaultSubcategory]);

  return (
    <div className="flex flex-col md:flex-row gap-4">

      {/* CATEGORY */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category <span className="text-red-500">*</span>
        </label>

        <select
          className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm 
                     focus:ring-2 focus:ring-[#FC6E88] focus:border-[#FC6E88] text-sm bg-white"
          value={selectedCategoryId ?? ""}
          onChange={(e) => {
            const id = e.target.value ? Number(e.target.value) : null;
            setSelectedCategoryId(id);

            const cat = categories.find(c => c.id === id);
            setValue("category_id", id || 0);
            setValue("category", cat ? cat.name : "");
            setValue("subcategory_id", 0);
            setValue("subcategory", "");
          }}
        >
          <option value="">Select Category</option>

          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {errors.category_id && (
          <p className="mt-1 text-xs text-red-500">{errors.category_id.message as string}</p>
        )}
      </div>

      {/* SUBCATEGORY */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subcategory
        </label>

        <select
          {...register("subcategory_id")}
          disabled={!selectedCategoryId}
          onChange={(e) => {
            const id = e.target.value ? Number(e.target.value) : 0;
            const sub = filteredSubs.find(s => s.id === id);
            setValue("subcategory_id", id);
            setValue("subcategory", sub ? sub.name : "");
          }}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm 
                     focus:ring-2 focus:ring-[#FC6E88] focus:border-[#FC6E88] text-sm 
                     bg-white disabled:bg-gray-100 disabled:text-gray-400"
        >
          <option value="0">Select Subcategory</option>

          {filteredSubs.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
};

export default CategorySelector;
