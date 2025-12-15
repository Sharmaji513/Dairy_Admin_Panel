import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Edit } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { toast } from "sonner";
import { AddVariantModal } from "../components/modals/AddVariantModal";
import { useApiProducts } from "../lib/hooks/useApiProducts";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function ProductVariants() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);

  const { products } = useApiProducts({ page: 1, limit: 1000 });

  useEffect(() => {
    if (!products?.length) return;
    const found = products.find(p => String(p.id) === String(id));
    if (!found) return;
    setProduct(found);
    setVariants(found.availableQuantities || []);
    setLoading(false);
  }, [products, id]);

  const normalizeVariant = (raw, fallback = {}) => {
    let imageUrl = fallback.image || null;
    if (raw.image) {
      imageUrl = raw.image.startsWith("http") ? raw.image : `${BASE_URL}${raw.image}`;
    } else if (fallback.imageData?.preview) {
      imageUrl = fallback.imageData.preview;
    }
    return {
      _id: raw._id || fallback._id || Date.now(), // temporary _id for new variant
      label: raw.label ?? fallback.label ?? "",
      value: Number(raw.value ?? fallback.value ?? 0),
      unit: raw.unit ?? fallback.unit ?? "ml",
      price: Number(raw.price ?? fallback.price ?? 0),
      stock: Number(raw.stock ?? fallback.stock ?? 0),
      image: imageUrl,
    };
  };

  const handleAddOrEditVariant = async (data) => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return toast.error("Not logged in");

      const formData = new FormData();
      formData.append("label", data.label);
      formData.append("value", Number(data.value));
      formData.append("unit", data.unit);
      formData.append("price", Number(data.price));
      formData.append("stock", Number(data.stock));

      if (data.imageData?.type === "file") formData.append("image", data.imageData.value);
      if (data.imageData?.type === "url") formData.append("imageUrl", data.imageData.value);

      const url = editingVariant
        ? `${BASE_URL}/api/products/${id}/variant/${editingVariant._id}`
        : `${BASE_URL}/api/products/${id}/variant`;

      const res = await fetch(url, {
        method: editingVariant ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Variant save failed");

      const apiVariant = await res.json();
      const finalVariant = normalizeVariant(apiVariant, { ...data, _id: editingVariant?._id });

      setVariants(prev =>
        editingVariant
          ? prev.map(v => (v._id === editingVariant._id ? finalVariant : v))
          : [...prev, finalVariant]
      );

      toast.success(editingVariant ? "Variant updated" : "Variant added");

      setIsAddModalOpen(false);
      setEditingVariant(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteVariant = async (variantId) => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return toast.error("Not logged in");

      const res = await fetch(`${BASE_URL}/api/products/${id}/variant/${variantId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Delete failed");

      setVariants(prev => prev.filter(v => v._id !== variantId));
      toast.success("Variant deleted");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!product) return <div className="p-6">Product not found</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/products")}>
            <ArrowLeft />
          </Button>
          <h1 className="text-xl font-bold">Manage Variants</h1>
        </div>

        <Button
          onClick={() => {
            setEditingVariant(null);
            setIsAddModalOpen(true);
          }}
        >
          <Plus className="mr-2" /> Add Variant
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {variants.map(v => (
              <TableRow key={v._id}>
                <TableCell>
                  {v.image ? (
                    <img src={v.image} className="h-12 w-12 object-cover rounded" alt={v.label} />
                  ) : (
                    <div className="h-12 w-12 bg-gray-200 rounded" />
                  )}
                </TableCell>
                <TableCell>{v.label}</TableCell>
                <TableCell>{v.value} {v.unit}</TableCell>
                <TableCell>₹{v.price.toFixed(2)}</TableCell>
                <TableCell>{v.stock}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button size="icon" variant="ghost" onClick={() => { setEditingVariant(v); setIsAddModalOpen(true); }}>
                    <Edit />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDeleteVariant(v._id)}>
                    <Trash2 className="text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <AddVariantModal
        open={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); setEditingVariant(null); }}
        onAdd={handleAddOrEditVariant}
        initialData={editingVariant}
        productName={product.name}
      />
    </div>
  );
}
