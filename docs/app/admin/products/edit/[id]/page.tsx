'use client';

import React, {
  useState,
  useEffect,
  type ChangeEvent,
} from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { PlusCircle, MinusCircle } from 'lucide-react';
import { useForm, useFieldArray,type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import CategorySelector from '@/app/components/admin/components/CategorySelector/cat';
import MultiSelectLocationSelector from '@/app/components/admin/components/LocationSelector/loc';
import ProductInfoSections from '@/app/components/admin/components/ProductInfoSections/ProductInfoSections';
import MultiSelectDropdown from '@/app/components/admin/components/MultiSelectDropdown/MultiSelectDropdown';
import MediaLibrary from '@/app/admin/media/server/page';

// ---------- ZOD SCHEMA (same as Add Product, but fixed locationAvailability) ----------

const variantSchema = z.object({
  name: z.string().optional().default(''),
  options: z.array(z.string().optional().default('')),
});

const faqSchema = z.object({
  question: z.string().optional().default(''),
  answer: z.string().optional().default(''),
});

const productSchema = z
  .object({
    productName: z.string().min(1, 'Product name is required'),
    slug: z.string().min(1, 'Slug is required'),
    description: z.string().optional().default(''),
    metaTitle: z.string().optional().default(''),
    metaKeywords: z.string().optional().default(''),
    metaDescription: z.string().optional().default(''),
    category_id: z.coerce.number().positive('Category is required'),
    category: z.string().optional().default(''),
    subcategory_id: z.coerce.number().optional(),
    subcategory: z.string().optional().default(''),

    // ✅ Proper array schema
    locationAvailability: z
      .array(z.string())
      .min(1, 'Location availability is required'),

    price: z.coerce
      .number()
      .positive('price must be greater than 0'),
    sellingPrice: z.coerce
      .number()
      .positive('Selling price must be greater than 0'),
    discountPercent: z.coerce
      .number()
      .nonnegative()
      .optional() 
      .default(0),
    quantity: z.coerce
      .number()
      .min(0, 'Quantity cannot be negative')
      .optional()
      .default(0),
    unit: z.string().optional().default(''),
    stockQuantity: z.coerce
      .number()
      .min(0, 'Stock cannot be negative')
      .optional()
      .default(0),

    variants: z.array(variantSchema).nonempty(),
    faqs: z.array(faqSchema),

    packageInclusion: z.array(z.string()).default([]),
    deliveryDetails: z.array(z.string()).default([]),
    careInfo: z.array(z.string()).default([]),

    product_tags: z.array(z.string()).optional().default([]),

    showPackageInclusion: z.boolean(),
    showFaqs: z.boolean(),
    showDeliveryDetails: z.boolean(),
    showCareInfo: z.boolean(),
    showProductInfo: z.boolean().optional().default(false),
  })
  .refine(
    data => data.sellingPrice < data.price,
    {
      message: 'Selling price should be less than price',
      path: ['sellingPrice'],
    },
  );

export type ProductFormValues = z.infer<typeof productSchema>;

// ---------- HELPERS ----------

const MAX_GALLERY_IMAGES = 5;

const generateSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const recalcDiscount = (price: number, selling: number) => {
  if (price > 0 && selling > 0 && selling < price) {
    return Number(
      (((price - selling) / price) * 100).toFixed(2),
    );
  }
  return 0;
};

// ---------- COMPONENT ----------

const EditProductPage: React.FC = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const productId = params?.id;
  //console.log("EditProductPage productId:", productId);

  const tagOptions = [
    { label: 'Best Seller', value: 'best seller' },
    { label: 'Exclusive', value: 'exclusive' },
    { label: 'Trending', value: 'trending' },
  ];

  const [selectedCategoryId, setSelectedCategoryId] =
    useState<number | null>(null);

  const [isLoadingProduct, setIsLoadingProduct] = useState(true);

  // Images
  const [productImageFile, setProductImageFile] =
    useState<File | null>(null);
  const [existingProductImageUrl, setExistingProductImageUrl] =
    useState<string | null>(null);

  const [galleryImageFiles, setGalleryImageFiles] = useState<File[]>([]);
  const [existingGalleryImages, setExistingGalleryImages] = useState<
    string[]
  >([]);

  const [slugEditedManually, setSlugEditedManually] =
    useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    null,
  );
  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  // Preview modal
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    null,
  );
  const [previewTitle, setPreviewTitle] = useState<string>('');

  // Media Library modal
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
        setExistingProductImageUrl(imageOrImages[0] || null)
      } else {
        setExistingProductImageUrl(imageOrImages)
      }
    } else if (mediaTarget === 'gallery') {
      setExistingGalleryImages(prev => {
        const incoming = Array.isArray(imageOrImages) ? imageOrImages : [imageOrImages]
        const totalExisting = prev.length
        const totalFiles = galleryImageFiles.length
        const availableSlots = MAX_GALLERY_IMAGES - totalExisting - totalFiles
        if (availableSlots <= 0) {
          toast.error(`You can upload up to ${MAX_GALLERY_IMAGES} gallery images.`)
          return prev
        }
        const toAdd = incoming.slice(0, availableSlots)
        if (incoming.length > toAdd.length) {
          toast.error(`Only ${availableSlots} more image(s) can be added (max ${MAX_GALLERY_IMAGES}).`)
        }
        return [...prev, ...toAdd]
      })
    }
    setShowMediaLibrary(false)
    setMediaTarget(null)
  }

  const handleLibraryDelete = (imageUrl: string) => {
    // remove from gallery previews if present
    setExistingGalleryImages(prev => prev.filter(i => i !== imageUrl))
    if (existingProductImageUrl === imageUrl) setExistingProductImageUrl(null)
  }

  const openPreview = (fileOrUrl: File | string, title: string) => {
    const url =
      typeof fileOrUrl === 'string'
        ? fileOrUrl
        : URL.createObjectURL(fileOrUrl);
    setPreviewUrl(url);
    setPreviewTitle(title);
  };

  const closePreview = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setPreviewTitle('');
  };

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
    resolver: zodResolver(productSchema) as Resolver<ProductFormValues>,
    defaultValues: {
      productName: '',
      slug: '',
      description: '',
      metaTitle: '',
      metaKeywords: '',
      metaDescription: '',
      //category: '',
      //subcategory: '',
      locationAvailability: [],
      price: 0,
      sellingPrice: 0,
      discountPercent: 0,
      quantity: 0,
      unit: '',
      stockQuantity: 0,
      variants: [{ name: '', options: [''] }],
      faqs: [{ question: '', answer: '' }],
      packageInclusion: [],
      deliveryDetails: [],
      careInfo: [],
      product_tags: [],
      showPackageInclusion: false,
      showFaqs: false,
      showDeliveryDetails: false,
      showCareInfo: false,
      showProductInfo: false,
    },
  });

  // Field arrays
  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: 'variants',
  });

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({
    control,
    name: 'faqs',
  });

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
  const productName = watch('productName');
  const price = watch('price');
  const sellingPrice = watch('sellingPrice');
  const variantsWatch = watch('variants');
  const showPackageInclusion = watch('showPackageInclusion');
  const showFaqs = watch('showFaqs');
  const showDeliveryDetails = watch('showDeliveryDetails');
  const showCareInfo = watch('showCareInfo');
  const showProductInfo = watch('showProductInfo');
  const selectedTags = watch('product_tags') || [];

  // ---------- LOAD PRODUCT FOR EDIT ----------

  // useEffect(() => {
  //   const fetchProduct = async () => {
  //     if (!id) return
    
  //     try {
  //       const res = await fetch(`/api/products/${id}`)
  //       const data = await res.json()
  //       const product = Array.isArray(data) ? data[0] : data
     
  //     } catch {
  //       alert('Failed to fetch product details')
    
      
   
  //   }
  //   fetchProduct()
  // },} [id])




  useEffect(() => {
    if (!productId) return;

    const loadProduct = async () => {
      try {
        setIsLoadingProduct(true);
        const res = await fetch(`/api/products/${productId}`);
        const json = await res.json();
//console.log("Product fetch response:", json);
        if (!res.ok || !json.success || !json.product) {
          throw new Error(
            json.message || 'Failed to load product.',
          );
        }

        const p = json.product;

        // ✅ Set existing image URLs
        setExistingProductImageUrl(p.productImage || null);
        // Gallery images come as array of objects with 'image' property
        const galleryUrls = Array.isArray(p.gallery) 
          ? p.gallery.map((img: any) => img.image || img)
          : (p.galleryImages || []);
        setExistingGalleryImages(galleryUrls);

        // Set selected category ID for the CategorySelector
        if (p.category_id) {
          setSelectedCategoryId(p.category_id);
        }

        // Reset form values
        reset({
          productName: p.productName || '',
          slug: p.slug || '',
          description: p.description || '',
          metaTitle: p.metaTitle || '',
          metaKeywords: p.metaKeywords || '',
          metaDescription: p.metaDescription || '',
          category_id: p.category_id || 0,
          category: p.category || '',
          subcategory_id: p.subcategory_id || 0,
          subcategory: p.subcategory || '',
          locationAvailability: Array.isArray(p.locationAvailability)
          ? p.locationAvailability
          : (p.locationAvailability ? [p.locationAvailability] : []),
        
          price: p.price || 0,
          sellingPrice: p.sellingPrice || 0,
          discountPercent:
            typeof p.discountPercent === 'number'
              ? p.discountPercent
              : recalcDiscount(p.price, p.sellingPrice),
          quantity: p.quantity ?? 0,
          unit: p.unit || '',
          stockQuantity: p.stockQuantity ?? 0,
          variants: p.variants && p.variants.length
            ? p.variants
            : [{ name: '', options: [''] }],
          faqs: p.faqs && p.faqs.length
            ? p.faqs
            : [{ question: '', answer: '' }],
          packageInclusion: p.packageInclusion || [],
          deliveryDetails: p.deliveryDetails || [],
          careInfo: p.careInfo || [],
          product_tags: Array.isArray(p.product_tags) ? p.product_tags : [],
          showPackageInclusion:
            typeof p.showPackageInclusion === 'boolean'
              ? p.showPackageInclusion
              : (p.packageInclusion || []).length > 0,
          showFaqs:
            typeof p.showFaqs === 'boolean'
              ? p.showFaqs
              : (p.faqs || []).length > 0,
          showDeliveryDetails:
            typeof p.showDeliveryDetails === 'boolean'
              ? p.showDeliveryDetails
              : (p.deliveryDetails || []).length > 0,
          showCareInfo:
            typeof p.showCareInfo === 'boolean'
              ? p.showCareInfo
              : (p.careInfo || []).length > 0,
          showProductInfo: false,
        });

        toast.success('Product loaded');
      } catch (err: any) {
        console.error(err);
        setErrorMessage(
          err?.message || 'Failed to load product.',
        );
        toast.error(
          err?.message || 'Failed to load product.',
        );
      } finally {
        setIsLoadingProduct(false);
      }
    };

    loadProduct();
  }, [productId, reset]);

  // ---------- EFFECTS: AUTO SLUG & DISCOUNT ----------

  useEffect(() => {
    if (!slugEditedManually) {
      setValue('slug', generateSlug(productName || ''));
    }
  }, [productName, slugEditedManually, setValue]);

  useEffect(() => {
    const discount = recalcDiscount(price || 0, sellingPrice || 0);
    setValue('discountPercent', discount, {
      shouldValidate: false,
    });
  }, [price, sellingPrice, setValue]);

  // ---------- IMAGE HANDLERS ----------

  const handleProductImageChange = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (files && files[0]) {
      setProductImageFile(files[0]);
      // keep existingProductImageUrl just for display if needed
    }
  };

  const handleGalleryImagesChange = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files) return;

    const incoming = Array.from(files);
    setGalleryImageFiles(prev => {
      const totalExisting = existingGalleryImages.length;
      const totalFiles = prev.length;
      const availableSlots =
        MAX_GALLERY_IMAGES - totalExisting - totalFiles;
      if (availableSlots <= 0) {
        toast.error(
          `You can upload up to ${MAX_GALLERY_IMAGES} gallery images.`,
        );
        return prev;
      }

      const toAdd = incoming.slice(0, availableSlots);
      if (incoming.length > toAdd.length) {
        toast.error(
          `Only ${availableSlots} more image(s) can be added (max ${MAX_GALLERY_IMAGES}).`,
        );
      }
      return [...prev, ...toAdd];
    });
  };

  const handleRemoveExistingGalleryImage = (idx: number) => {
    setExistingGalleryImages(prev =>
      prev.filter((_, i) => i !== idx),
    );
  };

  const handleRemoveNewGalleryImage = (idx: number) => {
    setGalleryImageFiles(prev =>
      prev.filter((_, i) => i !== idx),
    );
  };

  // ---------- VARIANT OPTION HANDLERS ----------

  const handleAddVariantOption = (variantIdx: number) => {
    const variants = variantsWatch || [];
    const updated = variants.map((v, i) =>
      i === variantIdx
        ? {
            ...v,
            options: [...(v.options || []), ''],
          }
        : v,
    );
    setValue('variants', updated);
  };

  const handleRemoveVariantOption = (
    variantIdx: number,
    optionIdx: number,
  ) => {
    const variants = variantsWatch || [];
    const updated = variants.map((v, i) => {
      if (i !== variantIdx) return v;
      const newOptions = (v.options || []).filter(
        (_, o) => o !== optionIdx,
      );
      return {
        ...v,
        options: newOptions.length ? newOptions : [''],
      };
    });
    setValue('variants', updated);
  };

  // ---------- SECTION TOGGLES ----------

  const togglePackageInclusion = () => {
    const next = !showPackageInclusion;
    setValue('showPackageInclusion', next);
    if (next && packageFields.length === 0) {
      appendPackage('');
    }
  };

  const toggleFaqs = () => {
    const next = !showFaqs;
    setValue('showFaqs', next);
    if (next && faqFields.length === 0) {
      appendFaq({ question: '', answer: '' });
    }
  };

  const toggleDeliveryDetails = () => {
    const next = !showDeliveryDetails;
    setValue('showDeliveryDetails', next);
    if (next && deliveryFields.length === 0) {
      appendDelivery('');
    }
  };

  const toggleCareInfo = () => {
    const next = !showCareInfo;
    setValue('showCareInfo', next);
    if (next && careFields.length === 0) {
      appendCare('');
    }
  };

  // ---------- SUBMIT (UPDATE) ----------

  const onSubmit = async (data: ProductFormValues) => {
    if (!productId) {
      toast.error('Product ID is missing');
      return;
    }

    console.log('onSubmit called with data:', data);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const fd = new FormData();

      fd.append('productName', data.productName);
      fd.append('slug', data.slug);
      fd.append('description', data.description || '');
      fd.append('category_id', data.category_id.toString());
      fd.append('category', data.category || '');
      if (data.subcategory_id !== undefined && data.subcategory_id !== null) {
        fd.append('subcategory_id', data.subcategory_id.toString());
      }
      if (data.subcategory) {
        fd.append('subcategory', data.subcategory);
      }

      // Location availability
      if (Array.isArray(data.locationAvailability)) {
        data.locationAvailability.forEach((loc, idx) => {
          fd.append(`locationAvailability[${idx}]`, loc);
        });
      }

      // Existing product image path (so backend can keep it if no new file)
      if (existingProductImageUrl) {
        fd.append(
          'existingProductImage',
          existingProductImageUrl,
        );
      }

      // New product image (optional replace)
      if (productImageFile) {
        fd.append('productImage', productImageFile);
      }

      // Existing gallery images (not deleted ones)
      existingGalleryImages.forEach((url, idx) => {
        fd.append(
          `existingGalleryImages[${idx}]`,
          url,
        );
      });

      // New gallery images (Files)
      galleryImageFiles.forEach((file, idx) => {
        fd.append(`galleryImages[${idx}]`, file);
      });

      // Variants
      data.variants.forEach((variant, vIdx) => {
        fd.append(
          `variants[${vIdx}][name]`,
          variant.name || '',
        );
        (variant.options || []).forEach(
          (opt, oIdx) => {
            fd.append(
              `variants[${vIdx}][options][${oIdx}]`,
              opt || '',
            );
          },
        );
      });

      // Pricing & inventory
      fd.append('price', data.price.toString());
      fd.append('sellingPrice', data.sellingPrice.toString());
      fd.append(
        'discountPercent',
        (data.discountPercent ?? 0).toString(),
      );
      fd.append('quantity', (data.quantity ?? 0).toString());
      fd.append('unit', data.unit || '');
      fd.append(
        'stockQuantity',
        (data.stockQuantity ?? 0).toString(),
      );

      // Tags
      (data.product_tags || []).forEach((tag, idx) => {
        fd.append(`product_tags[${idx}]`, tag);
      });

      // SEO fields
      fd.append('metaTitle', (data as any).metaTitle || '');
      fd.append('metaKeywords', (data as any).metaKeywords || '');
      fd.append('metaDescription', (data as any).metaDescription || '');

      // Build canonical URL from origin + slug and JSON-LD schema
      try {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const canonical = origin ? `${origin}/product/${data.slug}` : `/product/${data.slug}`;
        fd.append('canonicalUrl', canonical);

        const schema: any = {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: data.productName,
          description: data.description || (data as any).metaDescription || '',
          url: canonical,
        };
        if (existingProductImageUrl) schema.image = existingProductImageUrl;
        if (data.sellingPrice) {
          schema.offers = { '@type': 'Offer', price: data.sellingPrice, priceCurrency: 'INR' };
        }
        fd.append('seoSchema', JSON.stringify(schema));
      } catch (e) {
        // ignore
      }

      // FAQs
      data.faqs.forEach((faq, idx) => {
        fd.append(
          `faqs[${idx}][question]`,
          faq.question || '',
        );
        fd.append(
          `faqs[${idx}][answer]`,
          faq.answer || '',
        );
      });

      // Lists
      data.packageInclusion.forEach((item, idx) => {
        fd.append(
          `packageInclusion[${idx}]`,
          item || '',
        );
      });
      data.deliveryDetails.forEach((item, idx) => {
        fd.append(
          `deliveryDetails[${idx}]`,
          item || '',
        );
      });
      data.careInfo.forEach((item, idx) => {
        fd.append(`careInfo[${idx}]`, item || '');
      });

      // Toggles
      fd.append(
        'showPackageInclusion',
        JSON.stringify(data.showPackageInclusion),
      );
      fd.append(
        'showFaqs',
        JSON.stringify(data.showFaqs),
      );
      fd.append(
        'showDeliveryDetails',
        JSON.stringify(data.showDeliveryDetails),
      );
      fd.append(
        'showCareInfo',
        JSON.stringify(data.showCareInfo),
      );

      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        body: fd,
      });

      const json = await res.json().catch(() => null);

      console.log('Update response:', { ok: res.ok, status: res.status, json });

      if (!res.ok || !json || !json.success) {
        const msg =
          (json &&
            (json.message || json.error)) ||
          'Failed to update product. Please try again.';
        throw new Error(msg);
      }

      setSuccessMessage('Product updated successfully.');
      toast.success('Product updated successfully.');

      // Redirect to products list after successful update
      setTimeout(() => {
        router.push('/admin/products');
      }, 1000);
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.message || 'Failed to update product.';
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  // ---------- RENDER ----------

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600 text-sm">
          Loading product...
        </div>
      </div>
    );
  }

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
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#fbeee6] to-[#fff7f2]">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-[#FC6E88]">
                    Edit Product
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    Update product details in your catalog
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
              onSubmit={(e) => {
                e.preventDefault();
                console.log('Form onSubmit event triggered');
                handleSubmit(
                  async (data) => {
                    console.log('Form validation passed, data:', data);
                    await onSubmit(data);
                  },
                  (errors) => {
                    console.error('Form validation failed, errors:', errors);
                    const errorMessages = Object.keys(errors).map(key => {
                      const error = errors[key as keyof typeof errors];
                      return `${key}: ${error?.message || 'Invalid'}`;
                    }).join(', ');
                    toast.error(`Please fix validation errors: ${errorMessages}`);
                    setErrorMessage(`Validation errors: ${errorMessages}`);
                  }
                )(e);
              }}
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
                        const value = e.target.value;
                        setSlugEditedManually(value.length > 0);
                      },
                      onBlur: e => {
                        if (!e.target.value) {
                          setSlugEditedManually(false);
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

              {/* Category, Location, Tags */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Category 50% */}
                <div className="md:col-span-2">
                  <CategorySelector
                    register={register}
                    setValue={setValue}
                    errors={errors}
                    selectedCategoryId={selectedCategoryId}
                    setSelectedCategoryId={setSelectedCategoryId}
                    defaultCategory={watch("category")}
                    defaultSubcategory={watch("subcategory")}
                  />
                </div>

                {/* Location 25% */}
                <div className="md:col-span-1">
                  <MultiSelectLocationSelector
                    register={register}
                    setValue={setValue}
                    // watch={watch}
                    errors={errors}
                    defaultLocations={watch("locationAvailability")}
                  />
                </div>

                {/* Tags 25% */}
                <div className="md:col-span-1">
                  <MultiSelectDropdown
                    label="Product Tags"
                    options={tagOptions}
                  //  watch={watch}
                    setValue={setValue}
                    defaultValues={watch("product_tags")}
                  />
                  {selectedTags.length > 0 && (
                    <p className="mt-1 text-[11px] text-gray-500">
                      {selectedTags}
                      {/* Selected: {selectedTags?.join(', ')} */}
                    </p>
                  )}
                </div>
              </div>

              {/* Product & Gallery Images */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Product Image */}
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-800">
                      Product Image
                    </label>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProductImageChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FC6E88] focus:border-[#FC6E88] text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FC6E88] file:text-white hover:file:bg-[#fc6e88d0] file:cursor-pointer"
                  />

                  {/* Existing image */}
                  {existingProductImageUrl && !productImageFile && (
                    <div className="mt-4 flex items-center gap-4">
                      <div className="relative w-24 h-24 border border-gray-200 rounded-lg overflow-hidden">
                        <Image
                          src={existingProductImageUrl}
                          alt="Existing product"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          openPreview(
                            existingProductImageUrl,
                            'Current Product Image',
                          )
                        }
                        className="px-3 py-1 text-xs font-medium border border-gray-300 rounded-lg hover:bg-gray-100"
                      >
                        View
                      </button>
                    </div>
                  )}

                  {/* New uploaded image preview */}
                  {productImageFile && (
                    <div className="mt-4 flex items-center gap-4">
                      <div className="relative w-24 h-24 border border-gray-200 rounded-lg overflow-hidden">
                        <Image
                          src={URL.createObjectURL(productImageFile)}
                          alt="New product preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            openPreview(
                              productImageFile,
                              'New Product Image Preview',
                            )
                          }
                          className="px-3 py-1 text-xs font-medium border border-gray-300 rounded-lg hover:bg-gray-100"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => setProductImageFile(null)}
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

                  {/* Existing gallery images */}
                  {(existingGalleryImages.length > 0 ||
                    galleryImageFiles.length > 0) && (
                    <div className="mt-4">
                      <p className="text-xs text-gray-500 mb-2">
                        Gallery previews
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {/* Existing */}
                        {existingGalleryImages.map((url, idx) => (
                          <div
                            key={`existing-${idx}`}
                            className="relative w-24 h-24 border border-gray-200 rounded-lg overflow-hidden"
                          >
                            <Image
                              src={url}
                              alt={`Existing gallery ${idx + 1}`}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex flex-col justify-center items-center gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  openPreview(
                                    url,
                                    `Existing Gallery Image ${idx + 1}`,
                                  )
                                }
                                className="text-[11px] px-2 py-1 bg-white/90 rounded-md text-gray-800"
                              >
                                View
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveExistingGalleryImage(idx)
                                }
                                className="text-[11px] px-2 py-1 bg-red-500 text-white rounded-md"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* New */}
                        {galleryImageFiles.map((file, idx) => (
                          <div
                            key={`new-${idx}`}
                            className="relative w-24 h-24 border border-gray-200 rounded-lg overflow-hidden"
                          >
                            <Image
                              src={URL.createObjectURL(file)}
                              alt={`New gallery ${idx + 1}`}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex flex-col justify-center items-center gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  openPreview(
                                    file,
                                    `New Gallery Image ${idx + 1}`,
                                  )
                                }
                                className="text-[11px] px-2 py-1 bg-white/90 rounded-md text-gray-800"
                              >
                                View
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveNewGalleryImage(idx)
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
                          {(variantsWatch?.[vIdx]?.options || ['']).map(
                            (opt: string, oIdx: number) => (
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
                                {(variantsWatch?.[vIdx]?.options?.length ||
                                  0) > 1 && (
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
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Extra Info Toggle + Sections */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register('showProductInfo')}
                />
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
                  {/* price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('price')}
                      placeholder="Enter price"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FC6E88] focus:border-[#FC6E88] text-sm"
                    />
                    {errors.price && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.price.message}
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
                      Calculated automatically from price and selling
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
                  disabled={isSubmitting || isLoadingProduct}
                  onClick={(e) => {
                    console.log('Submit button clicked');
                    console.log('Form errors:', errors);
                    console.log('Is submitting:', isSubmitting);
                    console.log('Is loading product:', isLoadingProduct);
                  }}
                  className="w-full bg-[#FC6E88] hover:bg-[#fc6e88d0] disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FC6E88] disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? 'Updating Product...'
                    : 'Update Product'}
                </button>
                {/* Debug: Show validation errors */}
                {Object.keys(errors).length > 0 && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                    <p className="font-semibold text-yellow-800">Validation Errors:</p>
                    <ul className="list-disc list-inside mt-1 text-yellow-700">
                      {Object.entries(errors).map(([key, error]: [string, any]) => (
                        <li key={key}>{key}: {error?.message || 'Invalid'}</li>
                      ))}
                    </ul>
                  </div>
                )}
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
  );
};

export default EditProductPage;