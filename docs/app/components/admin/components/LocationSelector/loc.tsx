'use client';

import React, { useEffect, useState, useRef, useEffectEvent } from "react";
import {
  UseFormRegister,
  UseFormSetValue,
  FieldErrors,
} from "react-hook-form";

interface LocationItem {
  id: number;
  name: string;
}

interface Props {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  errors: FieldErrors<any>;
  defaultLocations?: string[] | string;
 
}

const MultiSelectLocationSelector: React.FC<Props> = ({
  register,
  setValue,
  errors,
  defaultLocations = [],
}) => {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [open, setOpen] = useState(false);

  const [selected, setSelected] = useState<string[]>([]); // ★ Internal state

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load cities
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/location");
        const json = await res.json();
        if (json.success) setLocations(json.locations);
      } catch (err) {
        console.error("Location fetch error", err);
      }
    };
    load();
  }, []);

  // Apply defaults IMMEDIATELY (way faster than watch + setValue)



  const sample = useEffectEvent(() => {
    let safe: string[] = [];
  
    if (Array.isArray(defaultLocations)) {
      safe = defaultLocations;
    } 
    else if (typeof defaultLocations === "string") {
      let str = defaultLocations.trim();
  
      // Remove outer quotes:  `"["All..."]"` → `["All..."]`
      if (str.startsWith('"') && str.endsWith('"')) {
        str = str.slice(1, -1);
      }
  
      try {
        const parsed = JSON.parse(str);
  
        if (Array.isArray(parsed)) {
          safe = parsed.map((x) =>
            String(x).replace(/"/g, "").trim()
          );
        }
      } catch {
        // Fallback: split manually
        safe = str
          .replace(/[\[\]]/g, "")
          .split(",")
          .map((x) => x.replace(/"/g, "").trim())
          .filter(Boolean);
      }
    }
  
    console.log("FINAL SAFE VALUES →", safe);
    setSelected(safe);
  });
  
  

  // Apply defaults whenever defaultLocations changes
useEffect(() => {
  sample();
}, []);

  
useEffect(() => {
  const safe = Array.isArray(selected) ? selected : [];
  setValue("locationAvailability", safe, { shouldValidate: false });
}, [selected, setValue]);




  // Toggle selection
  const toggleCity = (city: string) => {
    setSelected((prev) =>
      prev.includes(city)
        ? prev.filter((c) => c !== city)
        : [...prev, city]
    );
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex-1 relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Location Availability <span className="text-red-500">*</span>
      </label>

      {/* Selected box */}
      <div
  onClick={() => setOpen(!open)}
  className="min-h-[48px] w-full px-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm cursor-pointer flex flex-wrap gap-2"
>
 


{selected.map((city) => (
  <span key={city} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-sm flex items-center gap-1">
    {city}
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleCity(city);
      }}
      className="text-red-500 hover:text-red-700"
    >
      ✕
    </button>
  </span>
))}

</div>


      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto p-3 z-50">
          {/* {loading && <p className="text-sm text-gray-500">Loading...</p>} */}

          {
            locations.map((loc) => (
              <label key={loc.id} className="flex items-center gap-2 py-1 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.includes(loc.name)}   // ★ correct instantly
                  onChange={() => toggleCity(loc.name)}
                  className="h-4 w-4"
                />
                {loc.name}
              </label>
            ))}
            
        </div>
      )}

      {/* hidden RHF field */}
      <input
        type="hidden"
        {...register("locationAvailability", {
          required: "Please select at least one city",
        })}
      />

      {errors.locationAvailability && (
        <p className="mt-1 text-xs text-red-500">
          {String(errors.locationAvailability.message)}
        </p>
      )}
    </div>
  );
};

export default MultiSelectLocationSelector;
