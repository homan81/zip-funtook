'use client'

import React, {
  useState,
  useEffect,
  type ChangeEvent,
} from 'react'
//import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { PlusCircle, MinusCircle } from 'lucide-react'
import { useForm, useFieldArray, type Resolver } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
//import CategorySelector from '@/app/components/admin/components/CategorySelector/page'
//import LocationSelector from '@/app/components/admin/components/LocationSelector/page'
import CategorySelector from '@/app/components/admin/components/CategorySelector/cat'
import MultiSelectLocationSelector from '@/app/components/admin/components/LocationSelector/loc'
import ProductInfoSections from '@/app/components/admin/components/ProductInfoSections/ProductInfoSections'
import MultiSelectDropdown from '@/app/components/admin/components/MultiSelectDropdown/MultiSelectDropdown'
import MediaLibrary from '@/app/admin/media/server/page'

// ---------- ZOD SCHEMA ----------

const variantSchema = z.object({
  name: z.string().optional().default(""),
  // IMPORTANT: do not allow undefined inside array elements
  options: z.array(z.string().default("")),
});

const faqSchema = z.object({
  question: z.string().optional().default(""),
  answer: z.string().optional().default(""),
});

export const productSchema = z
  .object({
    productName: z.string().min(1, "Product name is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().optional().default(""),
    metaTitle: z.string().optional().default(""),
    metaKeywords: z.string().optional().default(""),
    metaDescription: z.string().optional().default(""),
    category_id: z.coerce.number().positive("Category is required"),
    category: z.string().optional().default(""),
    subcategory_id: z.coerce.number().optional(),
    subcategory: z.string().optional().default(""),

    // correct array form
    locationAvailability: z.array(z.string()).min(1, "Location availability is required"),

    // coerce to numbers and make sure they're not optional/unknown when useForm expects number
    mrp: z.coerce.number().positive("MRP must be greater than 0"),
    sellingPrice: z.coerce.number().positive("Selling price must be greater than 0"),

    discountPercent: z.coerce.number().nonnegative().default(0),
    quantity: z.coerce.number().min(0).default(0),

    unit: z.string().default(""),
    stockQuantity: z.coerce.number().min(0).default(0),

    variants: z.array(variantSchema).nonempty(),
    faqs: z.array(faqSchema).default([]),

    packageInclusion: z.array(z.string()).default([]),
    deliveryDetails: z.array(z.string()).default([]),
    careInfo: z.array(z.string()).default([]),
    product_tags: z.array(z.string()).default([]),

    showPackageInclusion: z.boolean().default(false),
    showFaqs: z.boolean().default(false),
    showDeliveryDetails: z.boolean().default(false),
    showCareInfo: z.boolean().default(false),
    showProductInfo: z.boolean().default(false),
  })
  .refine((data) => data.sellingPrice < data.mrp, {
    message: "Selling price should be less than MRP",
    path: ["sellingPrice"],
  });

export type ProductFormValues = z.infer<typeof productSchema>;


// ---------- HELPERS ----------

const MAX_GALLERY_IMAGES = 5

const generateSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const recalcDiscount = (mrp: number, selling: number) => {
  if (mrp > 0 && selling > 0 && selling < mrp) {
    return Number(
      (((mrp - selling) / mrp) * 100).toFixed(2),
    )
  }
  return 0
}

// ---------- COMPONENT ----------

const AddProductPage: React.FC = () => {

  const [mediaTarget, setMediaTarget] = useState<'product' | 'gallery' | null>(null)
const [showMediaLibrary, setShowMediaLibrary] = useState(false)

const openMediaLibrary = (target: 'product' | 'gallery') => {
  setMediaTarget(target)
  setShowMediaLibrary(true)
}

// Handle selection from Media Library modal
const handleLibrarySelect = (imageOrImages: string | string[]) => {
  if (mediaTarget === 'product') {
    if (Array.isArray(imageOrImages)) {
      // if multiple returned, take the first
      setProductImage(imageOrImages[0] || null)
    } else {
      setProductImage(imageOrImages)
    }
  } else if (mediaTarget === 'gallery') {
    setGalleryImages(prev => {
      const incoming = Array.isArray(imageOrImages) ? imageOrImages : [imageOrImages]
      const availableSlots = MAX_GALLERY_IMAGES - prev.length
      if (availableSlots <= 0) {
        alert(`You can upload up to ${MAX_GALLERY_IMAGES} gallery images.`)
        return prev
      }
      const toAdd = incoming.slice(0, availableSlots)
      if (incoming.length > toAdd.length) {
        alert(`Only ${availableSlots} more image(s) can be added (max ${MAX_GALLERY_IMAGES}).`)
      }
      return [...prev, ...toAdd]
    })
  }
  setShowMediaLibrary(false)
  setMediaTarget(null)
}

const handleLibraryDelete = (imageUrl: string) => {
  // remove from gallery previews if present
  setGalleryImages(prev => prev.filter(i => i !== imageUrl))
  if (productImage === imageUrl) setProductImage(null)
}

  const tagOptions = [
    { label: "Best Seller", value: "best seller" },
    { label: "Exclusive", value: "exclusive" },
    { label: "Trending", value: "trending" },
  ];
  

const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [resetKey, setResetKey] = useState(0);
 // const router = useRouter()

  //const [open, setOpen] = useState(false);

  // Images are handled via local state (best practice with RHF)
  const [productImage, setProductImage] = useState<File | string | null>(null)
  const [galleryImages, setGalleryImages] = useState<Array<File | string>>([])

  const [slugEditedManually, setSlugEditedManually] =
    useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(
    null,
  )
  const [successMessage, setSuccessMessage] =
    useState<string | null>(null)

  // Preview modal
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewTitle, setPreviewTitle] = useState<string>('')
  const [previewIsObjectUrl, setPreviewIsObjectUrl] = useState(false)
  const defaultValues: ProductFormValues = {
    productName: "",
    slug: "",
    description: "",
    metaTitle: "",
    metaKeywords: "",
    metaDescription: "",
    category_id: 0,
    category: "",
    subcategory_id: 0,
    subcategory: "",
    locationAvailability: [],
    mrp: 0,
    sellingPrice: 0,
    discountPercent: 0,
    quantity: 0,
    unit: "",
    stockQuantity: 0,
    variants: [{ name: "", options: [""] }], // matches variantSchema
    faqs: [],
    packageInclusion: [],
    deliveryDetails: [],
    careInfo: [],
    product_tags: [],
    showPackageInclusion: false,
    showFaqs: false,
    showDeliveryDetails: false,
    showCareInfo: false,
    showProductInfo: false,
  }

  const openPreview = (fileOrUrl: File | string, title: string) => {
    if (typeof fileOrUrl === 'string') {
      setPreviewUrl(fileOrUrl)
      setPreviewIsObjectUrl(false)
    } else {
      const url = URL.createObjectURL(fileOrUrl)
      setPreviewUrl(url)
      setPreviewIsObjectUrl(true)
    }
    setPreviewTitle(title)
  }

  const closePreview = () => {
    if (previewUrl && previewIsObjectUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setPreviewTitle('')
    setPreviewIsObjectUrl(false)
  }

  // ---------- REACT HOOK FORM ----------

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    // Explicitly cast resolver to align with our inferred form values.
    resolver: zodResolver(productSchema) as Resolver<ProductFormValues>,
    defaultValues,
  });
  

  // Field arrays
  const { fields: variantFields, append: appendVariant, remove: removeVariant } =
  useFieldArray({ control, name: "variants" });

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({
    control,
    name: 'faqs',
  })

  const { fields: packageFields, append: appendPackage, remove: removePackage } =
    useFieldArray<ProductFormValues, any>({
      control,
      name: "packageInclusion",
    });
  
  const { fields: deliveryFields, append: appendDelivery, remove: removeDelivery } =
    useFieldArray<ProductFormValues, any>({
      control,
      name: "deliveryDetails",
    });

  const { fields: careFields, append: appendCare, remove: removeCare } =
    useFieldArray<ProductFormValues, any>({
      control,
      name: "careInfo",
    });

  // Watches
  const productName = watch('productName')
  const mrp = watch('mrp')
  const sellingPrice = watch('sellingPrice')
  const variantsWatch = watch('variants')
  const showPackageInclusion = watch('showPackageInclusion')
  const showFaqs = watch('showFaqs')
  const showDeliveryDetails = watch('showDeliveryDetails')
  const showCareInfo = watch('showCareInfo')
  const showProductInfo = watch("showProductInfo");
 // const selectedTags = watch("product_tags") || [];


  // ---------- EFFECTS: AUTO SLUG & DISCOUNT ----------

  // Sync slug with product name until user edits slug manually
  useEffect(() => {
    if (!slugEditedManually) {
      setValue('slug', generateSlug(productName || ''))
    }
  }, [productName, slugEditedManually, setValue])

  // Auto recompute discount when mrp or selling change
  useEffect(() => {
    const discount = recalcDiscount(
      Number(mrp) || 0,
      Number(sellingPrice) || 0
    );
  
    setValue("discountPercent", discount, { shouldValidate: false });
  }, [mrp, sellingPrice, setValue]);
  
  // ---------- IMAGE HANDLERS ----------

  const handleProductImageChange = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files
    if (files && files[0]) {
      setProductImage(files[0])
    }
  }

  const handleRemoveProductImage = () => {
    setProductImage(null)
  }

  const handleGalleryImagesChange = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files
    if (!files) return

    const incoming = Array.from(files)
    setGalleryImages(prev => {
      const availableSlots =
        MAX_GALLERY_IMAGES - prev.length
      if (availableSlots <= 0) {
        alert(
          `You can upload up to ${MAX_GALLERY_IMAGES} gallery images.`,
        )
        return prev
      }

      const toAdd = incoming.slice(0, availableSlots)
      if (incoming.length > toAdd.length) {
        alert(
          `Only ${availableSlots} more image(s) can be added (max ${MAX_GALLERY_IMAGES}).`,
        )
      }
      return [...prev, ...toAdd]
    })
  }

  const handleRemoveGalleryImage = (idx: number) => {
    setGalleryImages(prev =>
      prev.filter((_, i) => i !== idx),
    )
  }

  // ---------- VARIANT OPTION HANDLERS (nested arrays) ----------

  const handleAddVariantOption = (variantIdx: number) => {
    const variants = variantsWatch || []
    const updated = variants.map((v, i) =>
      i === variantIdx
        ? {
            ...v,
            options: [...(v.options || []), ''],
          }
        : v,
    )
    setValue('variants', updated)
  }

  const handleRemoveVariantOption = (
    variantIdx: number,
    optionIdx: number,
  ) => {
    const variants = variantsWatch || []
    const updated = variants.map((v, i) => {
      if (i !== variantIdx) return v
      const newOptions = (v.options || []).filter(
        (_, o) => o !== optionIdx,
      )
      return {
        ...v,
        options: newOptions.length
          ? newOptions
          : [''],
      }
    })
    setValue('variants', updated)
  }

  // ---------- SECTION TOGGLES ----------

  const togglePackageInclusion = () => {
    const next = !showPackageInclusion
    setValue('showPackageInclusion', next)
    if (next && packageFields.length === 0) {
      appendPackage('')
    }
  }

  const toggleFaqs = () => {
    const next = !showFaqs
    setValue('showFaqs', next)
    if (next && faqFields.length === 0) {
      appendFaq({ question: '', answer: '' })
    }
  }

  const toggleDeliveryDetails = () => {
    const next = !showDeliveryDetails
    setValue('showDeliveryDetails', next)
    if (next && deliveryFields.length === 0) {
      appendDelivery('')
    }
  }

  const toggleCareInfo = () => {
    const next = !showCareInfo
    setValue('showCareInfo', next)
    if (next && careFields.length === 0) {
      appendCare('')
    }
  }

  // ---------- SUBMIT ----------

  const onSubmit = async (data: ProductFormValues) => {
    setErrorMessage(null);
    setSuccessMessage(null);
  
    // Extra validations for images
    if (!productImage) {
      setErrorMessage("Product image is required.");
      return;
    }
  
    if (galleryImages.length > MAX_GALLERY_IMAGES) {
      setErrorMessage(
        `Maximum ${MAX_GALLERY_IMAGES} gallery images are allowed.`
      );
      return;
    }
  
    try {
      const fd = new FormData();
  
      // Basic fields
      fd.append("productName", data.productName);
      fd.append("slug", data.slug);
      fd.append("description", data.description || "");
      fd.append("category_id", data.category_id.toString());
      fd.append("category", data.category || "");
      // Always append subcategory_id if it exists (even if 0)
      if (data.subcategory_id !== undefined && data.subcategory_id !== null) {
        fd.append("subcategory_id", data.subcategory_id.toString());
      }
      if (data.subcategory) {
        fd.append("subcategory", data.subcategory);
      }
  
      // Location availability
      if (Array.isArray(data.locationAvailability)) {
        data.locationAvailability.forEach((loc, idx) => {
          fd.append(`locationAvailability[${idx}]`, loc);
        });
      }
  
      // Product image
      if (productImage instanceof File) {
        fd.append("productImage", productImage);
      } else if (typeof productImage === 'string') {
        // selected from media library
        fd.append("productImageUrl", productImage);
      }

      // Gallery images (files or media-library URLs)
      galleryImages.forEach((file, idx) => {
        if (file instanceof File) {
          fd.append(`galleryImages[${idx}]`, file as File);
        } else if (typeof file === 'string') {
          fd.append('galleryImageUrls[]', file);
        }
      });
  
      // Variants
      data.variants.forEach((variant, vIdx) => {
        fd.append(`variants[${vIdx}][name]`, variant.name || "");
        (variant.options || []).forEach((opt, oIdx) => {
          fd.append(`variants[${vIdx}][options][${oIdx}]`, opt || "");
        });
      });
  
      // Pricing
      fd.append("mrp", data.mrp.toString());
      fd.append("sellingPrice", data.sellingPrice.toString());
      fd.append("discountPercent", (data.discountPercent ?? 0).toString());
      fd.append("quantity", (data.quantity ?? 0).toString());
      fd.append("unit", data.unit || "");
      fd.append("stockQuantity", (data.stockQuantity ?? 0).toString());
  
      // PRODUCT TAGS
      if (Array.isArray(data.product_tags)) {
        data.product_tags.forEach((tag, idx) => {
          fd.append(`product_tags[${idx}]`, tag);
        });
      }

      // SEO fields
      fd.append('metaTitle', data.metaTitle || '');
      fd.append('metaKeywords', data.metaKeywords || '');
      fd.append('metaDescription', data.metaDescription || '');

      // Build canonical URL from current origin + slug
      try {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const canonical = origin ? `${origin}/product/${data.slug}` : `/product/${data.slug}`;
        fd.append('canonicalUrl', canonical);

        // Build a simple JSON-LD Product schema
        const schema: any = {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: data.productName,
          description: data.description || data.metaDescription || '',
          url: canonical,
        };
        if (productImage) {
          schema.image = typeof productImage === 'string' ? productImage : undefined;
        }
        // price information if available
        if (data.sellingPrice) {
          schema.offers = {
            '@type': 'Offer',
            price: data.sellingPrice,
            priceCurrency: 'INR'
          };
        }

        fd.append('seoSchema', JSON.stringify(schema));
      } catch (e) {
        // ignore
      }
  
      // FAQs
      data.faqs.forEach((faq, idx) => {
        fd.append(`faqs[${idx}][question]`, faq.question || "");
        fd.append(`faqs[${idx}][answer]`, faq.answer || "");
      });
  
      // Package Inclusion
      data.packageInclusion.forEach((item, idx) => {
        fd.append(`packageInclusion[${idx}]`, item || "");
      });
  
      // Delivery Details
      data.deliveryDetails.forEach((item, idx) => {
        fd.append(`deliveryDetails[${idx}]`, item || "");
      });
  
      // Care Info
      data.careInfo.forEach((item, idx) => {
        fd.append(`careInfo[${idx}]`, item || "");
      });
  
      // Toggle fields
      fd.append("showPackageInclusion", JSON.stringify(data.showPackageInclusion));
      fd.append("showFaqs", JSON.stringify(data.showFaqs));
      fd.append("showDeliveryDetails", JSON.stringify(data.showDeliveryDetails));
      fd.append("showCareInfo", JSON.stringify(data.showCareInfo));
  
      const res = await fetch("/api/products", {
        method: "POST",
        body: fd,
      });
  
      let json: any = null;
      try {
        json = await res.json();
      } catch {}
  
      if (!res.ok || !json || json.status !== 200) {
        const msg =
          (json && (json.message || json.error)) ||
          "Failed to create product. Please try again.";
        throw new Error(msg);
      }
  
      // -------------------------
      // SUCCESS — RESET THE FORM
      // -------------------------
      setSuccessMessage("Product created successfully.");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000); // 3 seconds
      // alert("Product created successfully.");
  
      reset(defaultValues);
      setSlugEditedManually(false);
      setSelectedCategoryId(null);
      setResetKey((k) => k + 1);
  
      // Clear image states
      setProductImage(null);
      setGalleryImages([]);
  
      //reload window
      // window.location.reload();
      // Scroll to top
      
      window.scrollTo({ top: 0, behavior: "smooth" });
  
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || "Failed to create product.");
    }
  };
  
  // ---------- RENDER ----------

  return (
    <>
      {/* IMAGE PREVIEW MODAL */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <h2 className="text-sm font-semibold text-gray-800">
                {previewTitle}
              </h2>
              <button
                type="button"
                onClick={closePreview}
                className="text-gray-500 hover:text-gray-700 text-lg"
              >
                ×
              </button>
            </div>
            <div className="relative w-full h-[60vh] bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt={previewTitle}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-linear-to-r from-[#fbeee6] to-[#fff7f2]">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-[#FC6E88]">
                    Add New Product
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    Create a new product for your catalog
                  </p>
                </div>
                <Link
                  href="/admin/products"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[#FC6E88] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FC6E88] transition-colors duration-200"
                >
                  ← Back to Products
                </Link>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-6 space-y-8"
            >
              {/* Alerts */}
              {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}
              {successMessage && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
                  {successMessage}
                </div>
              )}

              {/* Product Name + Slug */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('productName')}
                    placeholder="Enter product name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FC6E88] focus:border-[#FC6E88] text-sm"
                  />
                  {errors.productName && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.productName.message}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('slug', {
                      onChange: e => {
                        const value = e.target.value
                        setSlugEditedManually(
                          value.length > 0,
                        )
                      },
                      onBlur: e => {
                        if (!e.target.value) {
                          setSlugEditedManually(false)
                        }
                      },
                    })}
                    placeholder="Auto-generated from name, editable"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FC6E88] focus:border-[#FC6E88] text-sm"
                  />
                  {errors.slug && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.slug.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  placeholder="Write a short description about the product"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FC6E88] focus:border-[#FC6E88] text-sm"
                />
              </div>

              {/* SEO Fields: Meta Title / Keywords / Description */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                  <input
                    {...register('metaTitle')}
                    placeholder="Page title for SEO"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FC6E88] focus:border-[#FC6E88] text-sm"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta Keywords</label>
                  <input
                    {...register('metaKeywords')}
                    placeholder="Comma-separated keywords"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FC6E88] focus:border-[#FC6E88] text-sm"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                  <input
                    {...register('metaDescription')}
                    placeholder="Short description for search engines"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FC6E88] focus:border-[#FC6E88] text-sm"
                  />
                </div>
              </div>

              {/* Category, Subcategory, Location, tags */}
             

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

{/* Category takes 50% (2 out of 4 columns) */}
<div className="md:col-span-2">
  <CategorySelector
    register={register}
    setValue={setValue}
    errors={errors}
    selectedCategoryId={selectedCategoryId}
    setSelectedCategoryId={setSelectedCategoryId}
  />
</div>

{/* Location takes 25% */}
<div className="md:col-span-1">
  <MultiSelectLocationSelector
    key={`loc-${resetKey}`}
    register={register}
    setValue={setValue}
    errors={errors}
  />
</div>

{/* Tags take 25% */}
<div className="md:col-span-1">
<MultiSelectDropdown
  key={`tags-${resetKey}`}
  label="Product Tags"
  options={tagOptions}
  setValue={setValue}
/>
</div>


</div>



              {/* Product & Gallery Images */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Product Image */}
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-800">
                      Product Image{' '}
                      <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProductImageChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FC6E88] focus:border-[#FC6E88] text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FC6E88] file:text-white hover:file:bg-[#fc6e88d0] file:cursor-pointer"
                  />
                  {productImage && (
                    <div className="mt-4 flex items-center gap-4">
                      <div className="w-24 h-24 border border-gray-200 rounded-lg overflow-hidden">
                        {typeof productImage === 'string' ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={productImage} alt="Product preview" className="w-full h-full object-cover" />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={URL.createObjectURL(productImage)} alt="Product preview" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => openPreview(productImage as File | string, 'Product Image Preview')}
                          className="px-3 py-1 text-xs font-medium border border-gray-300 rounded-lg hover:bg-gray-100"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveProductImage}
                          className="px-3 py-1 text-xs font-medium border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}


<button
  type="button"
  onClick={() => openMediaLibrary('product')}
  className="text-xs text-[#FC6E88] underline"
>
  Select from Media Library
</button>

                </div>

                {/* Gallery Images */}
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-800">
                      Gallery Images
                    </label>
                    <span className="text-[11px] text-gray-500">
                      Up to {MAX_GALLERY_IMAGES} images
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryImagesChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FC6E88] focus:border-[#FC6E88] text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FC6E88] file:text-white hover:file:bg-[#fc6e88d0] file:cursor-pointer"
                  />
                  {galleryImages.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs text-gray-500 mb-2">
                        Gallery previews
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {galleryImages.map((file, idx) => (
                          <div
                            key={idx}
                            className="relative w-24 h-24 border border-gray-200 rounded-lg overflow-hidden"
                          >
                            {typeof file === 'string' ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={file} alt={`Gallery preview ${idx + 1}`} className="w-full h-full object-cover" />
                            ) : (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={URL.createObjectURL(file)} alt={`Gallery preview ${idx + 1}`} className="w-full h-full object-cover" />
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex flex-col justify-center items-center gap-1">
                              <button
                                type="button"
                                onClick={() => openPreview(file as File | string, `Gallery Image ${idx + 1}`)}
                                className="text-[11px] px-2 py-1 bg-white/90 rounded-md text-gray-800"
                              >
                                View
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveGalleryImage(idx)
                                }
                                className="text-[11px] px-2 py-1 bg-red-500 text-white rounded-md"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}


<button
  type="button"
  onClick={() => openMediaLibrary('gallery')}
  className="text-xs text-[#FC6E88] underline"
>
  Select from Media Library
</button>


                </div>
              </div>



              {/* Variants */}
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-800">
                      Variants
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Example: &quot;Choose your balloon color&quot; with
                      options like Red, Blue, Golden.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      appendVariant({
                        name: '',
                        options: [''],
                      })
                    }
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#FC6E88] hover:text-[#e65a74]"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Add Variant
                  </button>
                </div>

                <div className="space-y-4">
                  {variantFields.map((variant, vIdx) => (
                    <div
                      key={variant.id}
                      className="border border-gray-200 rounded-lg bg-white p-3 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-600">
                          Variant {vIdx + 1}
                        </span>
                        {variantFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeVariant(vIdx)}
                            className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
                          >
                            <MinusCircle className="w-4 h-4" />
                            Remove Variant
                          </button>
                        )}
                      </div>

                      {/* Variant Name */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Variant Name
                        </label>
                        <input
                          {...register(
                            `variants.${vIdx}.name` as const,
                          )}
                          placeholder='e.g., "Balloon Color"'
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FC6E88] focus:border-[#FC6E88] text-sm"
                        />
                      </div>

                      {/* Options */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-medium text-gray-700">
                            Options
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              handleAddVariantOption(vIdx)
                            }
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-[#FC6E88] hover:text-[#e65a74]"
                          >
                            <PlusCircle className="w-3 h-3" />
                            Add Option
                          </button>
                        </div>

                        <div className="space-y-2">
                          {(variantsWatch?.[vIdx]?.options ||
                            ['']
                          ).map((opt: string, oIdx: number) => (
                            <div
                              key={`${variant.id}-opt-${oIdx}`}
                              className="flex items-center gap-2"
                            >
                              <input
                                {...register(
                                  `variants.${vIdx}.options.${oIdx}` as const,
                                )}
                                placeholder="Option value (e.g., Red)"
                                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FC6E88] focus:border-[#FC6E88] text-sm"
                              />
                              {(variantsWatch?.[vIdx]?.options
                                ?.length || 0) > 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveVariantOption(
                                      vIdx,
                                      oIdx,
                                    )
                                  }
                                  className="p-1 text-red-500 hover:text-red-600"
                                >
                                  <MinusCircle className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            
             

<label className="flex items-center gap-2">
  <input type="checkbox" {...register("showProductInfo")} />
  Show Additional Product Info
</label>


  {showProductInfo && (
    <ProductInfoSections
      register={register}
      fieldsPackage={packageFields}
      fieldsDelivery={deliveryFields}
      fieldsCare={careFields}
      faqFields={faqFields}
      appendPackage={appendPackage}
      appendDelivery={appendDelivery}
      appendCare={appendCare}
      appendFaq={appendFaq}
      removePackage={removePackage}
      removeDelivery={removeDelivery}
      removeCare={removeCare}
      removeFaq={removeFaq}
      showPackage={showPackageInclusion}
      showDelivery={showDeliveryDetails}
      showCare={showCareInfo}
      showFaqs={showFaqs}
      togglePackage={togglePackageInclusion}
      toggleDelivery={toggleDeliveryDetails}
      toggleCare={toggleCareInfo}
      toggleFaqs = {toggleFaqs}
      

    />
  )}






              {/* Pricing & Inventory */}
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <h2 className="text-sm font-semibold text-gray-800 mb-3">
                  Pricing & Inventory
                </h2>

                <div className="grid md:grid-cols-3 gap-4">
                  {/* MRP */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      MRP <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('mrp')}
                      placeholder="Enter MRP"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FC6E88] focus:border-[#FC6E88] text-sm"
                    />
                    {errors.mrp && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.mrp.message}
                      </p>
                    )}
                  </div>

                  {/* Selling Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Selling Price{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('sellingPrice')}
                      placeholder="Enter selling price"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FC6E88] focus:border-[#FC6E88] text-sm"
                    />
                    {errors.sellingPrice && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.sellingPrice.message}
                      </p>
                    )}
                  </div>

                  {/* Discount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      {...register('discountPercent')}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-sm text-gray-700"
                    />
                    <p className="mt-1 text-[11px] text-gray-500">
                      Calculated automatically from MRP and selling
                      price.
                    </p>
                  </div>
                </div>

                {/* Inventory */}
                <div className="mt-4 grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      step="1"
                      {...register('quantity')}
                      placeholder="e.g., 1"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FC6E88] focus:border-[#FC6E88] text-sm"
                    />
                    {errors.quantity && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.quantity.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit
                    </label>
                    <input
                      {...register('unit')}
                      placeholder="e.g., piece, pack"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FC6E88] focus:border-[#FC6E88] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      step="1"
                      {...register('stockQuantity')}
                      placeholder="Available stock"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FC6E88] focus:border-[#FC6E88] text-sm"
                    />
                    {errors.stockQuantity && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.stockQuantity.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#FC6E88] hover:bg-[#fc6e88d0] disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FC6E88] disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? 'Adding Product...'
                    : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Media Library Modal */}
{showMediaLibrary && (
  <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
    <div className="max-w-4xl w-full h-[80vh] mx-4 bg-white rounded-xl overflow-hidden flex flex-col">
      
      {/* Header */}
      <div className="p-3 flex justify-end border-b shrink-0">
        <button
          onClick={() => setShowMediaLibrary(false)}
          className="text-sm text-gray-600"
        >
          Close
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="p-4 overflow-y-auto flex-1">
        <MediaLibrary
          onSelect={handleLibrarySelect}
          onDelete={handleLibraryDelete}
          multiSelect={mediaTarget === 'gallery'}
        />
      </div>

    </div>
  </div>
)}

    </>
  )
}
export default AddProductPage
 
