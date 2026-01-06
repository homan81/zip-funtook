'use client';

import React, { useState, useEffect, useRef, useEffectEvent } from "react";
import { UseFormSetValue } from "react-hook-form";

interface Props {
  label: string;
  options: { label: string; value: string }[];
  setValue: UseFormSetValue<any>;
  defaultValues?: string[] | string;
}

const MultiSelectDropdown: React.FC<Props> = ({
  label,
  options,
  setValue,
  defaultValues = [],
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Internal selected tags state
  const [selected, setSelected] = useState<string[]>([]);

  // Load defaults into selected[]
  const sample = useEffectEvent(() => {
    let safe: string[] = [];
  
    if (Array.isArray(defaultValues)) {
      safe = defaultValues;
    } 
    else if (typeof defaultValues === "string") {
      const str = defaultValues.trim();
  
      // CASE 1: JSON string → ["Exclusive","Trending"]
      if (str.startsWith("[") && str.endsWith("]")) {
        try {
          safe = JSON.parse(str);
        } catch {
          safe = [];
        }
      }
      // CASE 2: Comma separated → "Exclusive, Trending"
      else {
        safe = str.split(",").map((s) => s.replace(/"/g, "").trim());
      }
    }
  
    setSelected(safe);
  });
  

  useEffect(() => {
    sample();
  }, []);

  // Sync selected → RHF
useEffect(() => {
  setValue("product_tags", selected, { shouldValidate: true });
}, [selected, setValue]);

  // Toggle tag selection
  const toggleValue = (value: string) => {
    setSelected((prev) =>
      prev.includes(value)
        ? prev.filter((val) => val !== value)
        : [...prev, value]
    );
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="text-sm font-medium">{label}</label>

      {/* Selected Chips */}
      <div
        onClick={() => setOpen(!open)}
        className="min-h-[48px] w-full px-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm cursor-pointer flex flex-wrap gap-2"
      >
        {selected.length > 0 ? (
          selected.map((val) => (
            <span
              key={val}
              className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-sm flex items-center gap-1"
            >
              {val}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleValue(val);
                }}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </span>
          ))
        ) : (
          <span className="text-gray-500">Select Tags</span>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto p-3 z-50">
          {options.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(opt.value)} // SAME AS LOCATION
                onChange={() => toggleValue(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
