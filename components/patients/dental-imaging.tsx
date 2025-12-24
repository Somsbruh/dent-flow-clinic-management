"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, ImageIcon, Camera, X, Trash2, Edit, Save, ZoomIn, Calendar, FileImage } from "lucide-react"
import { dentalImages as initialImages, staff, type DentalImage } from "@/lib/data"
import { cn } from "@/lib/utils"

interface DentalImagingProps {
  patientId: string
}

const imageTypes = [
  { value: "intraoral", label: "Intraoral Photo", icon: "🦷" },
  { value: "extraoral", label: "Extraoral Photo", icon: "👤" },
  { value: "xray", label: "Periapical X-Ray", icon: "🔬" },
  { value: "panoramic", label: "Panoramic X-Ray", icon: "📷" },
  { value: "cbct", label: "CBCT / 3D Scan", icon: "🖥️" },
  { value: "other", label: "Other", icon: "📁" },
]

export function DentalImaging({ patientId }: DentalImagingProps) {
  const [images, setImages] = useState<DentalImage[]>(initialImages.filter((img) => img.patientId === patientId))
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<DentalImage | null>(null)
  const [editingImage, setEditingImage] = useState<DentalImage | null>(null)
  const [filterType, setFilterType] = useState<string>("all")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [newImage, setNewImage] = useState({
    type: "" as DentalImage["type"] | "",
    description: "",
    toothNumber: "",
    notes: "",
    imagePreview: "",
  })

  const doctors = staff.filter((s) => s.role === "dentist" || s.role === "hygienist")

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewImage({ ...newImage, imagePreview: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddImage = () => {
    if (newImage.type && newImage.description && newImage.imagePreview) {
      const image: DentalImage = {
        id: `DI${Date.now()}`,
        patientId,
        type: newImage.type as DentalImage["type"],
        description: newImage.description,
        toothNumber: newImage.toothNumber ? Number.parseInt(newImage.toothNumber) : undefined,
        imageUrl: newImage.imagePreview,
        uploadedAt: new Date().toISOString(),
        uploadedBy: "Dr. Sarah Chen", // Would come from auth in real app
        notes: newImage.notes || undefined,
      }
      setImages([image, ...images])
      setNewImage({ type: "", description: "", toothNumber: "", notes: "", imagePreview: "" })
      setIsUploadModalOpen(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleDeleteImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id))
    if (selectedImage?.id === id) setSelectedImage(null)
  }

  const handleUpdateImage = () => {
    if (editingImage) {
      setImages(images.map((img) => (img.id === editingImage.id ? editingImage : img)))
      setEditingImage(null)
    }
  }

  const filteredImages = filterType === "all" ? images : images.filter((img) => img.type === filterType)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTypeLabel = (type: string) => {
    return imageTypes.find((t) => t.value === type)?.label || type
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Dental Images & X-Rays</h2>
          <p className="text-sm text-muted-foreground">Intraoral, extraoral, and radiographic images</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px] neu-input">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent className="neu-card">
              <SelectItem value="all">All Images</SelectItem>
              {imageTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl neu-button bg-primary text-primary-foreground">
                <Camera className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
            </DialogTrigger>
            <DialogContent className="neu-card max-w-lg">
              <DialogHeader>
                <DialogTitle>Upload Dental Image</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* Image Upload Area */}
                <div className="space-y-2">
                  <Label>Image File</Label>
                  {newImage.imagePreview ? (
                    <div className="relative rounded-xl overflow-hidden border-2 border-dashed border-primary/30">
                      <img
                        src={newImage.imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-48 object-contain bg-gray-50"
                      />
                      <button
                        onClick={() => {
                          setNewImage({ ...newImage, imagePreview: "" })
                          if (fileInputRef.current) fileInputRef.current.value = ""
                        }}
                        className="absolute top-2 right-2 h-8 w-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-48 rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 cursor-pointer transition-colors neu-pressed">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <FileImage className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, JPEG up to 10MB</p>
                    </label>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Image Type</Label>
                    <Select
                      value={newImage.type}
                      onValueChange={(value) => setNewImage({ ...newImage, type: value as DentalImage["type"] })}
                    >
                      <SelectTrigger className="neu-input">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="neu-card">
                        {imageTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.icon} {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tooth # (Optional)</Label>
                    <Input
                      value={newImage.toothNumber}
                      onChange={(e) => setNewImage({ ...newImage, toothNumber: e.target.value })}
                      placeholder="e.g., 14"
                      className="neu-input"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={newImage.description}
                    onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                    placeholder="e.g., Periapical X-ray - Upper right quadrant"
                    className="neu-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Clinical Notes (Optional)</Label>
                  <Textarea
                    value={newImage.notes}
                    onChange={(e) => setNewImage({ ...newImage, notes: e.target.value })}
                    placeholder="Add any relevant clinical observations..."
                    className="neu-input"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsUploadModalOpen(false)} className="neu-button border-0">
                  Cancel
                </Button>
                <Button
                  onClick={handleAddImage}
                  disabled={!newImage.type || !newImage.description || !newImage.imagePreview}
                  className="neu-button bg-primary text-primary-foreground"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Image Categories Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {imageTypes.map((type) => {
          const count = images.filter((img) => img.type === type.value).length
          return (
            <button
              key={type.value}
              onClick={() => setFilterType(type.value === filterType ? "all" : type.value)}
              className={cn(
                "rounded-xl p-3 text-center transition-all neu-button",
                filterType === type.value ? "bg-primary text-primary-foreground" : "bg-background hover:bg-primary/5",
              )}
            >
              <span className="text-2xl">{type.icon}</span>
              <p className="text-xs mt-1 font-medium">{type.label}</p>
              <p
                className={cn(
                  "text-lg font-bold",
                  filterType === type.value ? "text-primary-foreground" : "text-foreground",
                )}
              >
                {count}
              </p>
            </button>
          )
        })}
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.length === 0 ? (
          <div className="col-span-full rounded-2xl bg-background p-8 text-center neu-card">
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No Images Found</h3>
            <p className="text-muted-foreground mb-4">
              {filterType === "all"
                ? "Upload dental images to start building the patient's imaging record."
                : `No ${getTypeLabel(filterType).toLowerCase()} images found.`}
            </p>
            {filterType === "all" && (
              <Button
                onClick={() => setIsUploadModalOpen(true)}
                className="neu-button bg-primary text-primary-foreground"
              >
                <Plus className="mr-2 h-4 w-4" />
                Upload First Image
              </Button>
            )}
          </div>
        ) : (
          filteredImages.map((image) => (
            <div
              key={image.id}
              className="rounded-2xl bg-background overflow-hidden neu-card group cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <div className="relative aspect-square">
                <img
                  src={image.imageUrl || "/placeholder.svg"}
                  alt={image.description}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <ZoomIn className="h-8 w-8 text-white" />
                </div>
                <span
                  className={cn(
                    "absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium",
                    image.type === "xray" || image.type === "panoramic" || image.type === "cbct"
                      ? "bg-blue-100 text-blue-700"
                      : image.type === "intraoral"
                        ? "bg-green-100 text-green-700"
                        : "bg-purple-100 text-purple-700",
                  )}
                >
                  {getTypeLabel(image.type)}
                </span>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-foreground truncate">{image.description}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(image.uploadedAt).split(",")[0]}
                  {image.toothNumber && (
                    <>
                      <span className="mx-1">•</span>
                      Tooth #{image.toothNumber}
                    </>
                  )}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Image Viewer Modal */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="neu-card max-w-4xl">
          {selectedImage && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>{selectedImage.description}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 neu-button"
                      onClick={() => {
                        setEditingImage(selectedImage)
                        setSelectedImage(null)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 neu-button"
                      onClick={() => handleDeleteImage(selectedImage.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <div className="rounded-xl overflow-hidden bg-gray-100 mb-4">
                  <img
                    src={selectedImage.imageUrl || "/placeholder.svg"}
                    alt={selectedImage.description}
                    className="w-full max-h-[60vh] object-contain"
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-medium text-foreground">{getTypeLabel(selectedImage.type)}</p>
                  </div>
                  {selectedImage.toothNumber && (
                    <div>
                      <p className="text-muted-foreground">Tooth Number</p>
                      <p className="font-medium text-foreground">#{selectedImage.toothNumber}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground">Uploaded</p>
                    <p className="font-medium text-foreground">{formatDate(selectedImage.uploadedAt)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Uploaded By</p>
                    <p className="font-medium text-foreground">{selectedImage.uploadedBy}</p>
                  </div>
                </div>
                {selectedImage.notes && (
                  <div className="mt-4 rounded-xl bg-primary/5 p-4">
                    <p className="text-sm font-medium text-primary mb-1">Clinical Notes</p>
                    <p className="text-sm text-foreground">{selectedImage.notes}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Image Modal */}
      <Dialog open={!!editingImage} onOpenChange={(open) => !open && setEditingImage(null)}>
        <DialogContent className="neu-card max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Image Details</DialogTitle>
          </DialogHeader>
          {editingImage && (
            <div className="grid gap-4 py-4">
              <div className="rounded-xl overflow-hidden border">
                <img
                  src={editingImage.imageUrl || "/placeholder.svg"}
                  alt={editingImage.description}
                  className="w-full h-40 object-cover"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={editingImage.description}
                  onChange={(e) => setEditingImage({ ...editingImage, description: e.target.value })}
                  className="neu-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Image Type</Label>
                  <Select
                    value={editingImage.type}
                    onValueChange={(value) => setEditingImage({ ...editingImage, type: value as DentalImage["type"] })}
                  >
                    <SelectTrigger className="neu-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="neu-card">
                      {imageTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tooth Number</Label>
                  <Input
                    value={editingImage.toothNumber || ""}
                    onChange={(e) =>
                      setEditingImage({
                        ...editingImage,
                        toothNumber: e.target.value ? Number.parseInt(e.target.value) : undefined,
                      })
                    }
                    placeholder="e.g., 14"
                    className="neu-input"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Clinical Notes</Label>
                <Textarea
                  value={editingImage.notes || ""}
                  onChange={(e) => setEditingImage({ ...editingImage, notes: e.target.value })}
                  className="neu-input"
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setEditingImage(null)} className="neu-button border-0">
              Cancel
            </Button>
            <Button onClick={handleUpdateImage} className="neu-button bg-primary text-primary-foreground">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
